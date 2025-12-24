import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AudioPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const togglePlay = () => {
        if (!audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleStart = () => {
        setHasInteracted(true);
        if (audioRef.current) {
            audioRef.current.volume = 0.3; // 30% volume
            audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
        }
    };

    if (!hasInteracted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <Button onClick={handleStart} className="px-8 py-4 text-xl border-2 border-primary text-primary hover:bg-primary hover:text-black animate-pulse shadow-[0_0_20px_rgba(0,243,255,0.3)]">
                    <Play className="mr-2 h-6 w-6" /> INITIALIZE SYSTEM
                </Button>
            </div>
        );
    }

    return (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
            <audio ref={audioRef} loop>
                <source src="/audios/music/background.mp3" type="audio/mpeg" />
            </audio>
            
            <button 
                onClick={toggleMute}
                className="bg-black/60 border border-primary/30 p-2 text-primary hover:bg-primary/20 transition-all clip-path-button"
            >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
        </div>
    );
}
