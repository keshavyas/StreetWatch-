import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { GlassCard } from '../../components/GlassCard/GlassCard';
import { Canvas } from '@react-three/fiber';
import { RealEarth } from '../../components/3d/RealEarth/RealEarth';
import { Activity, ShieldAlert, Video, AlertTriangle } from 'lucide-react';

export const Dashboard = () => {
    const { user, isAdmin } = useAuth();
    const { getScans, mockStats } = useApi();
    const [recentScans, setRecentScans] = useState([]);

    useEffect(() => {
        const fetchRecent = async () => {
            if (!user) return;
            try {
                const scans = await getScans();
                if (scans && Array.isArray(scans)) {
                    // Sort by date desc and take top 5
                    const sorted = [...scans].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)).slice(0, 5);
                    setRecentScans(sorted);
                }
            } catch (error) {
                console.error("Dashboard Scans Error:", error);
            }
        };
        fetchRecent();
    }, [user, isAdmin]);

    const stats = [
        { label: 'Total Analyses', value: isAdmin ? (mockStats?.totalScans || 0) : recentScans.length, icon: Video, color: 'text-blue-400' },
        { label: 'Active Threats', value: isAdmin ? (mockStats?.activeThreats || 0) : recentScans.filter(s => s && s.status === 'PROCESSING').length, icon: ShieldAlert, color: 'text-red-400' },
        { label: 'System Health', value: (mockStats?.systemHealth || 98) + '%', icon: Activity, color: 'text-green-400' },
    ];

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">CCTV Command Center</h1>
                <p className="text-slate-400 mt-1">Real-time threat detection and monitoring across Indore.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <GlassCard key={i} hover={true} className="flex items-center gap-4">
                        <div className={`p-4 rounded-full bg-slate-800 ${stat.color} border border-slate-700 shadow-inner`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard className="min-h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <AlertTriangle className="text-cyan-400" size={20} />
                                Recent Scan Activity
                            </h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-cyan-500/20 text-slate-400 text-sm">
                                        <th className="pb-3 px-4 font-medium">Scan ID</th>
                                        <th className="pb-3 px-4 font-medium">Location</th>
                                        <th className="pb-3 px-4 font-medium">Threat Level</th>
                                        <th className="pb-3 px-4 font-medium">Status</th>
                                        <th className="pb-3 px-4 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentScans.map((scan) => (
                                        <tr key={scan._id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                                            <td className="py-4 px-4 font-mono text-cyan-400 text-sm">{scan._id}</td>
                                            <td className="py-4 px-4 text-white text-sm">{scan.location}</td>
                                            <td className="py-4 px-4">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                    scan.threatScore > 80 ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                                                    scan.threatScore > 50 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' :
                                                    'bg-green-500/20 text-green-400 border border-green-500/50'
                                                }`}>
                                                    {scan.threatScore}%
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                                    <span className={`w-2 h-2 rounded-full ${scan.status === 'COMPLETED' || scan.status === 'completed' ? 'bg-green-400' : 'bg-cyan-400 animate-pulse'}`} />
                                                    {scan.status}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-slate-400 text-sm">{new Date(scan.dateTime).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {recentScans.length === 0 && (
                                <div className="text-center py-8 text-slate-500">No recent scans found.</div>
                            )}
                        </div>
                    </GlassCard>
                </div>

                <div className="lg:col-span-1">
                    <GlassCard className="h-full min-h-[400px] flex flex-col relative overflow-hidden">
                        <h2 className="text-xl font-semibold text-white mb-4 relative z-10 w-full text-center">Indore Threat Map</h2>
                        <div className="flex-1 w-full h-full min-h-[300px] relative rounded-lg border border-cyan-500/20 bg-slate-900/80 mt-2">
                           <Canvas camera={{ position: [0, 0, 4] }}>
                               <RealEarth />
                           </Canvas>
                           <div className="absolute top-2 left-2 bg-slate-900/80 px-2 py-1 rounded text-xs text-slate-400 border border-slate-700">
                               LIVE : 8 Area Pins
                           </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};
