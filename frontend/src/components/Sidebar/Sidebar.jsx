import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, ScanLine, ShieldAlert, CreditCard, UserCircle, Settings, Menu, X, Newspaper } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
    const { isAdmin } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/scan', icon: ScanLine, label: 'Video Scan' },
        { path: '/history', icon: History, label: 'Scan History' },
        { path: '/news', icon: Newspaper, label: 'News Alerts' },
        { path: '/tips', icon: ShieldAlert, label: 'Security Tips' },
        { path: '/subscription', icon: CreditCard, label: 'Subscription' },
        { path: '/profile', icon: UserCircle, label: 'Profile' },
    ];

    if (isAdmin) {
        navItems.splice(4, 0, { path: '/admin', icon: Settings, label: 'Admin Panel' });
    }

    return (
        <>
            {/* Mobile Hamburger toggle */}
            <button 
                onClick={toggleSidebar} 
                className="md:hidden fixed bottom-6 right-6 z-50 bg-cyan-600 text-white p-3 rounded-full shadow-lg shadow-cyan-500/50"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar container */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-40
                w-64 bg-slate-900 border-r border-cyan-500/20 px-4 py-8
                transform transition-transform duration-300 ease-in-out flex flex-col gap-2
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="md:hidden text-cyan-400 font-bold text-2xl mb-8 tracking-wider text-center border-b border-cyan-500/20 pb-4">
                    AI-CCTV<span className="text-white">INDORE</span>
                </div>

                <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300
                                ${isActive 
                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                            `}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </aside>
            
            {/* Mobile overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" 
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
};
