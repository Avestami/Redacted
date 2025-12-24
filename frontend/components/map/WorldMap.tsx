"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorldMapProps {
  items: any[];
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setConstraints({
        left: -2400 + width,
        top: -2400 + height,
        right: 0,
        bottom: 0,
      });
    }
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

      <motion.div
        ref={containerRef}
        drag
        dragConstraints={constraints}
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

        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={`block-${i}`}
            className="absolute bg-white/5 border border-white/10"
            style={{
              left: Math.random() * 2200 + 100,
              top: Math.random() * 2200 + 100,
              width: Math.random() * 120 + 60,
              height: Math.random() * 120 + 60,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}

        {items.map((item: any) => {
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
                onSelect && onSelect(item.id);
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

      <style jsx global>{`
        .clip-hex {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>
    </div>
  );
}

