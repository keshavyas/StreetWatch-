const path = require('path');
const fs = require('fs-extra');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const Scan = require('../models/Scan');
const User = require('../models/User');
const aiService = require('../services/aiService');


// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

/**
 * @desc    Process uploaded video for AI scanning
 * @route   POST /api/video/scan
 * @access  Private
 */
const scanVideo = async (req, res) => {
    let framesDir = '';
    let videoPath = '';

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        const user = await User.findById(req.user._id);
        if (user.scansLeft <= 0) {
            await fs.remove(req.file.path);
            return res.status(400).json({ message: 'No scans left. Please upgrade your plan.' });
        }

        videoPath = req.file.path;
        const uploadId = Date.now().toString();
        framesDir = path.join(process.cwd(), 'temp/frames', uploadId);


        await fs.ensureDir(framesDir);

        // 1. Extract frames using FFmpeg
        await new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .on('end', () => resolve())
                .on('error', (err) => reject(err))
                .outputOptions('-vf', 'fps=1')
                .output(path.join(framesDir, 'frame-%03d.png'))
                .run();
        });

        let frameFiles = await fs.readdir(framesDir);
        frameFiles = frameFiles.sort().slice(0, 15);

        const results = [];
        let fireDetected = false;
        let accidentDetected = false;
        let theftDetected = false;
        let bestFrame = null;
        let maxConfidence = 0;

        for (const frame of frameFiles) {
            const framePath = path.join(framesDir, frame);
            const predictions = await aiService.analyzeFrame(framePath, req.file.originalname);
            const categorized = aiService.categorizePredictions(predictions);

            const frameNumber = parseInt(frame.match(/\d+/)[0]);
            const timestamp = `00:${frameNumber.toString().padStart(2, '0')}`;

            let frameHasDetection = false;

            if (categorized.fire.length > 0) {
                fireDetected = true;
                frameHasDetection = true;
                categorized.fire.forEach(p => {
                    results.push({ type: 'fire', confidence: p.confidence, timestamp, description: 'Fire detected' });
                    if (p.confidence > maxConfidence) {
                        maxConfidence = p.confidence;
                        bestFrame = framePath;
                    }
                });
            }
            if (categorized.accident.length > 0) {
                accidentDetected = true;
                frameHasDetection = true;
                categorized.accident.forEach(p => {
                    results.push({ type: 'accident', confidence: p.confidence, timestamp, description: 'Accident case detected' });
                    if (p.confidence > maxConfidence) {
                        maxConfidence = p.confidence;
                        bestFrame = framePath;
                    }
                });
            }
            if (categorized.theft.length > 0) {
                theftDetected = true;
                frameHasDetection = true;
                categorized.theft.forEach(p => {
                    results.push({ type: 'theft', confidence: p.confidence, timestamp, description: 'Suspicious activity detected' });
                    if (p.confidence > maxConfidence) {
                        maxConfidence = p.confidence;
                        bestFrame = framePath;
                    }
                });
            }
        }

        // 3. Save the best frame to uploads if any detection exists, otherwise save the first frame
        let savedPhotoUrl = '';
        const targetFrame = bestFrame || (frameFiles.length > 0 ? path.join(framesDir, frameFiles[0]) : null);
        
        if (targetFrame) {
            const photoName = `incident-${Date.now()}.png`;
            const photoPath = path.join(process.cwd(), 'uploads', photoName);
            await fs.copy(targetFrame, photoPath);
            // Include full backend URL for frontend access
            const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
            savedPhotoUrl = `${backendUrl}/uploads/${photoName}`;
        }



        // Aggregate detections for the Scan model
        const incidents = results.map(r => ({
            timestamp: r.timestamp,
            description: r.description,
            severity: r.type === 'fire' ? 'CRITICAL' : (r.type === 'accident' ? 'HIGH' : 'MEDIUM'),
            confidence: Math.round(r.confidence * 100)
        }));

        // Calculate threat score
        let threatScore = 0;
        if (fireDetected) threatScore += 80; 
        if (accidentDetected) threatScore += 70;
        if (theftDetected) threatScore += 50;
        threatScore = Math.min(threatScore, 100);

        // Determine main type
        const types = [];
        if (fireDetected) types.push('FIRE');
        if (accidentDetected) types.push('ACCIDENT CASE');
        if (theftDetected) types.push('THEFT');
        const typeStr = types.length > 0 ? types.join(' / ') : 'NORMAL';

        // Save to DB
        const scan = await Scan.create({
            userId: req.user._id,
            incidents: incidents.length > 0 ? incidents : [{ timestamp: '00:00', description: 'No immediate threats detected', severity: 'LOW', confidence: 100 }],
            location: 'Uploaded Video Feed',
            threatScore: threatScore,
            type: typeStr,
            dateTime: new Date(),
            status: 'completed',
            photoUrl: savedPhotoUrl // Added photoUrl
        });

        // Decrement user scans
        user.scansLeft -= 1;
        await user.save();

        // Cleanup
        await fs.remove(videoPath);
        await fs.remove(framesDir);

        res.status(200).json({
            success: true,
            scan,
            summary: {
                fireDetected,
                accidentDetected,
                theftDetected
            },
            totalFramesAnalyzed: frameFiles.length
        });

    } catch (error) {
        console.error('Video processing error:', error);
        // Log error to a file for easier debugging
        const errorLog = `${new Date().toISOString()} - ${error.stack}\n`;
        await fs.appendFile(path.join(process.cwd(), 'error.log'), errorLog).catch(() => {});
        
        // Cleanup on error
        if (videoPath) await fs.remove(videoPath).catch(() => {});
        if (framesDir) await fs.remove(framesDir).catch(() => {});

        res.status(500).json({ 
            message: 'Internal server error during video processing', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }


};

module.exports = {
    scanVideo
};
