import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md', 
    ...props 
}) => {
    // Game-like button with slanted edges (clip-path)
    const baseStyles = 'relative inline-flex items-center justify-center font-bold font-mono transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wide group overflow-hidden';
    
    const variants = {
        primary: 'bg-primary text-black hover:bg-white hover:text-black border-none',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'bg-transparent border border-primary/50 text-primary hover:bg-primary/10 hover:border-primary',
        ghost: 'hover:bg-primary/10 text-primary hover:text-white',
        danger: 'bg-destructive text-white hover:bg-red-600',
    };

    const sizes = {
        sm: 'h-8 px-4 text-xs',
        md: 'h-12 px-8 text-sm',
        lg: 'h-16 px-10 text-lg',
    };

    return (
        <button 
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
            {...props}
        >
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
            {/* Glitch overlay on hover */}
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
        </button>
    );
};

export default Button;
