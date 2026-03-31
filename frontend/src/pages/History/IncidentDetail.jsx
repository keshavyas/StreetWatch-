import React, { useState } from 'react';
import { GlassCard } from '../../components/GlassCard/GlassCard';
import { X, Calendar, MapPin, Target, ShieldAlert, FileDown, Activity, CheckCircle, Loader2 } from 'lucide-react';
import { generateIncidentPDF } from '../../services/pdfGenerator';

export const IncidentDetail = ({ scan, onClose }) => {
    const [pdfStatus, setPdfStatus] = useState('idle'); // idle | generating | done | error

    if (!scan) return null;

    const handleExportPDF = async () => {
        setPdfStatus('generating');
        try {
            // Small delay for UX feedback
            await new Promise(r => setTimeout(r, 800));
            generateIncidentPDF(scan);
            setPdfStatus('done');
            setTimeout(() => setPdfStatus('idle'), 3000);
        } catch (err) {
            console.error('PDF generation error', err);
            setPdfStatus('error');
            setTimeout(() => setPdfStatus('idle'), 3000);
        }
    };

    // Helper to format date if string
    const formattedDate = isNaN(new Date(scan.dateTime).getTime()) 
        ? scan.dateTime 
        : new Date(scan.dateTime).toLocaleString();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <GlassCard className="!p-8 shadow-2xl border-cyan-500/30">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-full transition-all"
                    >
                        <X size={24} />
                    </button>

                    <div className="space-y-6">
                        {/* Header */}
                        <div className="border-b border-slate-700 pb-6 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <ShieldAlert className="text-red-500" />
                                    Incident Report: {scan._id}
                                </h2>
                                <div className="mt-3 flex gap-4 text-sm text-slate-400">
                                    <span className="flex items-center gap-1"><Calendar size={16}/> {formattedDate}</span>
                                    <span className="flex items-center gap-1"><MapPin size={16}/> {scan.location}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Confidence</p>
                                <span className={`text-3xl font-bold ${scan.threatScore > 80 ? 'text-red-500' : 'text-orange-500'}`}>
                                    {scan.threatScore}%
                                </span>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Photo Thumbnail */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Target size={16} /> Key Frame Analysis
                                </h3>
                                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-slate-700 shadow-lg relative">
                                    <img 
                                        src={scan.photoUrl || `https://picsum.photos/seed/${scan._id}/800/450`} 
                                        alt="Incident Thumbnail" 
                                        className="w-full h-full object-cover"
                                        crossOrigin="anonymous"
                                    />
                                    <div className="absolute top-3 right-3 bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded shadow text-center border border-red-400 animate-pulse">
                                        {scan.type}
                                    </div>
                                </div>
                                
                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-center">
                                        <p className="text-xs text-slate-500 uppercase">Timeline</p>
                                        <p className="text-sm text-cyan-400 font-mono font-bold mt-1">
                                            {scan.incidents?.[0]?.timestamp || '00:45-52s'}
                                        </p>
                                    </div>
                                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-center">
                                        <p className="text-xs text-slate-500 uppercase">Location</p>
                                        <p className="text-sm text-white font-medium mt-1">{scan.location}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Activity size={16} /> Activity Log
                                    </h3>
                                    <div className="space-y-3">
                                        {scan.incidents.map((inc, i) => (
                                            <div key={i} className="flex gap-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                                                <div className="text-cyan-400 font-mono text-sm bg-cyan-900/40 px-2 py-1 h-fit rounded">{inc.timestamp}</div>
                                                <div>
                                                    <p className="text-sm text-slate-200">{inc.description}</p>
                                                    <p className="text-xs text-slate-500 mt-1 uppercase">Severity: <span className={inc.severity === 'CRITICAL' ? 'text-red-400' : 'text-orange-400'}>{inc.severity}</span></p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                                    <h4 className="text-sm font-medium text-slate-300 mb-2">System Status</h4>
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Status: <span className="text-green-400">{scan.status}</span></span>
                                        <span>Duration: {scan.duration}s</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 pt-6 border-t border-slate-700 flex justify-end gap-4">
                        <button 
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                        >
                            Close
                        </button>
                        <button 
                            onClick={handleExportPDF}
                            disabled={pdfStatus === 'generating'}
                            className="btn-primary flex items-center gap-2 px-6 py-2 disabled:opacity-50"
                        >
                            {pdfStatus === 'generating' ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Generating PDF...
                                </>
                            ) : pdfStatus === 'done' ? (
                                <>
                                    <CheckCircle size={18} className="text-green-300" />
                                    Downloaded!
                                </>
                            ) : pdfStatus === 'error' ? (
                                <>
                                    <X size={18} className="text-red-300" />
                                    Failed — Retry
                                </>
                            ) : (
                                <>
                                    <FileDown size={18} />
                                    Download Official Report PDF
                                </>
                            )}
                        </button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
