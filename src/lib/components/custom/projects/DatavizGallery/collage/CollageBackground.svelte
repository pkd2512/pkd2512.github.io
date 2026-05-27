<script>
  import {
    hash32,
    TILE_GAP,
    TILE_TILT_DEG,
    TILE_VARIETY,
  } from './cellCollage.js';
  import { hierarchy, treemap, treemapSquarify } from 'd3-hierarchy';

  /**
   * Static image bed for one cell. Layout is a squarified treemap
   * confined to a rectangular *patch* — usually the cell's bounding
   * box plus a small margin, not the whole canvas. Keeps individual
   * tiles small while only painting over the area the polygon could
   * ever reveal.
   *
   * The patch never moves once mounted; the cell's clip-path on top
   * is what changes shape, so this acts as the static image layer.
   *
   * @type {{
   *   width: number,
   *   height: number,
   *   thumbs: string[],   // paths without leading `/`
   *   x?: number,         // patch top-left x (default 0)
   *   y?: number,         // patch top-left y (default 0)
   *   seed?: string       // any string — same seed → identical layout
   * }}
   */
  let { width, height, thumbs, x = 0, y = 0, seed = 'dataviz-bed' } = $props();

  /**
   * Build the static treemap, sized to the given (width × height)
   * patch. Each leaf gets a stable seeded weight + rotation so the
   * mosaic doesn't reshuffle on re-render or resize.
   */
  let tiles = $derived.by(() => {
    if (!thumbs?.length || width < 2 || height < 2) return [];
    const seedHash = hash32(
      seed + ':' + Math.round(width) + 'x' + Math.round(height)
    );

    const leaves = thumbs.map((url, i) => {
      const s = (seedHash ^ Math.imul(i + 1, 2654435761)) >>> 0;
      const rand = (s % 100000) / 100000;
      // Slightly skewed weight → a few magazine-style hero tiles.
      const weight = Math.max(0.05, 1 + (rand - 0.25) * TILE_VARIETY * 4);
      return { _i: i, url, rand, weight };
    });

    const root = hierarchy({ children: leaves }).sum(
      (/** @type {any} */ d) => d.weight || 0
    );

    const tm = /** @type {any} */ (treemap());
    tm
      .tile(treemapSquarify.ratio(1.3))
      .size([width, height])
      .paddingInner(TILE_GAP)
      .round(false)(root);

    /** @type {Array<{x:number,y:number,w:number,h:number,cx:number,cy:number,rot:number,url:string,key:string}>} */
    const out = [];
    for (const leaf of /** @type {any} */ (root).leaves()) {
      const w = leaf.x1 - leaf.x0;
      const h = leaf.y1 - leaf.y0;
      if (w <= 0 || h <= 0) continue;
      out.push({
        x: leaf.x0,
        y: leaf.y0,
        w,
        h,
        cx: leaf.x0 + w / 2,
        cy: leaf.y0 + h / 2,
        rot: (leaf.data.rand * 2 - 1) * TILE_TILT_DEG,
        url: '/' + leaf.data.url,
        key: 'bg' + leaf.data._i,
      });
    }
    return out;
  });
</script>

<!-- The whole patch is translated into place once; tile coordinates
     within `tiles` stay in the patch's local frame. -->
<g class="collage-bg" pointer-events="none" transform="translate({x} {y})">
  <!-- Solid white backdrop behind the tiles. Fills the gaps left by
       `paddingInner` and any uncovered slivers between rotated tiles
       so the cell never shows the (transparent) SVG background through. -->
  <rect x="0" y="0" {width} {height} fill="#fff"></rect>
  {#each tiles as t (t.key)}
    <image
      href={t.url}
      x={t.x}
      y={t.y}
      width={t.w}
      height={t.h}
      preserveAspectRatio="xMidYMid slice"
      transform="rotate({t.rot} {t.cx} {t.cy})"
    ></image>
  {/each}
</g>

<style lang="scss">
  .collage-bg {
    image-rendering: auto;
  }
</style>
