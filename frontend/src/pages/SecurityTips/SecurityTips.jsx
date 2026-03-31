import React from 'react';
import { GlassCard } from '../../components/GlassCard/GlassCard';
import { ShieldCheck, Info } from 'lucide-react';

export const SecurityTips = () => {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <ShieldCheck className="text-cyan-400" />
                    Operator Briefings
                </h1>
                <p className="text-slate-400 mt-2">Best practices for maintaining operational security.</p>
            </header>
            
            <div className="space-y-4">
                <GlassCard className="border-l-4 border-l-cyan-500">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2"><Info size={18} className="text-cyan-400" /> Optimal Camera Placement</h3>
                    <p className="text-slate-300">Ensure cameras are mounted at least 9 feet high to prevent tampering while maintaining a downward angle of 15-30 degrees for optimal facial and incident capture.</p>
                </GlassCard>

                <GlassCard className="border-l-4 border-l-orange-500">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2"><Info size={18} className="text-orange-400" /> Lighting Constraints</h3>
                    <p className="text-slate-300">Avoid pointing cameras directly at intense light sources. Use IR-enabled cameras for poorly lit alleys in Indore's heritage areas.</p>
                </GlassCard>
                
                <GlassCard className="border-l-4 border-l-green-500">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2"><Info size={18} className="text-green-400" /> Data Retention Protocol</h3>
                    <p className="text-slate-300">By local regulation, standard footage should be maintained for 30 days. Priority incidents flagged by AI are to be archived permanently in the central encrypted vault.</p>
                </GlassCard>
            </div>
        </div>
    );
};
