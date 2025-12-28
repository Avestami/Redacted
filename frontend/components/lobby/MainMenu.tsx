import React, { useState } from 'react';
import { RefreshCw, Users, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainMenuProps {
    userId: string;
    activeGames: Array<{ id: string; roomCode: string; players?: unknown[] }>;
    loading: boolean;
    onCreateGame: () => void;
    onJoinGame: (code: string) => void;
    onRefreshGames: () => void;
}

export default function MainMenu({ userId, activeGames, loading, onCreateGame, onJoinGame, onRefreshGames }: MainMenuProps) {
    const [roomCode, setRoomCode] = useState('');

    return (
        <div className="relative z-20 w-full max-w-3xl mx-auto flex flex-col items-center">
            
            {/* Status Header - Floating Hologram Style */}
            <div className="mb-8 text-center animate-pulse">
                <div className="text-xs text-primary/60 font-mono tracking-[0.3em] uppercase mb-1">
                    System Identity
                </div>
                <div className="text-lg text-primary font-mono font-bold bg-primary/10 px-4 py-1 inline-block border border-primary/30">
                    ID: {userId}
                </div>
            </div>

            {/* Main Interaction Zone */}
            <div className="grid md:grid-cols-2 gap-12 w-full items-start">
                
                {/* Left Column: Direct Access (Join/Host) */}
                <div className="space-y-6">
                    <div className="relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary to-transparent opacity-50" />
                        <h2 className="text-2xl font-black italic tracking-tighter text-white mb-4 flex items-center">
                            <span className="text-primary mr-2">01 //</span> ACCESS
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="ENTER_CODE"
                                    value={roomCode}
                                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                    className="w-full bg-black/40 border-b-2 border-white/20 py-4 px-2 font-mono text-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-all text-center tracking-widest uppercase"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                    <span className="animate-pulse text-primary text-xs">AWAITING INPUT_</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => onJoinGame(roomCode)} 
                                    disabled={!roomCode}
                                    className="flex-1 bg-white text-black h-14 font-black text-xl tracking-wider hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed clip-path-slant"
                                >
                                    JOIN
                                </button>
                                <button 
                                    onClick={onCreateGame}
                                    className="flex-1 border-2 border-white/20 text-white h-14 font-bold tracking-wider hover:bg-white/10 hover:border-white transition-all clip-path-slant"
                                >
                                    HOST_NEW
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Active Signals (Browser) */}
                <div className="space-y-6">
                    <div className="relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-accent to-transparent opacity-50" />
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-black italic tracking-tighter text-white flex items-center">
                                <span className="text-accent mr-2">02 //</span> SIGNALS
                            </h2>
                            <button onClick={onRefreshGames} className="text-white/50 hover:text-white hover:rotate-180 transition-all duration-500">
                                <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                            </button>
                        </div>

                        <div className="h-[200px] overflow-y-auto custom-scrollbar pr-2 space-y-2">
                            {activeGames.length === 0 ? (
                                <div className="h-full border border-dashed border-white/10 flex flex-col items-center justify-center text-white/20 font-mono text-sm p-8">
                                    <Globe className="w-8 h-8 mb-2 opacity-20" />
                                    NO ACTIVE PROTOCOLS
                                </div>
                            ) : (
                                activeGames.map((game) => (
                                    <div 
                                        key={game.id}
                                        onClick={() => onJoinGame(game.roomCode)}
                                        className="group relative bg-white/5 hover:bg-accent/10 p-4 cursor-pointer transition-all border-l-2 border-transparent hover:border-accent"
                                    >
                                        <div className="flex justify-between items-center relative z-10">
                                            <span className="font-mono text-xl font-bold text-white group-hover:text-accent tracking-wider">
                                                {game.roomCode}
                                            </span>
                                            <div className="flex items-center gap-2 text-xs font-mono text-white/50">
                                                <Users className="w-3 h-3" />
                                                {game.players?.length || 0}/8
                                            </div>
                                        </div>
                                        {/* Hover Effect Background */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .clip-path-slant {
                    clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
                }
            `}</style>
        </div>
    );
}
