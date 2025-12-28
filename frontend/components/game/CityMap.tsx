"use client";

import React, { useMemo, useRef } from 'react';
import { User, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CityMapProps {
    items: Array<{ id: string; roomCode?: string; userId?: string; players?: unknown[] }>;
    currentItemId?: string;
    onSelect?: (id: string) => void;
    selectedId?: string | null;
    mapType?: 'lobby' | 'game';
}

export default function CityMap({ items, currentItemId, onSelect, selectedId, mapType = 'game' }: CityMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const blocks = useMemo(() => {
        let seed = 1337;
        const rng = () => {
            seed |= 0;
            seed = (seed + 0x6D2B79F5) | 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
        return Array.from({ length: 20 }).map(() => ({
            left: rng() * 1800 + 100,
            top: rng() * 1800 + 100,
            width: rng() * 100 + 50,
            height: rng() * 100 + 50,
            rot: rng() * 360,
        }));
    }, []);

    return (
        <div className="w-full h-full bg-[#0a0a10] overflow-hidden relative touch-none">
            {/* Fog/Atmosphere Layer */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/80 pointer-events-none z-10" />
            
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" 
                 style={{ 
                     backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)', 
                     backgroundSize: '50px 50px' 
                 }} 
            />

            <div ref={containerRef} className="absolute inset-0 overflow-hidden">
            <motion.div
                drag
                dragConstraints={containerRef}
                dragElastic={0.1}
                className="relative w-[2000px] h-[2000px] cursor-grab active:cursor-grabbing"
            >
                {/* Map Content Layer */}
                <div className="absolute inset-0">
                    {/* Decorative City Blocks (Static) - Adds "Map" feel */}
                    {blocks.map((b, i) => (
                        <div 
                            key={`block-${i}`}
                            className="absolute bg-white/5 border border-white/10"
                            style={{
                                left: b.left,
                                top: b.top,
                                width: b.width,
                                height: b.height,
                                transform: `rotate(${b.rot}deg)`
                            }}
                        />
                    ))}

                    {items.map((item) => {
                        const pseudoRandom = (seed: string) => {
                            let hash = 0;
                            for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
                            return (Math.abs(hash) % 1800) + 100;
                        };
                        
                        const x = pseudoRandom(item.id + 'x');
                        const y = pseudoRandom(item.id + 'y');
                        const isSelected = item.id === selectedId;
                        const isMe = item.id === currentItemId;

                        const label = mapType === 'lobby' ? item.roomCode : item.userId?.substring(0, 4);
                        const subLabel = mapType === 'lobby' ? `${item.players?.length || 0}/8` : (isMe ? 'YOU' : '');

                        return (
                            <div
                                key={item.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                                style={{ left: x, top: y }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect?.(item.id);
                                }}
                            >
                                {isSelected && (
                                    <div className="absolute inset-0 -m-4 border-2 border-accent rounded-full animate-ping opacity-50 pointer-events-none" />
                                )}
                                
                                <div className={cn(
                                    "relative flex flex-col items-center justify-center w-24 h-24 clip-path-hex transition-transform hover:scale-110 backdrop-blur-sm",
                                    isSelected 
                                        ? "bg-accent/80 text-black z-50 scale-110 shadow-[0_0_20px_rgba(255,0,60,0.5)]" 
                                        : isMe 
                                            ? "bg-primary/30 border-2 border-primary text-primary z-40 shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                                            : "bg-secondary/80 border border-primary/30 text-primary z-10 hover:z-30 hover:bg-secondary hover:border-primary"
                                )}>
                                    {mapType === 'lobby' ? <Globe className="w-8 h-8" /> : <User className="w-8 h-8" />}
                                    
                                    <div className="text-xs font-mono mt-1 font-bold tracking-widest">
                                        {label}
                                    </div>
                                    {subLabel && (
                                        <div className="text-[9px] uppercase tracking-wider opacity-80 font-bold">
                                            {subLabel}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
            </div>

            <style jsx global>{`
                .clip-path-hex {
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                }
            `}</style>
        </div>
    );
}
