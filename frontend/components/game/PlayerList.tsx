import React from 'react';
import { User, ShieldAlert } from 'lucide-react';
import Card from '@/components/ui/Card';

interface PlayerListProps {
    players: any[];
    currentPlayerId: string;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, currentPlayerId }) => {
    return (
        <Card title="Network Nodes" className="h-full">
            <div className="space-y-2">
                {players.map((player) => (
                    <div 
                        key={player.id}
                        className={`flex items-center justify-between p-3 rounded border ${
                            player.id === currentPlayerId 
                                ? 'bg-cyan-950/30 border-cyan-500/50' 
                                : 'bg-slate-800/30 border-slate-700/50'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${player.is_active ? 'bg-slate-700' : 'bg-red-900/20'}`}>
                                <User className={`h-4 w-4 ${player.id === currentPlayerId ? 'text-cyan-400' : 'text-slate-400'}`} />
                            </div>
                            <div>
                                <div className="font-mono text-sm font-bold flex items-center gap-2">
                                    {player.userId}
                                    {player.id === currentPlayerId && <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-1 rounded">YOU</span>}
                                </div>
                                <div className="text-xs text-slate-500">
                                    Role: {player.id === currentPlayerId ? player.role : 'Unknown'}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                             {/* Trust Score Placeholder */}
                             <div className="flex flex-col items-end">
                                <span className="text-[10px] text-slate-500 uppercase">Trust</span>
                                <div className="h-1 w-12 bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-emerald-500" 
                                        style={{ width: `${Math.random() * 100}%` }} // Mock trust
                                    />
                                </div>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default PlayerList;
