import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
    return (
        <div className={`bg-slate-900/80 border border-slate-700 rounded-lg p-4 shadow-lg backdrop-blur-sm ${className}`}>
            {title && (
                <div className="mb-4 border-b border-slate-700 pb-2">
                    <h3 className="text-lg font-semibold text-cyan-400">{title}</h3>
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;
