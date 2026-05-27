# Feature 2 — Infinite Canvas gallery (plan)

When a user clicks a voronoi cell, an overlay opens revealing every image in
that group laid out on an "infinite" pannable canvas. Implementation deferred —
this doc captures the plan so we can pick it up later.

---

## References audited

| Demo | Strengths | Weaknesses |
| --- | --- | --- |
| [Tympanus Infinite Canvas](https://tympanus.net/Tutorials/InfiniteCanvas/) | Magical wrap-around pan; smooth WebGL; tagged `#scroll #infinite #draggable #three.js #webgl`. | Pulls in three.js (heavy); texture management for 100+ images is non-trivial. |
| [Nemutas draggable](https://nemutas.github.io/draggable/) | Pure DOM/CSS; same wrap-around trick; no WebGL dependency; small payload. | Fewer fancy effects; we'd be writing the drag handling ourselves. |
| [Tympanus Infinite Layers Grid](https://tympanus.net/Tutorials/InfiniteLayersGrid/) | Beautiful parallax layers. | Vertical-scroll storytelling, not free 2D exploration — wrong fit. |

## Chosen direction

**Nemutas-style DOM wrap-around + GSAP `Draggable` for input.**

GSAP 3.13+ ships every plugin (Draggable, InertiaPlugin, Flip, ScrollTrigger…)
under the free "Standard 'no charge'" license — confirmed via
`npm pack gsap --dry-run`. Bundle cost ≈ 46 KB min+gz for core + Draggable +
InertiaPlugin.

---

## Architecture

```
DatavizGallery/canvas/
├── InfiniteCanvas.svelte    ← fullscreen overlay + Draggable wiring
└── infiniteCanvas.js        ← pure helpers: layout, modulo wrap, hash
```

### Mechanic

1. **Layout once** (`infiniteCanvas.js`)
   - Given `N` items, produce a jittered grid sized `world.w × world.h` with
     tile size `T` and gap `G`. Return `[{x0, y0, w, h, url, ref, title, rot}]`
     with a stable seed so the same group always lays out the same way.
2. **Stage** (`<div class="stage">`)
   - All tile `<a>` elements absolutely positioned. The stage itself has a
     CSS transform driven by GSAP — never `top/left`.
3. **GSAP Draggable** on the stage

   ```js
   import gsap from 'gsap';
   import { Draggable } from 'gsap/Draggable';
   import { InertiaPlugin } from 'gsap/InertiaPlugin';
   gsap.registerPlugin(Draggable, InertiaPlugin);

   Draggable.create(stage, {
     type: 'x,y',
     inertia: true,
     edgeResistance: 0,
     onDrag: applyWrap,
     onThrowUpdate: applyWrap,
   });
   ```

4. **Wrap-around**
   - The stage's `x, y` accumulate; on every update, each tile gets a
     per-element transform of

     ```
     wrap(v, W) = ((v % W) + W) % W − W/2
     translateX = wrap(x0 + stageX, W)
     translateY = wrap(y0 + stageY, H)
     ```

     So a tile leaving one side reappears at the opposite — infinite pan with
     finite content.
5. **Wheel pan**
   - Single `wheel` listener feeds the stage with
     `gsap.to(stage, {x:'+=…', y:'+=…', duration:0.6, ease:'power3.out',
     overwrite:true, onUpdate:applyWrap})`. Two-finger trackpad falls into the
     same path.
6. **Click vs drag**
   - Draggable's `onClick` only fires when no meaningful drag happened. There
     we open the source URL in a new tab.

### Open / close transition (FLIP)

Pure `gsap.fromTo`, no Flip plugin needed (could use it for polish):

```js
gsap.fromTo(ghost,
  { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
  { x: 0, y: 0, width: '100vw', height: '100vh',
    duration: 0.4, ease: 'power3.out',
    onComplete: () => ghost.remove() });
```

- On click of a voronoi cell, capture `path.getBoundingClientRect()` and pass
  it to the overlay.
- Mount overlay with a transient `<div class="ghost">` at that bbox in
  `--purple`, fade the canvas in underneath, remove the ghost.
- On close: reverse — ghost shrinks back to the cell bbox while canvas fades.

### Tile rendering

- ~200 × 150 (4 : 3) tiles with ~30 px gap.
- ±2° rotation seeded per index for a hand-collaged feel.
- `<a href={item.ref_url || '/' + item.url} target="_blank" rel="noopener">`
  → click opens source URL in a new tab.
- Title overlay on hover.
- Native `loading="lazy"` on each image.

### Accessibility

- Focus trap inside the overlay while open; restore focus on close.
- `Esc` closes; arrow keys nudge pan; `+ / −` could later trigger a zoom step.
- `aria-modal="true"` + a heading announcing the active group.

### Wiring in `index.svelte`

```js
let expandedGroup = $state(/** @type {string|null} */ (null));
let originRect    = $state(/** @type {DOMRect|null} */ (null));
```

- Voronoi `onselect` now also receives the clicked cell's bbox
  (`e.currentTarget.getBoundingClientRect()`).
- Render `<InfiniteCanvas>` when `expandedGroup`, passing
  `{ items, title, originRect, onclose }`.

### Effort estimate

- `InfiniteCanvas.svelte` ≈ 250 lines
- `infiniteCanvas.js` ≈ 80 lines
- Plumbing in `index.svelte` ≈ 20 lines
- Plumbing in `Voronoi.svelte`'s `onselect` ≈ 5 lines

### Open questions to revisit before starting

1. Click a tile → open `ref_url` (source) or the full local image? Default: source.
2. Pinch-/wheel-zoom in v1, or postpone? Default: postpone (just pan).
3. Hide the underlying voronoi behind the overlay (current plan) or keep it
   dimmed for context?
4. Mobile: a single big tile per screen with swipe-to-next, or same drag world
   downscaled? Default: same world; let the user pinch-out if needed.
