import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Lock, LogIn } from 'lucide-react';
import { GlassCard } from '../../components/GlassCard/GlassCard';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const res = await login(email, password);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.error);
        }
        setIsSubmitting(true); // Keep as true to show state change slightly or reset
        setTimeout(() => setIsSubmitting(false), 500); 
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />

            <GlassCard className="w-full max-w-md z-10 p-8 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 border border-cyan-500/50 shadow-[0_0_15px_rgba(16,182,212,0.5)]">
                        <Shield className="text-cyan-400" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Street<span className="text-cyan-400">Watch</span></h1>
                    <p className="text-slate-400 text-sm">Security & Threat Detection Platform</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                Authenticating...
                            </span>
                        ) : (
                            <>
                                <LogIn size={18} />
                                Secure Login
                            </>
                        )}
                    </button>
                    
                    <div className="pt-4 border-t border-slate-700 text-center">
                        <p className="text-sm text-slate-400">
                            New to StreetWatch?{' '}
                            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>

                    <div className="pt-2 flex justify-center gap-3 text-xs text-slate-500">
                        <button type="button" onClick={() => { setEmail('test@indore.com'); setPassword('test123'); }} className="hover:text-cyan-400 transition-colors px-2 py-1 rounded bg-slate-800/50">Test Operator</button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};
