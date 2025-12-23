'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Plus, Users, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { createGame, joinGame, getActiveGames } from '@/services/api';

export default function Home() {
  const router = useRouter();
  const [activeGames, setActiveGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [userId, setUserId] = useState(''); // Simple user ID for MVP

  // Generate a random user ID on mount if not exists
  useEffect(() => {
    let storedId = localStorage.getItem('userId');
    if (!storedId) {
      storedId = `user_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('userId', storedId);
    }
    setUserId(storedId);
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const games = await getActiveGames();
      setActiveGames(games);
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGame = async () => {
    try {
      // Mock host ID as the current user ID for MVP
      const game = await createGame(userId, 8, 10); // Default 8 players, 10 min phase
      // Auto join as host
      await joinGame(game.roomCode, userId);
      router.push(`/game/${game.id}`);
    } catch (error) {
      console.error('Failed to create game:', error);
      alert('Failed to create game');
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 bg-[url('https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=2998&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-blend-overlay bg-fixed">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4 pt-12">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-cyan-400 text-glow">REDACTED</h1>
          <p className="text-xl text-slate-400">Social Deduction • Cyberpunk Noir • AI Strategy</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Join/Create Section */}
          <Card title="Enter the City" className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Room Code"
                  className="flex-1 bg-slate-800 border border-slate-600 rounded-md px-4 py-2 focus:outline-none focus:border-cyan-500"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                />
                <Button onClick={() => handleJoinGame(roomCode)} disabled={!roomCode}>
                  Join
                </Button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-2 text-slate-500">Or</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-12 text-lg"
                onClick={handleCreateGame}
              >
                <Plus className="mr-2 h-5 w-5" /> Create New Game
              </Button>
            </div>
            
            <div className="text-xs text-slate-500 text-center">
              Logged in as: <span className="text-cyan-500 font-mono">{userId}</span>
            </div>
          </Card>

          {/* Active Games List */}
          <Card 
            title="Active Signals" 
            className="h-[400px] overflow-hidden flex flex-col"
          >
             <div className="flex justify-between items-center mb-4 text-xs text-slate-400">
               <span>Detecting available networks...</span>
               <Button variant="ghost" size="sm" onClick={fetchGames}>
                 <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
               </Button>
             </div>
             
             <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
               {activeGames.length === 0 ? (
                 <div className="text-center py-12 text-slate-500">
                   <p>No active signals detected.</p>
                   <p className="text-xs mt-2">Start a new transmission.</p>
                 </div>
               ) : (
                 activeGames.map((game) => (
                   <div 
                     key={game.id}
                     className="flex items-center justify-between p-3 bg-slate-800/50 rounded hover:bg-slate-800 transition-colors border border-slate-700/50 cursor-pointer"
                     onClick={() => handleJoinGame(game.roomCode)}
                   >
                     <div className="flex flex-col">
                       <span className="font-mono text-cyan-400 font-bold">{game.roomCode}</span>
                       <span className="text-xs text-slate-400">Host: {game.hostId.substring(0, 8)}...</span>
                     </div>
                     <div className="flex items-center gap-4">
                       <div className="flex items-center text-xs text-slate-300">
                         <Users className="h-3 w-3 mr-1" />
                         {game.players?.length || 0}/{game.maxPlayers}
                       </div>
                       <Button size="sm" variant="ghost">Connect</Button>
                     </div>
                   </div>
                 ))
               )}
             </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
