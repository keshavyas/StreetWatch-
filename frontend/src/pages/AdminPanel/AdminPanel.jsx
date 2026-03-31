import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/GlassCard/GlassCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, AlertOctagon, TrendingUp, Settings } from 'lucide-react';

export const AdminPanel = () => {
    const { isAdmin } = useAuth();
    const { getScans, loading } = useApi();
    const navigate = useNavigate();
    const [scans, setScans] = useState([]);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/dashboard');
        }
        const fetchAll = async () => {
            const data = await getScans('admin', true);
            setScans(data);
        };
        fetchAll();
    }, [isAdmin, navigate]);

    // Data Processing for Charts
    const locationData = scans.reduce((acc, scan) => {
        const found = acc.find(item => item.name === scan.location);
        if (found) found.value++;
        else acc.push({ name: scan.location, value: 1 });
        return acc;
    }, []);

    const typeData = scans.reduce((acc, scan) => {
        const found = acc.find(item => item.name === scan.type);
        if (found) found.value++;
        else acc.push({ name: scan.type, value: 1 });
        return acc;
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#ef4444', '#a855f7'];

    if (loading) return <div className="text-cyan-400 animate-pulse p-8">Loading Global Systems...</div>;

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Settings className="text-cyan-400" />
                    Global Command Center
                </h1>
                <p className="text-slate-400 mt-2">Administrative oversight of all {scans.length} system deployments.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <GlassCard className="flex items-center gap-4 bg-red-900/20 border-red-500/30">
                    <div className="p-4 rounded-full bg-red-500/20 text-red-500">
                        <AlertOctagon size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Critical Incidents (24h)</p>
                        <h3 className="text-2xl font-bold text-white tracking-widest">{scans.filter(s => s.threatScore > 80).length}</h3>
                    </div>
                </GlassCard>
                <GlassCard className="flex items-center gap-4">
                    <div className="p-4 rounded-full bg-cyan-500/20 text-cyan-500">
                        <Users size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Active Operators</p>
                        <h3 className="text-2xl font-bold text-white tracking-widest">14 <span className="text-xs text-green-400">↑ 12%</span></h3>
                    </div>
                </GlassCard>
                <GlassCard className="flex items-center gap-4">
                    <div className="p-4 rounded-full bg-purple-500/20 text-purple-500">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Average Processing Time</p>
                        <h3 className="text-2xl font-bold text-white tracking-widest">3.2s</h3>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GlassCard className="h-[400px] flex flex-col">
                    <h3 className="font-semibold text-white mb-6">Threat Distribution by Location</h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={locationData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis type="number" stroke="#94a3b8" />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{fontSize: 12}} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px' }}
                                />
                                <Bar dataKey="value" fill="#00f2fe" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                <GlassCard className="h-[400px] flex flex-col">
                    <h3 className="font-semibold text-white mb-6">Incident Typology</h3>
                    <div className="flex-1 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {typeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
