"use client";

import React, { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { User, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type MapItem = {
  id: string;
  roomCode?: string;
  userId?: string;
  players?: unknown[];
};

interface WorldMapProps {
  items: MapItem[];
  currentItemId?: string;
  onSelect?: (id: string) => void;
  selectedId?: string | null;
  mapType?: "lobby" | "game";
}

export default function WorldMap({
  items,
  currentItemId,
  onSelect,
  selectedId,
  mapType = "game",
}: WorldMapProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);

  const blocks = useMemo(() => {
    const rng = mulberry32(424242);
    return Array.from({ length: 24 }).map(() => ({
      left: rng() * 2200 + 100,
      top: rng() * 2200 + 100,
      width: rng() * 120 + 60,
      height: rng() * 120 + 60,
      rot: rng() * 360,
    }));
  }, []);

  return (
    <div className="w-full h-full overflow-hidden relative bg-[#0b0f18]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f18] via-[#0b0f18] to-[#0b0f18]/60" />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(#ffffff22 1px, transparent 1px)",
          backgroundSize: "2px 2px",
          backgroundPosition: "0 0, 50px 50px",
        }}
      />

      <div ref={constraintsRef} className="absolute inset-0 overflow-hidden">
        <motion.div
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.12}
          className="relative w-[2400px] h-[2400px] cursor-grab active:cursor-grabbing"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {blocks.map((b, i) => (
            <div
              key={`block-${i}`}
              className="absolute bg-white/5 border border-white/10"
              style={{
                left: b.left,
                top: b.top,
                width: b.width,
                height: b.height,
                transform: `rotate(${b.rot}deg)`,
              }}
            />
          ))}

          {items.map((item) => {
            const seedX = item.id ? String(item.id) + "x" : String(item.roomCode) + "x";
            const seedY = item.id ? String(item.id) + "y" : String(item.roomCode) + "y";
            const pseudo = (s: string) => {
              let h = 0;
              for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
              return (Math.abs(h) % 2200) + 100;
            };
            const x = pseudo(seedX);
            const y = pseudo(seedY);
            const isSelected = selectedId === item.id;
            const isMe = currentItemId && item.id === currentItemId;
            const label =
              mapType === "lobby"
                ? item.roomCode
                : item.userId
                ? String(item.userId).substring(0, 4)
                : "";
            const subLabel =
              mapType === "lobby"
                ? `${item.players?.length || 0}/8`
                : isMe
                ? "YOU"
                : "";

            return (
              <div
                key={item.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{ left: x, top: y }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(item.id);
                }}
              >
                {isSelected && (
                  <div className="absolute inset-0 -m-4 border-2 border-accent rounded-full animate-ping opacity-50 pointer-events-none" />
                )}
                <div
                  className={cn(
                    "relative flex flex-col items-center justify-center w-24 h-24 clip-hex backdrop-blur-sm",
                    isSelected
                      ? "bg-accent/80 text-black z-50 scale-110 shadow-[0_0_20px_rgba(255,0,60,0.5)]"
                      : isMe
                      ? "bg-primary/30 border-2 border-primary text-primary z-40 shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                      : "bg-secondary/80 border border-primary/30 text-primary z-10 hover:z-30 hover:bg-secondary hover:border-primary"
                  )}
                >
                  {mapType === "lobby" ? (
                    <Globe className="w-8 h-8" />
                  ) : (
                    <User className="w-8 h-8" />
                  )}
                  <div className="text-xs font-mono mt-1 font-bold tracking-widest">
                    {label}
                  </div>
                  {subLabel && (
                    <div className="text-[9px] uppercase tracking-wider opacity-80 font-bold">
                      {subLabel}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <style jsx global>{`
        .clip-hex {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>
    </div>
  );
}
