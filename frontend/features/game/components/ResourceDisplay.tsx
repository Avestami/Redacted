import React from "react";
import { Battery, Coins, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResourceDisplayProps {
  resources: {
    battery: number;
    capital: number;
    karma?: number;
    cyberhealth?: number;
  };
}

const ProgressBar = ({ value, color, max = 100 }: { value: number; color: string; max?: number }) => (
  <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden mt-1">
    <div className={cn("h-full transition-all duration-500 ease-out", color)} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
  </div>
);

const ResourceItem = ({ icon: Icon, label, value, color, barColor }: { icon: any; label: string; value: string | number; color: string; barColor: string }) => (
  <div className="flex-1 bg-black/60 border border-white/10 p-2 rounded backdrop-blur-md hover:bg-black/80 transition-colors group">
    <div className="flex items-center gap-3">
      <div className={cn("p-2 rounded bg-white/5 border border-white/5", color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-end">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono group-hover:text-foreground transition-colors">{label}</span>
          <span className={cn("font-mono font-bold text-sm", color)}>{value}</span>
        </div>
        <ProgressBar value={typeof value === "number" ? value : parseInt(value.toString())} color={barColor} />
      </div>
    </div>
  </div>
);

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ resources }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      <ResourceItem icon={Battery} label="Power" value={resources.battery} color="text-warning" barColor="bg-warning shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
      <ResourceItem icon={Coins} label="Credits" value={resources.capital} color="text-primary" barColor="bg-primary shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
      <ResourceItem icon={Zap} label="Karma" value={resources.karma || 0} color="text-accent" barColor="bg-accent shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
      <ResourceItem icon={Activity} label="Integrity" value={`${resources.cyberhealth || 100}%`} color="text-destructive" barColor="bg-destructive shadow-[0_0_10px_rgba(255,42,42,0.5)]" />
    </div>
  );
};

export default ResourceDisplay;

