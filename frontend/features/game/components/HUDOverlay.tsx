"use client";

import React from "react";
import { cn } from "@/lib/utils";

const Bar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="w-full">
    <div className="flex justify-between text-[10px] font-mono text-white/70">
      <span className="uppercase">{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 w-full bg-white/10 rounded overflow-hidden">
      <div className={cn("h-full transition-all", color)} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  </div>
);

export default function HUDOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-4">
      <div className="flex justify-between items-start">
        <div className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-3 w-full max-w-sm">
          <div className="text-xs font-mono text-primary mb-2">CITY STATUS</div>
          <div className="space-y-2">
            <Bar label="XP" value={34} color="bg-primary" />
            <Bar label="POWER" value={72} color="bg-warning" />
            <Bar label="INTEGRITY" value={88} color="bg-success" />
          </div>
        </div>
        <div className="hidden md:block pointer-events-auto bg-black/30 border border-white/10 rounded-lg p-2 text-xs font-mono text-white/70">
          WASD MOVE • C TOGGLE CAM • SCROLL ZOOM
        </div>
      </div>

      <div className="pointer-events-auto mx-auto w-full max-w-md bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-3">
        <div className="text-center text-xs font-mono text-white/70">
          REDACTED // NEON SNOW CITY
        </div>
      </div>
    </div>
  );
}

