import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className, title, noPadding = false }) => {
    return (
        <div className={cn(
            "relative bg-black/80 border border-white/10 backdrop-blur-md overflow-hidden",
            !noPadding && "p-6",
            className
        )}>
            {/* Cyberpunk Decorators */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary opacity-70" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary opacity-70" />
            
            {/* Scanline Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,6px_100%] opacity-20" />

            {title && (
                <div className="relative z-10 mb-6 flex items-end gap-4 border-b border-white/10 pb-2">
                    <h3 className="text-xl font-black font-mono text-white tracking-widest uppercase italic transform -skew-x-12">
                        {title}
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                    <div className="text-[10px] text-primary/50 font-mono">SYS.RDY</div>
                </div>
            )}
            
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default Card;
