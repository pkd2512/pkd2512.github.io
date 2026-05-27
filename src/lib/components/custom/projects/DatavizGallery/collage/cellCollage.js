/**
 * Pure helpers + tunable constants for the per-cell image collage that
 * sits behind each voronoi polygon. Kept separate from the Svelte
 * component so the math is testable in isolation and the component
 * stays a thin render layer.
 *
 * Layout is a squarified treemap (d3-hierarchy) over the cell's bbox,
 * so tiles vary in size and aspect ratio rather than forming a uniform
 * grid. Each tile's relative weight is a stable per-cell hash → the
 * mosaic doesn't reshuffle between frames.
 */
import { hierarchy, treemap, treemapSquarify } from 'd3-hierarchy';

// ── Tunable constants ────────────────────────────────────────────────

/** Approximate minimum tile edge length in svg-px (used as a target). */
export const TILE_MIN = 5;
/** Approximate maximum tile edge length in svg-px (used as a target). */
export const TILE_MAX = 25;
/** Gap between adjacent tiles, in svg-px. Gives a mosaic feel. */
export const TILE_GAP = 3;
/** Max per-tile tilt, in degrees (rotation is stable per cell + leaf). */
export const TILE_TILT_DEG = 3;
/**
 * Target tile density — aim for one tile per this many svg-px². Drives
 * the total leaf count when a cell has more area than its item count
 * could fill on its own.
 */
export const TILE_DENSITY = 55 * 55;
/**
 * Variety factor for tile weights. 0 = perfectly equal sizes,
 * 1 = wide range. ~0.6 gives a pleasant magazine-mosaic look.
 */
export const TILE_VARIETY = 0.65;

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Sanitise a cell name into something safe to use inside an SVG id.
 * @param {string} s
 */
export function slugId(s) {
  return String(s)
    .replace(/[^a-z0-9]+/gi, '-')
    .toLowerCase();
}

/**
 * Fast deterministic 32-bit FNV-1a hash. Used to seed per-cell tile
 * rotation so the angles don't shuffle every frame.
 * @param {string} s
 * @returns {number}
 */
export function hash32(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Stable Fisher-Yates-like subset of `[0..total)` of length `count`,
 * seeded by a 32-bit hash. Used to choose which of a section's images
 * to display when the polygon is too small to host every one — and
 * to do so deterministically (same cell → same subset every render).
 *
 * @param {number} total  Population size (item count)
 * @param {number} count  How many indices to draw (count ≤ total)
 * @param {number} seed   PRNG seed
 * @returns {number[]}
 */
function pickSubset(total, count, seed) {
  const arr = new Array(total);
  for (let i = 0; i < total; i++) arr[i] = i;
  let s = seed >>> 0;
  // Mulberry32-ish step inlined for tightness.
  const next = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  // Partial shuffle: only need the first `count` slots fixed.
  const n = Math.min(count, total);
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(next() * (total - i));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr.slice(0, n);
}

/**
 * Bounding box (minX, minY, width, height) of a polygon.
 * @param {Array<[number, number]>} polygon
 */
function bbox(polygon) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of polygon) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, w: maxX - minX, h: maxY - minY };
}

/**
 * @typedef {Object} CollageTile
 * @property {number} x       Top-left x (after gap inset)
 * @property {number} y       Top-left y
 * @property {number} width   Tile width
 * @property {number} height  Tile height (varies independently of width)
 * @property {number} cx      Centre x (rotation pivot)
 * @property {number} cy      Centre y
 * @property {number} rot     Rotation in degrees, stable per cell + leaf
 * @property {string} url     Image URL (with leading `/`)
 * @property {string} key     Stable Svelte key
 */

/**
 * Pick how many tiles to render in this cell. We never show the same
 * image twice within a section, so the count is capped at the number
 * of available thumbnails. Within that limit we try to honour the
 * density target so large polygons don't end up with absurdly huge
 * tiles when the group has very few items.
 *
 * Net effect:
 *   - n items, small cell  → fewer than n tiles (sized by area)
 *   - n items, large cell  → exactly n tiles (one of each, larger)
 *
 * @param {number} area    Polygon area in svg-px²
 * @param {number} nItems  Number of thumbnails available
 */
export function pickTileCount(area, nItems) {
  if (nItems <= 0) return 0;
  // How many tiles the area "wants" at our target density.
  const densityTarget = Math.max(1, Math.ceil(area / TILE_DENSITY));
  // Never exceed the item count (no duplicates) and never go below 1.
  return Math.max(1, Math.min(nItems, densityTarget));
}

/**
 * Build a squarified-treemap collage for one cell. Tiles vary in both
 * size and aspect ratio. The treemap is computed over the polygon's
 * bbox; the caller is expected to clip the result to the actual shape.
 *
 * @param {{polygon:[number,number][], area:number, name:string}} cell
 * @param {string[]} thumbs  Asset paths (no leading `/`)
 * @returns {CollageTile[]}
 */
export function tilesForCell(cell, thumbs) {
  if (!thumbs?.length) return [];
  const { minX, minY, w, h } = bbox(cell.polygon);
  if (w < 2 || h < 2) return [];

  const nameHash = hash32(cell.name);
  const nLeaves = pickTileCount(cell.area, thumbs.length);

  // Pick which `nLeaves` of the available `thumbs` to show — when the
  // cell is too small to fit every item, we deterministically choose a
  // stable subset (seeded by the cell name) so the selection doesn't
  // shuffle between frames.
  const order = pickSubset(thumbs.length, nLeaves, nameHash);

  // Build the leaves. Each gets a stable pseudo-random weight so tiles
  // vary in size; weights are still seeded per (cell, leafIndex) so the
  // mosaic never reshuffles between renders or resizes.
  const leaves = new Array(nLeaves);
  for (let i = 0; i < nLeaves; i++) {
    const thumbIdx = order[i];
    const seed = (nameHash ^ Math.imul(i + 1, 2654435761)) >>> 0;
    const rand = (seed % 100000) / 100000; // 0..1
    // Map rand to a weight skewed up so a few tiles become magazine-
    // style "hero" tiles. TILE_VARIETY = 0 → equal sizes.
    const weight = 1 + (rand - 0.25) * TILE_VARIETY * 4;
    leaves[i] = {
      _i: i,
      weight: Math.max(0.05, weight),
      rand,
      url: thumbs[thumbIdx],
    };
  }

  const root = hierarchy({ children: leaves }).sum(
    (/** @type {any} */ d) => d.weight || 0
  );

  treemap()
    .tile(treemapSquarify.ratio(1.3))
    .size([w, h])
    .paddingInner(TILE_GAP)
    .round(false)(/** @type {any} */ (root));

  /** @type {CollageTile[]} */
  const tiles = [];
  for (const leaf of /** @type {any} */ (root).leaves()) {
    const lx = leaf.x0;
    const ly = leaf.y0;
    const lw = leaf.x1 - leaf.x0;
    const lh = leaf.y1 - leaf.y0;
    if (lw <= 0 || lh <= 0) continue;
    const data = leaf.data;
    tiles.push({
      x: minX + lx,
      y: minY + ly,
      width: lw,
      height: lh,
      cx: minX + lx + lw / 2,
      cy: minY + ly + lh / 2,
      rot: (data.rand * 2 - 1) * TILE_TILT_DEG,
      url: '/' + data.url,
      key: 'l' + data._i,
    });
  }
  return tiles;
}
