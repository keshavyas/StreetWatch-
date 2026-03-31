import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/GlassCard/GlassCard';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Subscription = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Default tier is BASIC.
    const currentTier = user?.tier || 'BASIC';

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <header className="text-center mb-12">
                <h1 className="text-3xl font-bold text-white mb-2">Platform Upgrades</h1>
                <p className="text-slate-400">Scale your AI surveillance node instantly.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Basic Tier */}
                <GlassCard className={`flex flex-col relative ${currentTier === 'BASIC' ? 'border-cyan-500' : ''}`}>
                    {currentTier === 'BASIC' && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-600 px-3 py-1 text-xs font-bold rounded-full">CURRENT</div>}
                    <div className="p-6 border-b border-slate-700/50">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Star size={20} className="text-slate-400" /> BASIC</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-white">₹299</span><span className="text-slate-400">/mo</span>
                        </div>
                    </div>
                    <div className="p-6 flex-1 space-y-4">
                        <ul className="space-y-3 text-slate-300 text-sm">
                            <li className="flex items-center gap-2"><Check size={16} className="text-cyan-400" /> 10 Video Scans / day</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-cyan-400" /> 720p Resolution</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-cyan-400" /> 7-day Log History</li>
                        </ul>
                    </div>
                    <div className="p-6 mt-auto">
                        <button disabled={currentTier === 'BASIC'} onClick={() => navigate('/checkout/basic')} className="w-full btn-primary py-3 opacity-50 cursor-not-allowed">
                            {currentTier === 'BASIC' ? 'Active Plan' : 'Downgrade'}
                        </button>
                    </div>
                </GlassCard>

                {/* Pro Tier */}
                <GlassCard className={`flex flex-col relative transform ${currentTier === 'PRO' ? 'border-cyan-500' : 'md:-translate-y-4 shadow-[0_0_30px_rgba(6,182,212,0.1)]'}`}>
                    {currentTier === 'PRO' && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-600 px-3 py-1 text-xs font-bold rounded-full">CURRENT</div>}
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-600 to-blue-600 text-xs font-bold px-3 py-1 rounded-bl-lg text-white">RECOMMENDED</div>
                    <div className="p-6 border-b border-cyan-500/20">
                        <h3 className="text-xl font-bold text-cyan-400 mb-2 flex items-center gap-2"><Zap size={20} /> PROFESSIONAL</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-white">₹799</span><span className="text-slate-400">/mo</span>
                        </div>
                    </div>
                    <div className="p-6 flex-1 space-y-4">
                        <ul className="space-y-3 text-slate-300 text-sm">
                            <li className="flex items-center gap-2"><Check size={16} className="text-cyan-400" /> Unlimited Video Scans</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-cyan-400" /> 4K Neural processing</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-cyan-400" /> 1-Year Logging</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-cyan-400" /> Real-time SMS</li>
                        </ul>
                    </div>
                    <div className="p-6 mt-auto">
                        <button onClick={() => navigate('/checkout/pro')} disabled={currentTier === 'PRO'} className={`w-full py-3 rounded-lg font-medium transition ${currentTier === 'PRO' ? 'bg-slate-700 text-white opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:from-cyan-500 hover:to-blue-500'}`}>
                            {currentTier === 'PRO' ? 'Active Plan' : 'Upgrade to Pro'}
                        </button>
                    </div>
                </GlassCard>

                {/* Enterprise Tier */}
                <GlassCard className={`flex flex-col relative bg-slate-900 border-yellow-500/30 ${currentTier === 'ENTERPRISE' ? 'border-yellow-500' : ''}`}>
                    {currentTier === 'ENTERPRISE' && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-600 px-3 py-1 text-xs font-bold rounded-full">CURRENT</div>}
                    <div className="p-6 border-b border-yellow-500/20">
                        <h3 className="text-xl font-bold text-yellow-500 mb-2 flex items-center gap-2"><Crown size={20} /> ENTERPRISE</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-white">₹1999</span><span className="text-slate-400">/mo</span>
                        </div>
                    </div>
                    <div className="p-6 flex-1 space-y-4">
                        <ul className="space-y-3 text-slate-300 text-sm">
                            <li className="flex items-center gap-2"><Check size={16} className="text-yellow-500" /> Priority Server Queues</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-yellow-500" /> Custom Training Models</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-yellow-500" /> Forever immutable storage</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-yellow-500" /> Direct Police Node link</li>
                        </ul>
                    </div>
                    <div className="p-6 mt-auto">
                        <button onClick={() => navigate('/checkout/enterprise')} disabled={currentTier === 'ENTERPRISE'} className={`w-full py-3 rounded-lg font-medium transition ${currentTier === 'ENTERPRISE' ? 'bg-slate-700 text-white opacity-50 cursor-not-allowed' : 'border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10'}`}>
                            {currentTier === 'ENTERPRISE' ? 'Active Plan' : 'Contact Sales & Upgrade'}
                        </button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
