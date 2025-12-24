"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Button from "@/features/ui/components/Button";
import MusicController from "./MusicController";
import { Radio, Lock, Unlock } from "lucide-react";

const Progress = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-mono text-white/70 uppercase">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
      <div className={cn("h-full transition-all", color)} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  </div>
);

export default function GameHUD({
  onToggleCamera,
  cameraMode,
}: {
  onToggleCamera?: () => void;
  cameraMode?: "free" | "locked";
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col justify-between p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-3 w-full max-w-2xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-sm md:text-base font-black font-mono text-white">SNOW CITY</h1>
              <span className="flex items-center gap-1 text-[10px] font-mono text-white/60">
                <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse" /> ONLINE
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center text-xs font-mono text-primary/70 mr-2">
                <Radio className="w-3 h-3 mr-1" /> LINK
              </div>
              {onToggleCamera && (
                <Button variant="outline" size="sm" className="h-8 px-3" onClick={onToggleCamera}>
                  {cameraMode === "locked" ? <Lock className="w-3 h-3 mr-1" /> : <Unlock className="w-3 h-3 mr-1" />}
                  {cameraMode === "locked" ? "TACTICAL" : "ORBIT"}
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="pointer-events-auto">
          <MusicController />
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="pointer-events-auto mx-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: Resources */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4">
          <div className="text-xs font-mono text-primary mb-2">CITY METRICS</div>
          <div className="space-y-3">
            <Progress value={36} label="XP" color="bg-primary" />
            <Progress value={68} label="POWER" color="bg-warning" />
            <Progress value={84} label="INTEGRITY" color="bg-success" />
          </div>
        </div>

        {/* Middle: Actions / Tips */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4 text-center">
          <div className="text-xs font-mono text-white/70">
            WASD MOVE • C TOGGLE CAM • SCROLL ZOOM
          </div>
        </div>

        {/* Right: Quick Controls */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4 flex items-center justify-center">
          <div className="text-xs font-mono text-white/70">Ambient: toggle above</div>
        </div>
      </div>
    </div>
  );
}
