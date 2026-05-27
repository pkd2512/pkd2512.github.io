/**
 * Deterministic FNV-1a 32-bit hash.
 * @param {string} s
 * @returns {number}
 */
export function hash32(s) {
  let h = 0x811c9dc5 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Mulberry32 PRNG.
 * @param {number} seed
 * @returns {() => number}
 */
function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Build a 256-element permutation table from a seed string.
 * @param {string} seed
 * @returns {Uint8Array}
 */
function permTable(seed) {
  const rng = mulberry32(hash32(seed));
  const arr = Uint8Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

/** Fade curve for Perlin noise */
function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/** Linear interpolation */
function lerp(a, b, t) {
  return a + t * (b - a);
}

/** Gradient dot product for Perlin noise */
function grad(hash, x, y) {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

/**
 * 2D Perlin noise. Returns values roughly in [-1, 1].
 * @param {number} x
 * @param {number} y
 * @param {Uint8Array} perm - 512-element permutation table (two copies stacked)
 * @returns {number}
 */
function perlin2D(x, y, perm) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);
  const aa = perm[perm[X] + Y];
  const ab = perm[perm[X] + Y + 1];
  const ba = perm[perm[X + 1] + Y];
  const bb = perm[perm[X + 1] + Y + 1];
  return lerp(
    lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
    v
  );
}

/** Frame width in px */
export const FRAME_W = 280;
/** Gap between tiles in px */
export const GAP = 30;
/** Span precision for CSS grid-row: span calc(...) */
export const PRECISION = 10;
/** World width for the grid container */
export const WORLD_W = 2500;

/**
 * Perlin-noise jitter offsets for a tile.
 * Returns rotation (deg), dx (px), dy (px) — smoothly varying across tiles.
 * @param {number} index
 * @param {Uint8Array} perm
 * @returns {{ rot: number, dx: number, dy: number }}
 */
export function tileJitter(index, perm) {
  const x = index * 0.5;
  const rot = perlin2D(x, 0, perm) * 2;
  const dx = perlin2D(x, 100, perm) * GAP * 0.5;
  const dy = perlin2D(x, 200, perm) * GAP * 0.3;
  return { rot, dx, dy };
}

/**
 * Generate the permutation table for a project seed.
 * @param {string} seed
 * @returns {Uint8Array}
 */
export function makePerm(seed) {
  const p = permTable(seed);
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  return perm;
}

/**
 * Generate inline style string for a masonry tile.
 * Sets aspect-ratio CSS variables and Perlin-noise jitter (rotation + position).
 * @param {{aspect?:number}} item
 * @param {string} seed
 * @param {number} index
 * @param {Uint8Array} perm
 * @returns {string}
 */
export function tileStyle(item, seed, index, perm) {
  const w = item.aspect ? Math.round(item.aspect * 1000) : 1;
  const h = 1000;
  const { rot, dx, dy } = tileJitter(index, perm);
  return `--w: ${w}; --h: ${h}; transform: rotate(${rot}deg) translate(${dx}px, ${dy}px);`;
}

/**
 * Inline styles for the masonry inner container (CSS Grid).
 * @returns {string}
 */
export function masonryContainerStyle() {
  return `display: grid; clip-path: margin-box; margin: calc(-1 * ${GAP}px / 2); grid-template-columns: repeat(auto-fill, minmax(${FRAME_W}px, 1fr)); width: ${WORLD_W}px;`;
}
