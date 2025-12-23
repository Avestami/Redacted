'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import ResourceDisplay from '@/components/game/ResourceDisplay';
import ActionPanel from '@/components/game/ActionPanel';
import PlayerList from '@/components/game/PlayerList';
import AiPanel from '@/components/game/AiPanel';
import { getGame, performAction, getPlayer, startGame } from '@/services/api';

export default function GameRoom() {
    const params = useParams();
    const router = useRouter();
    const gameId = params.id as string;
    
    const [game, setGame] = useState<any>(null);
    const [currentPlayer, setCurrentPlayer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const storedId = localStorage.getItem('userId');
        if (storedId) setUserId(storedId);
        fetchGameState();
        
        // Poll for updates (MVP)
        const interval = setInterval(fetchGameState, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchGameState = async () => {
        try {
            const gameData = await getGame(gameId);
            setGame(gameData);
            
            const storedId = localStorage.getItem('userId');
            if (storedId && gameData.players) {
                const player = gameData.players.find((p: any) => p.userId === storedId);
                setCurrentPlayer(player);
            }
        } catch (error) {
            console.error('Failed to fetch game:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (actionType: string, targetId?: string) => {
        if (!currentPlayer) return;
        try {
            await performAction(gameId, currentPlayer.id, actionType, targetId, {});
            fetchGameState(); // Refresh state immediately
            alert(`Action ${actionType} initiated.`);
        } catch (error) {
            console.error('Action failed:', error);
            alert('Action failed');
        }
    };

    const handleStartGame = async () => {
        try {
            await startGame(gameId);
            fetchGameState();
        } catch (error) {
            console.error('Failed to start game:', error);
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-500">Initializing Neural Link...</div>;
    if (!game) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-500">Connection Lost</div>;

    const isHost = game.hostId && currentPlayer && true; // Simplify host check logic if needed

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-6 bg-[url('https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=2998&auto=format&fit=crop')] bg-cover bg-center bg-fixed">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <header className="flex items-center justify-between bg-slate-900/80 p-4 rounded-lg backdrop-blur-sm border-b border-cyan-500/30">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
                            <ArrowLeft className="h-4 w-4 mr-1" /> Exit
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold text-cyan-400 tracking-wider">ROOM: {game.roomCode}</h1>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className={`h-2 w-2 rounded-full ${game.status === 'waiting' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                                Status: {game.status.toUpperCase()}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-300 bg-slate-800 px-3 py-1 rounded">
                            <Clock className="h-4 w-4 text-cyan-500" />
                            <span className="font-mono">10:00</span>
                        </div>
                        {game.status === 'waiting' && (
                             <Button onClick={handleStartGame}>Start Simulation</Button>
                        )}
                    </div>
                </header>

                {/* Resource Bar */}
                {currentPlayer && (
                    <ResourceDisplay 
                        resources={{
                            battery: 100, // Mock, needs to come from currentPlayer.resources
                            capital: 50,
                            karma: currentPlayer.karma,
                            cyberhealth: currentPlayer.cyberhealth
                        }} 
                    />
                )}

                {/* Main Grid */}
                <div className="grid lg:grid-cols-12 gap-6">
                    {/* Left Column: Player List */}
                    <div className="lg:col-span-3 space-y-6">
                        <PlayerList players={game.players} currentPlayerId={currentPlayer?.id} />
                    </div>

                    {/* Middle Column: Actions & Game View */}
                    <div className="lg:col-span-6 space-y-6">
                        <AiPanel />
                        {currentPlayer && (
                            <ActionPanel 
                                onAction={handleAction} 
                                players={game.players} 
                                currentPlayerId={currentPlayer.id} 
                            />
                        )}
                    </div>

                    {/* Right Column: Events/Logs (Placeholder) */}
                    <div className="lg:col-span-3">
                        <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-4 h-full min-h-[400px]">
                            <h3 className="text-lg font-semibold text-cyan-400 mb-4 border-b border-slate-700 pb-2">System Logs</h3>
                            <div className="space-y-2 font-mono text-xs text-slate-400">
                                <p>[10:42] User_X joined the network.</p>
                                <p>[10:43] Encrypted signal detected.</p>
                                <p>[10:45] Detective AI scanning sector 4...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
