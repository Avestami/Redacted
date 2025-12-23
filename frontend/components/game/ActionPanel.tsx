import React, { useState } from 'react';
import { Shield, Eye, Laptop, Activity } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface ActionPanelProps {
    onAction: (actionType: string, targetId?: string) => void;
    players: any[];
    currentPlayerId: string;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ onAction, players, currentPlayerId }) => {
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [selectedTarget, setSelectedTarget] = useState<string>('');

    const handleExecute = () => {
        if (selectedAction) {
            onAction(selectedAction, selectedTarget || undefined);
            setSelectedAction(null);
            setSelectedTarget('');
        }
    };

    const actions = [
        { id: 'hack', label: 'Hack', icon: Laptop, color: 'text-red-400', desc: 'Disrupt target systems' },
        { id: 'analyze', label: 'Analyze', icon: Eye, color: 'text-cyan-400', desc: 'Scan for patterns' },
        { id: 'heal', label: 'Restore', icon: Activity, color: 'text-green-400', desc: 'Repair cyberhealth' },
        { id: 'intel', label: 'Intel', icon: Shield, color: 'text-yellow-400', desc: 'Gather data' },
    ];

    return (
        <Card title="Command Interface" className="h-full">
            <div className="grid grid-cols-2 gap-4 mb-6">
                {actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={() => setSelectedAction(action.id)}
                        className={`p-4 rounded-lg border transition-all text-left flex flex-col gap-2 ${
                            selectedAction === action.id 
                                ? 'bg-cyan-500/20 border-cyan-500 ring-1 ring-cyan-500' 
                                : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                        }`}
                    >
                        <action.icon className={`h-6 w-6 ${action.color}`} />
                        <div>
                            <div className="font-bold text-slate-200">{action.label}</div>
                            <div className="text-xs text-slate-400">{action.desc}</div>
                        </div>
                    </button>
                ))}
            </div>

            {selectedAction && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 uppercase font-bold">Select Target</label>
                        <select 
                            className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm focus:border-cyan-500 focus:outline-none"
                            value={selectedTarget}
                            onChange={(e) => setSelectedTarget(e.target.value)}
                        >
                            <option value="">-- Select Target System --</option>
                            {players
                                .filter(p => p.id !== currentPlayerId) // Can't target self for some actions usually
                                .map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.userId} ({p.role === 'unknown' ? 'Unknown' : p.role})
                                </option>
                            ))}
                        </select>
                    </div>

                    <Button 
                        className="w-full" 
                        onClick={handleExecute}
                        disabled={!selectedTarget && selectedAction !== 'intel'} // Intel might not need target
                    >
                        Execute Protocol
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default ActionPanel;
