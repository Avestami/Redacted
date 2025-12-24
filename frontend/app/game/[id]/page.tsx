'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getGame, performAction } from '@/services/api';
import WorldMap from '@/components/map/WorldMap';
import GameHUD from '@/components/game/GameHUD';
import AudioPlayer from '@/components/game/AudioPlayer';
import SnowEffect from '@/components/ui/SnowEffect';

export default function GameRoom() {
    const params = useParams();
    const router = useRouter();
    const gameId = params.id as string;
    
    const [game, setGame] = useState<any>(null);
    const [currentPlayer, setCurrentPlayer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

    useEffect(() => {
        const storedId = localStorage.getItem('userId');
        if (storedId) setUserId(storedId);
        fetchGameState();
        
        const interval = setInterval(fetchGameState, 2000); // Faster polling for smoother feel
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
                    items={game.players} 
                    currentItemId={currentPlayer?.id} 
                    onSelect={setSelectedTargetId}
                    selectedId={selectedTargetId}
                    mapType="game"
                />
            </GameHUD>
        </main>
    );
}
