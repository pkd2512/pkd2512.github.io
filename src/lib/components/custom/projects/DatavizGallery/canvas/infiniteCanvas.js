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
 * Wrap a coordinate so it stays in [-W/2, W/2].
 * @param {number} v
 * @param {number} W
 * @returns {number}
 */
export function wrap(v, W) {
  if (W <= 0) return 0;
  return (((v % W) + W) % W) - W / 2;
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
 * Masonry layout using shortest-column filling.
 * Tile width is fixed, heights are passed in (from actual image aspect ratios).
 * Returns { x0, y0, w, h, url, ref_url, title, rot }.
 *
 * @param {Array<{url:string, ref_url?:string, title?:string}>} items
 * @param {number[]} heights  actual pixel height for each tile (computed from image aspect ratio)
 * @param {number} tileW   column width in px
 * @param {number} gap     gap in px
 * @param {string} seed    stable seed
 * @returns {Array<{x0:number, y0:number, w:number, h:number, url:string, ref_url:string, title:string, rot:number}>}
 */
export function layoutMasonry(items, heights, tileW, gap, seed) {
  if (!items?.length) return [];

  const cols = Math.max(1, Math.floor((2500 + gap) / (tileW + gap)));
  const prng = mulberry32(hash32(seed));

  const colHeights = new Array(cols).fill(0);
  const result = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const h = heights[i] || 200;

    let minCol = 0;
    for (let c = 1; c < cols; c++) {
      if (colHeights[c] < colHeights[minCol]) minCol = c;
    }

    const x0 = minCol * (tileW + gap) + (prng() - 0.5) * gap * 0.5;
    const y0 = colHeights[minCol] + (prng() - 0.5) * gap * 0.3;
    const rot = (prng() * 2 - 1) * 2;

    result.push({
      x0,
      y0,
      w: tileW,
      h,
      url: '/media/' + item.url,
      ref_url: item.ref_url || '',
      title: item.title || '',
      rot,
    });

    colHeights[minCol] = y0 + h + gap;
  }

  return result;
}
