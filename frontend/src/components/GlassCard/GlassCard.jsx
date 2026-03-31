import React from 'react';

export const GlassCard = ({ children, className = '', hover = false }) => {
    return (
        <div className={`glass-card p-6 ${hover ? 'glass-card-hover' : ''} ${className}`}>
            {children}
        </div>
    );
};
