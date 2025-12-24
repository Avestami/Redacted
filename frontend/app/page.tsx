'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { joinGame, getActiveGames } from '@/services/api';
import WorldMap, { GameNode } from '@/features/map/components/WorldMap';
import ClashHUD from '@/features/game/components/ClashHUD';

export default function Home() {
  const router = useRouter();
  const [activeGames, setActiveGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [cameraMode, setCameraMode] = useState<'free' | 'locked'>('locked');

  useEffect(() => {
    let storedId = localStorage.getItem('userId');
    if (!storedId) {
      storedId = `OP_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      localStorage.setItem('userId', storedId);
    }
    setUserId(storedId);

    fetchGames();

    const cached = localStorage.getItem('cached_games');
    if (cached) {
      try { setActiveGames(JSON.parse(cached)); } catch {}
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c') {
        setCameraMode(prev => prev === 'locked' ? 'free' : 'locked');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const games = await getActiveGames();
      setActiveGames(games);
      localStorage.setItem('cached_games', JSON.stringify(games));
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async (code: string) => {
    if (!code) return;
    try {
      const response = await joinGame(code, userId);
      router.push(`/game/${response.gameId}`);
    } catch (error) {
      console.error('Failed to join game:', error);
      alert('Failed to join game');
    }
  };

  const getNodePosition = (index: number): [number, number, number] => {
    const angle = (index * 137.5) * (Math.PI / 180);
    const radius = 15 + (index * 2);
    return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
  };

  return (
    <main className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      <WorldMap cameraMode={cameraMode}>
        {activeGames.map((g, i) => (
          <GameNode
            key={g.id}
            position={getNodePosition(i)}
            label={`ROOM ${g.roomCode}`}
            type="game"
            onClick={() => handleJoinGame(g.roomCode)}
          />
        ))}
      </WorldMap>
      <ClashHUD cameraMode={cameraMode} onToggleCamera={() => setCameraMode(prev => prev === 'free' ? 'locked' : 'free')} />
    </main>
  );
}
