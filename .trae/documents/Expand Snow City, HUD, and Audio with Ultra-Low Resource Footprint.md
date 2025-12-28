## Terrain & City Pad

* Increase world radius (e.g., 50) and keep inner micro-city (\~4–5) flat.

* Add a square city pad (flat plane) that sits flush with building bases; clamp terrain displacement to \~0 under this pad to guarantee contact.

* Surrounding outer ring becomes a realistic snowy plain with multi-octave noise (subtle hills, soft normals).

* Maintain border clamp and orbit-only free mode.

## Buildings: Templates & Materials

* Replace cubes with procedural building templates:

  1. Tower: tall, thin, stacked segments with cap; darker body, lighter roof.
  2. Block: mid-height, wider footprint; window bands via emissive stripes.
  3. Spire: tapered silhouette using scaled segments; metallic accents.

* Use instanced meshes for each template to keep draw calls minimal.

* Color palette: cool steel blues and snow whites with muted neons (#263142 body, #9fb0c4 accents, emissive strips in #00f3ff/#dc2626 sparingly).

* Snap building base Y to pad plane; ensure bases are level.

## Roads & City Layout

* Keep grid roads but clip to square pad; add diagonals and a central plaza ring for variety.

* Road widths and spacing tuned for micro scale (≤0.05–0.06 units) and low geometry.

## Snow Particles (Smaller, Round, Continuous)

* Use a tiny circular sprite (generated in-memory canvas texture) with `PointsMaterial map`, `alphaTest`, `sizeAttenuation` for round flakes.

* Reduce count further (e.g., 80–120) and size (\~0.03–0.045).

* Keep POV-scoped spawn and continuous timed invalidation to fall forever.

## Camera Tuning

* Locked: slower WASD (e.g., 0.12–0.16 units per tick), higher damping; zoom limits tightened to allow ground-level viewing (`minDistance ~2.2`, `maxDistance ~6.0`).

* Free orbit: no pan; zoom narrower (`minDistance ~2.8`, `maxDistance ~8.0`).

* Gentle lerp between camera and target for smoothness.

* add the option to lock the camera around the center of the map so user can circle their pov around it.

* make the zoom go much closer to the ground and less higher.

## HUD (Responsive, Transparent, Game-Like)

* Implement a new HUD overlay component:

  * XP/Progress bars styled as neon-glass strips (transparent, backdrop blur, subtle glow).

  * Resource meters (power, credits, integrity) with compact mobile layout and expanded desktop layout.

  * Minimal buttons replaced by shaped controls (clip-path) consistent with theme. and transparency.

* Mobile-first CSS with PWA-friendly touch targets; avoid heavy effects.

## Background Music Control

* Add a `MusicController` with a small toggle button:

  * Plays a bundled ambient track via `AudioContext` + `GainNode`.

  * Remembers state in `localStorage`.

  * Autoplay guarded by user gesture (toggle button).

## Performance Guarantees

* Keep `frameloop="demand"` and trigger `invalidate()` only on interactions and snow timer.

* Tile-based visibility for roads/buildings; cull tiles outside `renderRadius`.

* No shadows, no postprocessing; low DPR; minimal materials.

* LOD: near = template instanced meshes; mid/far = hide.

## Implementation Steps

1. Add square city pad and clamp terrain displacement under pad.
2. Expand terrain radius and retune noise for realistic plain.
3. Generate round snow sprite and wire to PointsMaterial; decrease size/count.
4. Implement building templates and replace cube instancing; snap bases.
5. Replace road generator to use square clip and optional diagonals/plaza.
6. Tighten camera limits and speed; add lerp smoothing.
7. Create `MusicController` with a toggle and state persistence.
8. Build responsive HUD component (bars/meters, transparent theme) and mount.
9. Verify performance: draw calls, FPS on low-end device profile; tune counts.

## Acceptance Criteria

* Ground-level zoom achievable; zoom-out limited.

* Snow: tiny, round, continuous; resource use remains low.

* Buildings look like towers/spires/blocks with thematic colors; bases sit flush.

* HUD is responsive and transparent, PWA-friendly.

* Ambient music controlled by a button; remembers preference.

* Scene remains smooth on low-end hardware due to culling and demand rendering.

