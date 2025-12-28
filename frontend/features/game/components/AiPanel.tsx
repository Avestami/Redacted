import React from "react";
import { FileText } from "lucide-react";
import Card from "@/features/ui/components/Card";
import AiVisualizer from "./AiVisualizer";

const AiPanel: React.FC = () => {
  return (
    <Card title="THE_DETECTIVE" className="border-accent/30 bg-black/60 h-full flex flex-col backdrop-blur-md">
      <div className="flex h-full gap-4">
        <div className="w-1/3 relative rounded border border-accent/20 bg-accent/5 overflow-hidden min-h-[150px]">
          <div className="absolute top-2 left-2 z-10 text-[10px] text-accent font-mono tracking-widest">CASE_FILE #2077</div>
          <AiVisualizer />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground font-mono border-b border-white/5 pb-1">
            <FileText className="w-3 h-3" />
            <span>INTERNAL_MONOLOGUE</span>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 font-mono text-xs">
            <p className="text-muted-foreground italic leading-relaxed">
              &quot;The snow keeps falling, burying the city&apos;s secrets. I&apos;ve got 8 suspects in the grid. One of them is lying. The machine knows it. I just need to prove it.&quot;
            </p>
            <div className="p-2 rounded bg-accent/10 border-l-2 border-accent text-accent/90 mt-2">
              <span className="font-bold uppercase text-[10px] block mb-1">Observation</span>
              Subject &apos;User_7&apos; showing erratic resource spikes. Probability of betrayal: 42%.
            </div>
            <div className="text-primary/50 text-[10px] mt-2 animate-pulse">Processing new evidence...</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AiPanel;
