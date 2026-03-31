import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/GlassCard/GlassCard';
import { CheckCircle, ShieldCheck, Lock } from 'lucide-react';

export const Checkout = () => {
    const { tier } = useParams();
    const navigate = useNavigate();
    const { updateTier } = useAuth();
    
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const prices = {
        'basic': '₹299',
        'pro': '₹799',
        'enterprise': '₹1999'
    };
    
    const displayTier = tier ? tier.toUpperCase() : 'PRO';

    const handlePay = () => {
        setProcessing(true);
        // Simulate Stripe delay
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            updateTier(displayTier);
            
            // Redirect back to profile after seeing confetti
            setTimeout(() => {
                navigate('/profile');
            }, 4000);
        }, 1500);
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <Confetti numberOfPieces={400} recycle={false} />
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(74,222,128,0.3)]">
                    <CheckCircle size={48} className="text-green-400" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Node Upgraded</h2>
                <p className="text-slate-400 text-lg">Thank you! Your AI surveillance tier is now {displayTier}.</p>
                <p className="text-slate-500 text-sm mt-4 animate-pulse">Redirecting to operator profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <header className="text-center mb-4">
                <h1 className="text-2xl font-bold text-white mb-2 flex justify-center items-center gap-2"><ShieldCheck className="text-cyan-400" /> Secure Checkout</h1>
                <p className="text-slate-400">Upgrade to {displayTier} tier securely.</p>
            </header>

            <GlassCard className="p-8">
                <div className="flex justify-between items-end mb-8 border-b border-slate-700/50 pb-6">
                    <div>
                        <p className="text-slate-400 text-sm tracking-wider uppercase mb-1">Total Due</p>
                        <h2 className="text-3xl font-extrabold text-white">{prices[tier] || '₹799'}</h2>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div>
                        <label className="text-xs text-slate-500 uppercase tracking-widest mb-2 block">Cardholder Name</label>
                        <input type="text" defaultValue="John Operator" className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 uppercase tracking-widest mb-2 block">Card Details (Simulated)</label>
                        <div className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-3 flex items-center gap-3">
                            <span className="text-slate-300 tracking-widest flex-1 font-mono">**** **** **** 4242</span>
                            <span className="text-slate-500 text-sm">12/26</span>
                            <span className="text-slate-500 text-sm">CVC: ***</span>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handlePay} 
                    disabled={processing}
                    className="w-full btn-primary py-4 font-bold flex justify-center items-center gap-2"
                >
                    {processing ? (
                        <>Processing Neural Handshake...</>
                    ) : (
                        <><Lock size={18} /> Pay {prices[tier] || '₹799'}</>
                    )}
                </button>
                <div className="text-center mt-4 text-xs text-slate-500 flex items-center justify-center gap-1">
                    Powered by Stripe Mock Testing
                </div>
            </GlassCard>
        </div>
    );
};
