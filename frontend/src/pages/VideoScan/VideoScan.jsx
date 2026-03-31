import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Canvas } from '@react-three/fiber';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { GlassCard } from '../../components/GlassCard/GlassCard';
import { ScanningCylinder } from '../../components/3d/ScanningCylinder/ScanningCylinder';
import { UploadCloud, FileVideo, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const VideoScan = () => {
    const { user } = useAuth();
    const { processVideoPayload, loading } = useApi();
    const navigate = useNavigate();
    
    const [file, setFile] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [progress, setProgress] = useState(0);

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop,
        accept: {'video/*': ['.mp4', '.avi', '.mov']},
        maxFiles: 1
    });

    const handleScan = async () => {
        if (!file) return;
        setScanning(true);
        
        // Custom progress bar simulation
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return p + 10;
            });
        }, 300);

        const result = await processVideoPayload(file);
        
        clearInterval(interval);
        setProgress(100);
        
        if (result && result._id) {
            setTimeout(() => {
                navigate(`/result/${result._id}`);
            }, 800);
        } else {
            setScanning(false);
            console.error("Scan result missing ID");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <ShieldAlert className="text-cyan-400" />
                    AI Incident Scanner
                </h1>
                <p className="text-slate-400 mt-2">Upload CCTV footage for real-time anomaly, fire, and theft detection.</p>
            </header>

            {!file && (
                <GlassCard className="border-dashed border-2 border-cyan-500/30 hover:border-cyan-400/60 transition-colors p-0 overflow-hidden">
                    <div {...getRootProps()} className="p-16 flex flex-col items-center justify-center cursor-pointer min-h-[300px]">
                        <input {...getInputProps()} />
                        <div className={`p-6 rounded-full bg-slate-800/80 mb-6 transition-transform ${isDragActive ? 'scale-110' : ''}`}>
                            <UploadCloud size={48} className="text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">Drag & Drop Video File</h3>
                        <p className="text-slate-400 text-sm text-center">
                            Supports MP4, AVI, MOV up to 100MB<br />
                            or click to browse
                        </p>
                    </div>
                </GlassCard>
            )}

            {file && !scanning && (
                <GlassCard className="flex items-center justify-between p-6 bg-slate-800/50">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-900 rounded flex items-center justify-center border border-slate-700 text-cyan-500">
                            <FileVideo size={32} />
                        </div>
                        <div>
                            <p className="font-semibold text-white">{file.name}</p>
                            <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <button 
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-white transition-colors"
                            onClick={() => setFile(null)}
                        >
                            Cancel
                        </button>
                        <button 
                            className="btn-primary"
                            onClick={handleScan}
                        >
                            Start Analysis Scan
                        </button>
                    </div>
                </GlassCard>
            )}

            {scanning && (
                <GlassCard className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
                        {progress === 100 ? (
                            <><CheckCircle2 className="text-green-400" /> Analysis Complete</>
                        ) : (
                            'Scanning Temporal Multi-Frames...'
                        )}
                    </h3>
                    
                    <div className="w-[300px] h-[300px] relative mb-8">
                        <Canvas camera={{ position: [0, 0, 3] }}>
                             <ScanningCylinder />
                        </Canvas>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-4xl font-mono text-white font-bold">{progress}%</span>
                        </div>
                    </div>

                    <div className="w-full max-w-md bg-slate-800 rounded-full h-2 mb-4 overflow-hidden shadow-inner">
                        <div 
                            className="bg-cyan-500 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_#00f2fe]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-slate-400 text-sm animate-pulse">Running Neural Networks against Threat Catalog M-72</p>
                </GlassCard>
            )}
        </div>
    );
};
