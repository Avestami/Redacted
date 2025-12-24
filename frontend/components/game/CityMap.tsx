"use client";

import React, { useRef, useState, useEffect } from 'react';
import { User, MapPin, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MapNode {
    id: string;
    label: string;
    subLabel?: string;
    type?: 'player' | 'game' | 'resource';
}

interface CityMapProps {
    items: any[];
    currentItemId?: string;
    onSelect?: (id: string) => void;
    selectedId?: string | null;
    mapType?: 'lobby' | 'game';
}

export default function CityMap({ items, currentItemId, onSelect, selectedId, mapType = 'game' }: CityMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [constraints, setConstraints] = useState({ left: 0, top: 0, right: 0, bottom: 0 });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const width = window.innerWidth;
            const height = window.innerHeight;
            setConstraints({
                left: -2000 + width,
                top: -2000 + height,
                right: 0,
                bottom: 0
            });
        }
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

            <motion.div
                ref={containerRef}
                drag
                dragConstraints={constraints}
                dragElastic={0.1}
                className="relative w-[2000px] h-[2000px] cursor-grab active:cursor-grabbing"
            >
                {/* Map Content Layer */}
                <div className="absolute inset-0">
                    {/* Decorative City Blocks (Static) - Adds "Map" feel */}
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div 
                            key={`block-${i}`}
                            className="absolute bg-white/5 border border-white/10"
                            style={{
                                left: Math.random() * 1800 + 100,
                                top: Math.random() * 1800 + 100,
                                width: Math.random() * 100 + 50,
                                height: Math.random() * 100 + 50,
                                transform: `rotate(${Math.random() * 360}deg)`
                            }}
                        />
                    ))}

                    {items.map((item, i) => {
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
                                    onSelect && onSelect(item.id);
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

            <style jsx global>{`
                .clip-path-hex {
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                }
            `}</style>
        </div>
    );
}
