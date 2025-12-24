"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Button from "@/features/ui/components/Button";
import MusicController from "./MusicController";
import { Trophy, Mail, Swords, Users, Map as MapIcon, Settings, ShoppingBag, Play, Battery, Coins, ShieldCheck, Lock, Unlock } from "lucide-react";

const ResourcePill = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: number | string; color: string }) => (
  <div className={cn("flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-bold font-mono", color, "bg-black/40 backdrop-blur-md border-white/10 text-white")}>
    <Icon className="w-4 h-4" />
    <span className="uppercase">{label}</span>
    <span className="ml-1">{value}</span>
  </div>
);

const IconButton = ({ icon: Icon, label, onClick }: { icon: any; label: string; onClick?: () => void }) => (
  <button onClick={onClick} className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-colors pointer-events-auto">
    <Icon className="w-6 h-6" />
    <span className="sr-only">{label}</span>
  </button>
);

export default function ClashHUD({
  cameraMode,
  onToggleCamera,
}: {
  cameraMode?: "free" | "locked";
  onToggleCamera?: () => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Top Resources */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
        <ResourcePill icon={Coins} label="Credits" value={73200} color="border-yellow-300/40" />
        <ResourcePill icon={Battery} label="Power" value={118} color="border-emerald-300/40" />
        <ResourcePill icon={ShieldCheck} label="Integrity" value={84} color="border-cyan-300/40" />
      </div>

      {/* Left Sidebar */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        <IconButton icon={Trophy} label="Trophies" />
        <IconButton icon={Mail} label="Inbox" />
        <IconButton icon={Swords} label="Battle" />
        <IconButton icon={Users} label="Social" />
        <div className="mt-6">
          <Button size="lg" className="pointer-events-auto bg-orange-500 text-white border-none px-6 py-4">
            <Play className="w-4 h-4 mr-2" /> Attack
          </Button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-3 items-end">
        <IconButton icon={ShoppingBag} label="Shop" />
        <IconButton icon={MapIcon} label="Map" />
        <IconButton icon={Settings} label="Settings" />
        <div className="mt-6">
          {onToggleCamera && (
            <Button variant="outline" size="sm" className="pointer-events-auto h-10 px-3" onClick={onToggleCamera}>
              {cameraMode === "locked" ? <Lock className="w-3 h-3 mr-1" /> : <Unlock className="w-3 h-3 mr-1" />}
              {cameraMode === "locked" ? "Tactical" : "Orbit"}
            </Button>
          )}
        </div>
      </div>

      {/* Music Toggle */}
      <div className="absolute top-3 right-3 pointer-events-auto">
        <MusicController />
      </div>
    </div>
  );
}

