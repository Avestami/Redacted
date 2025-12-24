"use client";

import React, { useEffect, useRef } from 'react';

export default function SnowEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles: { x: number; y: number; radius: number; speed: number; wind: number }[] = [];
        const particleCount = 150; // Balanced for mobile

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 0.5,
                speed: Math.random() * 1 + 0.5,
                wind: Math.random() * 0.5 - 0.25
            });
        }

        function animate() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();

            particles.forEach(p => {
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                
                p.y += p.speed;
                p.x += p.wind;

                if (p.y > height) {
                    p.y = 0;
                    p.x = Math.random() * width;
                }
                if (p.x > width) p.x = 0;
                if (p.x < 0) p.x = width;
            });

            ctx.fill();
            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 z-10 pointer-events-none opacity-40"
        />
    );
}
