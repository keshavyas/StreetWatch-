import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <nav className="h-16 border-b border-cyan-500/20 bg-slate-900/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3 text-cyan-400 font-bold text-xl tracking-wider">
                <Shield size={28} className="text-cyan-400" />
                <span>Street<span className="text-white">Watch</span></span>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-slate-300">
                    <User size={18} />
                    <span className="text-sm">{user.name} ({user.role})</span>
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </nav>
    );
};
