"use client";

import React, { useEffect, useRef, useState } from "react";

export default function MusicController() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const saved = localStorage.getItem("music_enabled");
    if (saved === "true") setEnabled(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("music_enabled", enabled ? "true" : "false");
    if (!audioRef.current) return;
    if (enabled) {
      audioRef.current.volume = 0.15;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [enabled]);
  return (
    <div className="pointer-events-auto fixed top-4 right-4 z-20">
      <button
        onClick={() => setEnabled((v) => !v)}
        className="group relative flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-black/40 text-xs font-mono text-primary backdrop-blur hover:border-primary"
      >
        {enabled ? "MUSIC: ON" : "MUSIC: OFF"}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
      </button>
      <audio ref={audioRef} src="/audio/ambient.mp3" preload="auto" />
    </div>
  );
}

