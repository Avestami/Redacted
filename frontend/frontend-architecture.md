# Frontend Architecture & Structure

## Overview
The frontend is built using **Next.js 15+ (App Router)**, **TypeScript**, and **Tailwind CSS**. 
Visuals are powered by **Three.js (@react-three/fiber)** for the 3D map and **Framer Motion** for UI animations.

## Directory Structure

We follow a **Feature-Based Architecture**. This keeps related logic, components, and hooks together, making the codebase modular and scalable.

```
frontend/
├── app/                    # Next.js App Router pages (Entry points)
│   ├── page.tsx            # Landing / Home
│   ├── game/[id]/          # Game Room
│   └── layout.tsx          # Global layout
│
├── features/               # Feature Modules
│   ├── map/                # 3D Map Logic & Components
│   │   ├── components/     # Map-specific components (WorldMap, GameNode, etc.)
│   │   └── hooks/          # Map interaction hooks
│   │
│   ├── game/               # Gameplay Logic
│   │   ├── components/     # Game HUD, Action Panels, Resource Display
│   │   └── hooks/          # Game state hooks
│   │
│   ├── lobby/              # Lobby / Menu Logic
│   │   └── components/     # Main Menu, Join Forms
│   │
│   └── ui/                 # Shared UI Components (Design System)
│       └── components/     # Button, Card, Input, etc.
│
├── lib/                    # Shared Utilities (cn, constants)
├── services/               # API Clients & Data Fetching
└── public/                 # Static Assets
```

## Key Principles

1.  **Modularity**: Each feature should be self-contained. `features/game` shouldn't depend heavily on internal details of `features/lobby`.
2.  **Performance**: 
    *   3D scenes are optimized with `frustumCulled`, low-poly assets, and efficient particle systems.
    *   React components use `memo` where necessary to prevent re-renders.
3.  **Responsiveness**: The UI is designed Mobile-First (PWA ready).
4.  **Theming**: Dark Winter / Cyberpunk Noir theme via Tailwind variables in `globals.css`.

## Core Features

### 1. Map System (`features/map`)
*   **WorldMap**: The main Canvas entry point.
*   **Terrain**: Procedurally generated snow terrain.
*   **Navigation**: Supports "Tactical View" (Locked isometric-like) and "Free Roam".
*   **Optimization**: Bounds clamping prevents users from navigating into the void.

### 2. Game Logic (`features/game`)
*   **State**: Real-time polling (MVP) for game state updates.
*   **Interaction**: Click-to-select targets on the map.
*   **HUD**: Displays resources, logs, and action menus overlaying the 3D map.

### 3. UI System (`features/ui`)
*   **Glassmorphism**: Heavy use of backdrops and semi-transparent blacks.
*   **Animations**: Framer Motion for entrance/exit transitions.
