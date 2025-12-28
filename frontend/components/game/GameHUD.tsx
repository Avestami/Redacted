import React from 'react';
import { Shield, Target, Zap, Activity, Crosshair } from 'lucide-react';
import { cn } from '@/lib/utils';
import ResourceDisplay from './ResourceDisplay';

interface GameHUDProps {
    game: { roomCode?: string } | null;
    currentPlayer: { karma?: number; cyberhealth?: number } | null;
    selectedTargetId: string | null;
    onAction: (type: string, targetId?: string) => void;
    children?: React.ReactNode; // For the map
}

export default function GameHUD({ game, currentPlayer, selectedTargetId, onAction, children }: GameHUDProps) {
    const actions = [
        { id: 'hack', label: 'HACK', icon: Zap, color: 'text-destructive', border: 'border-destructive' },
        { id: 'analyze', label: 'SCAN', icon: Target, color: 'text-primary', border: 'border-primary' },
        { id: 'heal', label: 'HEAL', icon: Activity, color: 'text-success', border: 'border-success' },
        { id: 'protect', label: 'DEFEND', icon: Shield, color: 'text-warning', border: 'border-warning' },
    ];

    return (
        <div className="fixed inset-0 overflow-hidden bg-black select-none">
            {/* 1. Map Layer (Background) */}
            <div className="absolute inset-0 z-0">
                {children}
            </div>

            {/* 2. Top HUD (Status Bar) */}
            <div className="absolute top-0 left-0 right-0 z-20 p-2 flex justify-between items-start pointer-events-none">
                <div className="bg-black/80 backdrop-blur-md border-l-4 border-primary px-4 py-2 clip-path-hud-top pointer-events-auto">
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">Operation</div>
                    <div className="text-xl font-bold font-mono text-primary text-glow">{game?.roomCode}</div>
                </div>

                <div className="bg-black/80 backdrop-blur-md border-r-4 border-accent px-4 py-2 clip-path-hud-top pointer-events-auto text-right">
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">Target</div>
                    <div className={cn("text-xl font-bold font-mono", selectedTargetId ? "text-accent animate-pulse" : "text-muted-foreground")}>
                        {selectedTargetId ? "LOCKED" : "NONE"}
                    </div>
                </div>
            </div>

            {/* 3. Bottom HUD (Controls) */}
            <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
                {/* Resources Bar (Floating above controls) */}
                <div className="flex justify-center mb-2 pointer-events-auto">
                    <div className="bg-black/90 border-t-2 border-primary/50 px-6 py-2 rounded-t-xl backdrop-blur-xl">
                         {currentPlayer && (
                            <ResourceDisplay 
                                resources={{
                                    battery: 100, 
                                    capital: 50,
                                    karma: currentPlayer.karma,
                                    cyberhealth: currentPlayer.cyberhealth
                                }} 
                            />
                        )}
                    </div>
                </div>

                {/* Main Action Bar */}
                <div className="bg-gradient-to-t from-black via-black/90 to-transparent pb-4 pt-2 px-4 flex justify-center gap-4 pointer-events-auto">
                    {actions.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => onAction(action.id, selectedTargetId || undefined)}
                            disabled={!selectedTargetId}
                            className={cn(
                                "relative group flex flex-col items-center justify-center w-20 h-20 bg-black/80 border-2 transition-all duration-200 clip-path-hex-button active:scale-95 disabled:opacity-30 disabled:grayscale",
                                action.border,
                                "hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                            )}
                        >
                            <action.icon className={cn("w-8 h-8 mb-1 transition-transform group-hover:scale-110", action.color)} />
                            <span className="text-[10px] font-bold tracking-widest text-white">{action.label}</span>
                            
                            {/* Tech deco lines */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50" />
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Lock Button (User requested) */}
            {selectedTargetId && (
                <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 pointer-events-auto">
                    <button className="bg-accent/20 border-2 border-accent text-accent p-4 rounded-full animate-pulse hover:bg-accent hover:text-black transition-colors">
                        <Crosshair className="w-8 h-8" />
                    </button>
                </div>
            )}

            <style jsx global>{`
                .clip-path-hud-top {
                    clip-path: polygon(0 0, 100% 0, 100% 80%, 90% 100%, 0 100%);
                }
                .clip-path-hex-button {
                    clip-path: polygon(10% 0, 90% 0, 100% 25%, 100% 75%, 90% 100%, 10% 100%, 0 75%, 0 25%);
                }
            `}</style>
        </div>
    );
}
