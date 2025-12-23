import React from 'react';
import { Battery, Coins, Heart, Zap } from 'lucide-react';
import Card from '@/components/ui/Card';

interface ResourceDisplayProps {
    resources: {
        battery: number;
        capital: number;
        karma?: number;
        cyberhealth?: number;
    };
}

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ resources }) => {
    return (
        <Card className="flex items-center justify-between gap-4 bg-slate-900/90 sticky top-0 z-10">
            <div className="flex items-center gap-2 text-yellow-400">
                <Battery className="h-5 w-5" />
                <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase">Battery</span>
                    <span className="font-mono font-bold">{resources.battery}%</span>
                </div>
            </div>
            
            <div className="flex items-center gap-2 text-cyan-400">
                <Coins className="h-5 w-5" />
                <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase">Capital</span>
                    <span className="font-mono font-bold">Credits {resources.capital}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 text-purple-400">
                <Zap className="h-5 w-5" />
                <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase">Karma</span>
                    <span className="font-mono font-bold">{resources.karma || 0}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 text-red-400">
                <Heart className="h-5 w-5" />
                <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase">Health</span>
                    <span className="font-mono font-bold">{resources.cyberhealth || 100}%</span>
                </div>
            </div>
        </Card>
    );
};

export default ResourceDisplay;
