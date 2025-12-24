import React from 'react';
import { Battery, Coins, Heart, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResourceDisplayProps {
    resources: {
        battery: number;
        capital: number;
        karma?: number;
        cyberhealth?: number;
    };
}

const ResourceItem = ({ 
    icon: Icon, 
    value, 
    color, 
    label
}: { 
    icon: any; 
    value: string | number; 
    color: string; 
    label: string;
}) => (
    <div className="flex flex-col items-center mx-3 group">
        <div className={cn("mb-1 transition-colors", color)}>
            <Icon className="h-5 w-5" />
        </div>
        <div className="text-lg font-bold font-mono leading-none tracking-tighter">
            {value}
        </div>
        <div className="text-[8px] uppercase text-muted-foreground tracking-widest mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
            {label}
        </div>
    </div>
);

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ resources }) => {
    return (
        <div className="flex items-center divide-x divide-white/10">
            <ResourceItem 
                icon={Battery} 
                value={`${resources.battery}%`} 
                color="text-warning" 
                label="PWR"
            />
            <ResourceItem 
                icon={Coins} 
                value={resources.capital} 
                color="text-primary" 
                label="CRD"
            />
            <ResourceItem 
                icon={Zap} 
                value={resources.karma || 0} 
                color="text-accent" 
                label="KRM"
            />
            <ResourceItem 
                icon={Activity} 
                value={`${resources.cyberhealth || 100}%`} 
                color="text-destructive" 
                label="HP"
            />
        </div>
    );
};

export default ResourceDisplay;
