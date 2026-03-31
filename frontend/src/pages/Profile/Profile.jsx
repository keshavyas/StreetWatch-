import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/GlassCard/GlassCard';
import { User, Shield, Key } from 'lucide-react';

export const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <User className="text-cyan-400" />
                    Operator Identity
                </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <GlassCard className="flex flex-col items-center justify-center p-8 text-center bg-slate-800/50">
                        <div className="w-24 h-24 rounded-full bg-slate-700 border-2 border-cyan-500 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            <User size={40} className="text-slate-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">{user.name}</h2>
                        <p className="text-sm text-cyan-400 font-mono mt-1">{user.id}</p>
                        <div className="mt-4 px-3 py-1 bg-slate-900 border border-cyan-500/50 rounded-full text-xs font-bold tracking-widest text-white shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                            TIER: {user.tier || 'BASIC'}
                        </div>
                        <div className="mt-2 text-xs text-slate-500 uppercase">
                            Role: {user.role}
                        </div>
                    </GlassCard>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <GlassCard>
                        <h3 className="text-lg font-bold text-white border-b border-slate-700/50 pb-4 mb-4 flex items-center gap-2">
                            <Shield size={18} className="text-cyan-400" /> Basic Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase tracking-wider">Email Communication</label>
                                <p className="text-slate-300 mt-1 bg-slate-800/50 p-3 rounded">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase tracking-wider">Station Assignment</label>
                                <p className="text-slate-300 mt-1 bg-slate-800/50 p-3 rounded">Indore Central HQ</p>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <h3 className="text-lg font-bold text-white border-b border-slate-700/50 pb-4 mb-4 flex items-center gap-2">
                            <Key size={18} className="text-cyan-400" /> Security
                        </h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Access Keys</p>
                                <p className="text-sm text-slate-400">Last rotated: 45 days ago</p>
                            </div>
                            <button className="px-4 py-2 border border-slate-600 rounded bg-slate-800 hover:bg-slate-700 text-sm text-white transition">
                                Rotate Keys
                            </button>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};
