## Goals
- Restore snow particles and realistic snowy environment.
- Tiny circular world: inner micro-city with roads; outer ring is snowy mountains.
- Render only the player’s POV region; keep everything else unloaded/unrendered.
- Smooth, slower camera with strict zoom limits; two modes (Locked WASD, Free Orbit-only).
- Remove circular road lines; generate a believable city road grid.
- Maintain extremely low GPU/CPU usage.

## Rendering & Performance
- Use `frameloop="demand"` and call `invalidate()` only upon user input (WASD, zoom, drag), drastically reducing frames.
- Implement tile-based visibility: divide terrain into concentric ring tiles + city grid tiles; only instantiate and render tiles within `renderRadius` from the camera target using spatial hashing (grid lookup).
- Frustum culling stays on; additionally perform distance-based culling for buildings and roads.
- Replace distant content with impostors:
  - Merge far buildings into a single low-poly instanced silhouette or a baked height field mesh.
  - Disable materials with heavy lighting; use `meshBasicMaterial` for far impostors.
- Keep stars low count; snow particles reintroduced at low count, but spawn only above visible tiles.
- Use tiny geometry scales and limit shadow usage (none) and post-processing (none).

## Terrain & City Generation
- Circular terrain (`radius ~ 12`):
  - Inner city disc (`cityRadius ~ 4`) flat with minor noise.
  - Outer ring: snowy mountainous displacement (multi-octave sine/perlin hybrid) with soft normals.
- City roads:
  - Procedural grid clipped to circle: generate X/Z stripes (thin planes) clipped by circle equation `x^2 + z^2 <= cityRadius^2`.
  - Add block diagonals for variation and a central plaza.
- Buildings:
  - Instanced boxes with varied heights/footprints; cluster variance by cell.
  - Optional tiny roof details (caps) for visual richness at negligible cost.
  - Keep count ~120–180 total; LOD: near=instanced detail, mid=merged groups, far=hidden/impostor.

## Snow Particles
- Re-add particles (`count ~ 600`) with downward drift; reset at ground.
- Spawn within camera `renderRadius` only and despawn outside.
- `depthWrite=false`, small `size`, `transparent=true`.

## Camera Modes & Controls
- Locked mode:
  - `MapControls` with `enableRotate=false`.
  - Movement: WASD moves target; speed reduced, damping increased; clamp movement within circle radius (minus margin).
  - Zoom limits: `minDistance ~ 5`, `maxDistance ~ 12`.
- Free mode:
  - `OrbitControls` with `enablePan=false` (orbit-only around center).
  - Zoom limits: `minDistance ~ 6`, `maxDistance ~ 14`.
- Add gentle smoothing by lerping camera position/target each frame.

## Render-Only-POV Implementation
- Maintain `controlsRef.target` as POV center.
- Compute `visibleTiles = tiles.filter(tile => dist(tile.center, target) <= renderRadius)`.
- Mount/unmount tile groups (terrain chunk, roads, buildings) reactively when entering/exiting `visibleTiles`.
- Snow particles emitter follows `target`; particle positions constrained to `renderRadius`.
- Keep `renderRadius` small (e.g., 6–8 units) to minimize draw calls.

## API & Integration
- Keep `GameNode` overlay support; nodes placed inside city disc or mountain ring.
- First page remains full-screen world; `C` toggles camera mode.

## Implementation Steps
1. Introduce tile system utilities (grid generator, circle clip, spatial index).
2. Refactor terrain: split into inner city disc + ring tiles; distance-cull tiles.
3. Procedural city builder: generate road planes and instanced building transforms per tile; add LOD.
4. Re-add snow: emitter scoped to visible tiles; low count; drift + reset.
5. Camera controller: smoothing, clamp, strict zoom limits; invalidate on user input only.
6. Performance audit: verify draw calls (< 100), GPU time, and memory; tune counts.
7. Replace circle road lines; keep grid roads only.

## Acceptance Criteria
- Smooth on low-end devices; map looks detailed but is tiny.
- Only nearby terrain/city is rendered; moving reveals/loads tiles seamlessly.
- Snow falls visibly over current POV area; no heavy resource spikes.
- Camera feels slow and precise; cannot zoom out too far; borders unreachable.

## Notes
- All changes localized in `features/map/components/WorldMap.tsx` and small helpers.
- No external libraries required beyond existing `react-three-fiber` and `drei`.
- We’ll keep parameters easily tweakable (`radius`, `cityRadius`, counts, renderRadius).