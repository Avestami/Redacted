'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getGame, performAction } from '@/services/api';
import WorldMap from '@/components/map/WorldMap';
import GameHUD from '@/components/game/GameHUD';
import AudioPlayer from '@/components/game/AudioPlayer';
import SnowEffect from '@/components/ui/SnowEffect';

type Player = { id: string; userId: string; karma?: number; cyberhealth?: number };
type Game = { roomCode?: string; players?: Player[] };

export default function GameRoom() {
    const params = useParams();
    const gameId = params.id as string;
    
    const [game, setGame] = useState<Game | null>(null);
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

    const fetchGameState = useCallback(async () => {
        try {
            const gameData = (await getGame(gameId)) as unknown as Game;
            setGame(gameData);
            
            const storedId = localStorage.getItem('userId');
            if (storedId && gameData.players) {
                const player = gameData.players.find((p) => p.userId === storedId) ?? null;
                setCurrentPlayer(player);
            }
        } catch (error) {
            console.error('Failed to fetch game:', error);
        } finally {
            setLoading(false);
        }
    }, [gameId]);

    useEffect(() => {
        fetchGameState();
        const interval = setInterval(fetchGameState, 2000);
        return () => clearInterval(interval);
    }, [fetchGameState]);

    const handleAction = async (actionType: string, targetId?: string) => {
        if (!currentPlayer) return;
        try {
            await performAction(gameId, currentPlayer.id, actionType, targetId, {});
            fetchGameState(); 
        } catch (error) {
            console.error('Action failed:', error);
        }
    };

    if (loading) return (
        <div className="fixed inset-0 bg-black flex items-center justify-center text-primary font-mono tracking-widest animate-pulse z-50">
            LOADING ASSETS...
        </div>
    );
    
    if (!game) return (
        <div className="fixed inset-0 bg-black flex items-center justify-center text-destructive font-mono z-50">
            CONNECTION LOST
        </div>
    );

    return (
        <main className="fixed inset-0 w-full h-full overflow-hidden bg-black text-white">
            <AudioPlayer />
            <SnowEffect />
            
            <GameHUD 
                game={game} 
                currentPlayer={currentPlayer} 
                selectedTargetId={selectedTargetId} 
                onAction={handleAction}
            >
                <WorldMap 
                    items={game.players ?? []} 
                    currentItemId={currentPlayer?.id} 
                    onSelect={setSelectedTargetId}
                    selectedId={selectedTargetId}
                    mapType="game"
                />
            </GameHUD>
        </main>
    );
}
