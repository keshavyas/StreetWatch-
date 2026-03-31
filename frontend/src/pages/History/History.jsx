import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { GlassCard } from '../../components/GlassCard/GlassCard';
import { History as HistoryIcon, Eye, Search, Filter } from 'lucide-react';
import { IncidentDetail } from './IncidentDetail';

export const History = () => {
    const { user, isAdmin } = useAuth();
    const { getScans, loading } = useApi();
    const navigate = useNavigate();
    const [scans, setScans] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedScan, setSelectedScan] = useState(null);

    useEffect(() => {
        const fetchScans = async () => {
            if (!user) return;
            try {
                const data = await getScans();
                if (data && Array.isArray(data)) {
                    setScans(data.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)));
                }
            } catch (error) {
                console.error("History Scans Error:", error);
            }
        };
        fetchScans();
    }, [user, isAdmin]);

    const filteredScans = scans.filter(scan => 
        scan._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        scan.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <HistoryIcon className="text-cyan-400" />
                        Scan History
                    </h1>
                    <p className="text-slate-400 mt-2">Comprehensive log of all AI video analyses.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by ID or Location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 text-sm w-64"
                        />
                    </div>
                    <button className="p-2 border border-slate-700 bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors">
                        <Filter size={18} />
                    </button>
                </div>
            </header>

            <GlassCard className="overflow-hidden">
                {loading ? (
                    <div className="text-center py-12 text-cyan-400 animate-pulse">Fetching AI processing logs...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-cyan-500/20 text-slate-400 text-sm uppercase tracking-wider bg-slate-800/50">
                                    <th className="py-4 px-6 font-medium">Scan ID</th>
                                    <th className="py-4 px-6 font-medium">Date & Time</th>
                                    <th className="py-4 px-6 font-medium">Location</th>
                                    <th className="py-4 px-6 font-medium">Threat Type</th>
                                    <th className="py-4 px-6 font-medium">Score</th>
                                    <th className="py-4 px-6 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredScans.map((scan) => (
                                    <tr key={scan._id} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                                        <td className="py-4 px-6 font-mono text-cyan-400 font-medium">{scan._id}</td>
                                        <td className="py-4 px-6 text-slate-300 text-sm">{
                                            isNaN(new Date(scan.dateTime).getTime()) 
                                                ? scan.dateTime 
                                                : new Date(scan.dateTime).toLocaleString()
                                        }</td>
                                        <td className="py-4 px-6 text-white">{scan.location}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                scan.type === 'FIRE' || scan.type === 'FIRE / THEFT' ? 'bg-red-500/20 text-red-500' :
                                                scan.type === 'THEFT' ? 'bg-orange-500/20 text-orange-500' :
                                                'bg-blue-500/20 text-blue-500'
                                            }`}>
                                                {scan.type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="w-full bg-slate-700 rounded-full h-1.5 w-16 mb-1 overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${scan.threatScore > 75 ? 'bg-red-500' : 'bg-green-500'}`} 
                                                    style={{ width: `${scan.threatScore}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-400">{scan.threatScore}/100</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <button 
                                                onClick={() => setSelectedScan(scan)}
                                                className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition-all"
                                                title="View Report Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredScans.length === 0 && (
                            <div className="text-center py-12 text-slate-500 text-lg">No records found.</div>
                        )}
                    </div>
                )}
            </GlassCard>

            {selectedScan && (
                <IncidentDetail 
                    scan={selectedScan} 
                    onClose={() => setSelectedScan(null)} 
                />
            )}
        </div>
    );
};
