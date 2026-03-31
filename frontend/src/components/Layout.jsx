import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar/Navbar';
import { Sidebar } from './Sidebar/Sidebar';

export const Layout = () => {
    return (
        <div className="h-screen w-full bg-slate-800 flex flex-col overflow-hidden text-slate-200 font-sans">
            <Navbar />
            <div className="flex-1 flex overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 bg-slate-900/50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
