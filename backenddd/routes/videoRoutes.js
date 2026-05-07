const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { scanVideo } = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads/'));
    },


    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    console.log('Received file for upload:', file.originalname, file.mimetype);
    const isVideo = file.mimetype.startsWith('video/');
    const allowedExts = /mp4|avi|mov|mkv|webm/;
    const hasAllowedExt = allowedExts.test(path.extname(file.originalname).toLowerCase());

    if (isVideo || hasAllowedExt) {
        cb(null, true);
    } else {
        console.error('File rejected by filter:', file.originalname, file.mimetype);
        cb(new Error('Only video files are allowed!'));
    }
};



const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: fileFilter
});

// @route   POST /api/video/scan
router.post('/scan', protect, upload.single('video'), scanVideo);

module.exports = router;
