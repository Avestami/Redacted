import React, { useState, useEffect } from 'react';
import { Shield, Eye, Laptop, Activity, Zap, Radio, Crosshair } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface ActionPanelProps {
    onAction: (actionType: string, targetId?: string) => void;
    players: any[];
    currentPlayerId: string;
    selectedTargetId?: string | null;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ onAction, players, currentPlayerId, selectedTargetId }) => {
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedTargetId) {
             // Optional logic
        }
    }, [selectedTargetId]);

    const handleExecute = () => {
        if (selectedAction) {
            onAction(selectedAction, selectedTargetId || undefined);
            setSelectedAction(null);
        }
    };

    const actions = [
        { id: 'hack', label: 'HACK', icon: Laptop, color: 'text-destructive', bg: 'hover:bg-destructive/10', desc: 'Disrupt target systems' },
        { id: 'analyze', label: 'SCAN', icon: Eye, color: 'text-primary', bg: 'hover:bg-primary/10', desc: 'Scan for patterns' },
        { id: 'heal', label: 'PATCH', icon: Activity, color: 'text-success', bg: 'hover:bg-success/10', desc: 'Repair cyberhealth' },
        { id: 'intel', label: 'INTEL', icon: Radio, color: 'text-warning', bg: 'hover:bg-warning/10', desc: 'Gather data' },
    ];

    const targetPlayer = players.find(p => p.id === selectedTargetId);

    return (
        <Card title="ACTION_MENU" className="h-full border-primary/20 bg-card/60 backdrop-blur-md">
            <div className="flex flex-col h-full gap-4">
                {/* Target Status Header */}
                <div className="bg-black/40 border border-primary/10 p-3 rounded-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-full", targetPlayer ? "bg-accent/20 text-accent animate-pulse" : "bg-muted/20 text-muted-foreground")}>
                            <Crosshair className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase text-muted-foreground font-mono tracking-widest">LOCKED TARGET</div>
                            <div className={cn("font-bold font-mono", targetPlayer ? "text-foreground" : "text-muted-foreground italic")}>
                                {targetPlayer ? targetPlayer.userId : "NO TARGET SELECTED"}
                            </div>
                        </div>
                    </div>
                    {targetPlayer && (
                        <div className="text-right">
                            <div className="text-[10px] text-muted-foreground">STATUS</div>
                            <div className="text-xs font-bold text-accent">VULNERABLE</div>
                        </div>
                    )}
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-2 gap-3 flex-1">
                    {actions.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => setSelectedAction(action.id)}
                            disabled={!selectedTargetId && action.id !== 'intel'} // Intel might be global
                            className={cn(
                                "relative overflow-hidden p-3 rounded-sm border transition-all text-left flex flex-col justify-between group disabled:opacity-50 disabled:cursor-not-allowed",
                                selectedAction === action.id 
                                    ? "bg-primary/20 border-primary ring-1 ring-primary shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                                    : "bg-black/40 border-white/5 hover:border-primary/50",
                                action.bg
                            )}
                        >
                            <div className="flex justify-between items-start w-full">
                                <action.icon className={cn("h-5 w-5 transition-colors", action.color)} />
                                {selectedAction === action.id && <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />}
                            </div>
                            
                            <div className="mt-2">
                                <div className={cn("font-bold font-mono text-sm tracking-wider", selectedAction === action.id ? "text-primary text-glow" : "text-foreground")}>
                                    {action.label}
                                </div>
                                <div className="text-[9px] text-muted-foreground uppercase tracking-wide opacity-70 group-hover:opacity-100 transition-opacity">
                                    {action.desc}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Execute Button */}
                <Button 
                    className="w-full py-6 text-lg tracking-widest relative overflow-hidden group" 
                    onClick={handleExecute}
                    disabled={!selectedAction || (!selectedTargetId && selectedAction !== 'intel')} 
                    variant={selectedAction === 'hack' ? 'danger' : 'primary'}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <Zap className={cn("w-4 h-4", !selectedAction && "opacity-50")} />
                        {selectedAction ? `EXECUTE_${selectedAction.toUpperCase()}` : 'SELECT_PROTOCOL'}
                    </span>
                    {/* Progress bar effect behind button */}
                    <div className="absolute inset-0 bg-white/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
            </div>
        </Card>
    );
};

export default ActionPanel;
