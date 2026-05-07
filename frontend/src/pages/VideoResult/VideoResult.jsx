import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { GlassCard } from '../../components/GlassCard/GlassCard';
import { Canvas } from '@react-three/fiber';
import { TimelineHelix } from '../../components/3d/TimelineHelix/TimelineHelix';
import { FileDown, Calendar, MapPin, AlertTriangle, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { LayoutDashboard } from 'lucide-react';

export const VideoResult = () => {
    const { id } = useParams();
    const { getScanById, loading } = useApi();
    const navigate = useNavigate();
    const [scanData, setScanData] = useState(null);
    const [videoProgress, setVideoProgress] = useState(0);
    const reportRef = useRef();

    useEffect(() => {
        const fetchResult = async () => {
            const data = await getScanById(id);
            if (data) setScanData(data);
        };
        fetchResult();
    }, [id]);

    const handleExportPDF = async () => {
        if (!reportRef.current || !scanData) {
            console.error('Export failed: missing ref or data');
            return;
        }
        
        try {
            console.log('Starting PDF Export...');
            const element = reportRef.current;
            
            // Wait for any images to load just in case
            const images = element.getElementsByTagName('img');
            await Promise.all(Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
            }));

            const canvas = await html2canvas(element, { 
                useCORS: true, 
                logging: false,
                backgroundColor: '#0f172a',
                scale: 1.5,
                scrollX: 0,
                scrollY: -window.scrollY,
                onclone: (clonedDoc) => {
                    // Aggressive fix for oklch(), oklab() and other modern colors
                    const allElements = clonedDoc.getElementsByTagName('*');
                    for (let i = 0; i < allElements.length; i++) {
                        const el = allElements[i];
                        const style = window.getComputedStyle(el);
                        
                        ['backgroundColor', 'color', 'borderColor', 'outlineColor', 'fill', 'stroke'].forEach(prop => {
                            if (style[prop] && (style[prop].includes('oklch') || style[prop].includes('oklab'))) {
                                // Force standard colors for PDF compatibility
                                if (prop === 'color') el.style.color = '#f8fafc';
                                else if (prop === 'backgroundColor') el.style.backgroundColor = '#0f172a';
                                else el.style[prop] = '#334155';
                            }
                        });
                    }
                }


            });
            
            const imgData = canvas.toDataURL('image/jpeg', 0.8);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`AI-CCTV-Report-${scanData._id}.pdf`);
            console.log('PDF Export successful');
        } catch (err) {
            console.error('PDF generation error details:', err);
            alert('PDF Export failed: ' + err.message);
        }
    };




    if (loading || !scanData) return <div className="p-8 text-center text-cyan-400 text-xl">Loading Result...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
                    <ArrowLeft size={16} /> Back
                </button>
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors"
                >
                    <LayoutDashboard size={18} /> Back to Dashboard
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-2/3 space-y-6" ref={reportRef}>
                    <GlassCard>
                        <div className="flex justify-between items-start mb-6 border-b border-slate-700/50 pb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Incident Report: {scanData._id}</h1>
                                <div className="flex gap-4 text-sm text-slate-400">
                                    <span className="flex items-center gap-1"><Calendar size={14}/> {isNaN(new Date(scanData.dateTime).getTime()) ? scanData.dateTime : new Date(scanData.dateTime).toLocaleString()}</span>
                                    <span className="flex items-center gap-1"><MapPin size={14}/> {scanData.location}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Threat Assessment</p>
                                <span className={`text-2xl font-bold ${scanData.threatScore > 80 ? 'text-red-500' : 'text-orange-500'}`}>
                                    {scanData.threatScore}%
                                </span>
                            </div>
                        </div>

                        <div className="aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 relative shadow-lg">
                            <img 
                                src={scanData.photoUrl || `https://picsum.photos/seed/${scanData._id}/800/450`}
                                alt="Incident Frame"
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                            />
                            
                            {/* Threat Overlay Simulator */}
                            <div className="absolute top-4 right-4 bg-red-500/90 px-4 py-2 text-white text-sm font-black rounded-lg animate-pulse border-2 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)] backdrop-blur-sm tracking-tighter">
                                AI: {scanData.type.includes('DETECTED') ? scanData.type : `${scanData.type} DETECTED`}
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <h3 className="text-lg font-medium text-white flex gap-2 items-center">
                                <AlertTriangle className="text-yellow-400" size={18} />
                                Timeline Events
                            </h3>
                            {scanData.incidents.map((inc, i) => (
                                <div key={i} className="flex gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                                    <div className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-1 h-fit rounded">{inc.timestamp}</div>
                                    <div>
                                        <p className="font-medium text-slate-200">{inc.description}</p>
                                        <div className="flex gap-4 mt-1">
                                            <p className="text-xs text-slate-400 uppercase">Severity: <span className={inc.severity === 'CRITICAL' || inc.severity === 'HIGH' ? 'text-red-400' : 'text-orange-400'}>{inc.severity}</span></p>
                                            <p className="text-xs text-slate-400 uppercase">Confidence: <span className="text-cyan-400">{inc.confidence}%</span></p>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                <div className="w-full md:w-1/3 space-y-6 sticky top-8">
                    <GlassCard>
                        <h3 className="font-semibold text-white mb-2">3D Temporal Analysis</h3>
                        <p className="text-xs text-slate-400 mb-4">Tracking threat progression over mapped timeline.</p>
                        <div className="h-[250px] w-full rounded-lg bg-slate-900 border border-cyan-500/20 shadow-inner overflow-hidden">
                            <Canvas camera={{ position: [0, 2, 8] }}>
                                <TimelineHelix progress={videoProgress} />
                            </Canvas>
                        </div>
                    </GlassCard>

                    <button 
                        onClick={handleExportPDF}
                        className="w-full btn-primary flex justify-center items-center gap-2 py-3"
                    >
                        <FileDown size={18} />
                        Export PDF Report
                    </button>
                    
                    <GlassCard className="bg-slate-800/30">
                        <h4 className="text-white text-sm font-semibold mb-2">Automated Actions Taken</h4>
                        <ul className="text-sm text-slate-400 space-y-2 list-disc pl-5">
                            <li>Alerted Local Authority (Indore HQ)</li>
                            <li>Logged to immutable ledger</li>
                            <li>SMS sent to Primary Contact</li>
                        </ul>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};
