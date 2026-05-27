<script>
  import { hierarchy } from 'd3-hierarchy';
  import { voronoiTreemap } from 'd3-voronoi-treemap';
  import { weightedVoronoi } from 'd3-weighted-voronoi';
  import CollageBackground from '../collage/CollageBackground.svelte';

  // ==========================================================
  // CONFIG (tweak freely)
  // ==========================================================

  /** Iteration count for the first visible frame (lower = more chaotic). */
  const ITER_START = 5;
  /** Iteration count for the final (converged) layout. */
  const ITER_END = 50;
  /** Number of snapshot stages along the way (more = smoother settle). */
  const STAGES = 10;
  /** ms spent morphing between each pair of stages. */
  const STAGE_MS = 500;
  /** Fraction of the morph timeline used for the per-cell circle→polygon
   *  birth (0 = no birth phase, 0.35 = first 35% of the animation). */
  /** Duration of the per-cell scale-from-centroid birth, in ms.
   *  Independent of the morph length — change to make births faster/slower.
   *  Set to 0 to skip the birth phase entirely. */
  const BIRTH_MS = 500;
  /** Resize debounce. */
  const RESIZE_DEBOUNCE_MS = 80;
  /** Deterministic seed (so the layout doesn't reshuffle on resize). */
  const SEED = 0x9e3779b9;
  /** Hide labels for cells smaller than this in px². */
  const LABEL_MIN_AREA = 1500;
  /** Min/max label font size in px. */
  const LABEL_MIN_FS = 11;
  const LABEL_MAX_FS = 24;
  /** Voronoi treemap tuning. */
  const MIN_WEIGHT_RATIO = 0.001;

  // ==========================================================

  /**
   * @type {{
   *   counts: Array<{name: string, value: number}>,
   *   palette?: string[],
   *   selected?: string,
   *   onselect?: (name: string) => void,
   *   getThumbs?: (name: string) => string[]
   * }}
   */
  let {
    counts,
    palette = [
      '#41295a',
      '#2f0743',
      '#6b3fa0',
      '#8b5cf6',
      '#a78bfa',
      '#7c3aed',
      '#6d28d9',
      '#5b21b6',
      '#4c1d95',
      '#3b0764',
      '#9333ea',
      '#c084fc',
      '#e9d5ff',
      '#d8b4fe',
      '#c4b5fd',
    ],
    selected = '',
    onselect,
    getThumbs,
  } = $props();

  /**
   * Sanitise a cell name into a safe SVG id fragment.
   * @param {string} s
   */
  function slugId(s) {
    return String(s)
      .replace(/[^a-z0-9]+/gi, '-')
      .toLowerCase();
  }

  /** Extra pixels around each cell's bbox when sizing its image patch.
   *  A small margin keeps the white backdrop from showing through at
   *  the polygon edge as the cell morphs/wobbles. */
  const COLLAGE_MARGIN = 12;

  /**
   * Axis-aligned bounding box of a polygon, expanded by `COLLAGE_MARGIN`
   * and clamped to the canvas. Used to size each cell's image patch.
   *
   * @param {[number,number][]} polygon
   * @param {number} W
   * @param {number} H
   */
  function polyPatch(polygon, W, H) {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (const [px, py] of polygon) {
      if (px < minX) minX = px;
      if (py < minY) minY = py;
      if (px > maxX) maxX = px;
      if (py > maxY) maxY = py;
    }
    const x0 = Math.max(0, Math.floor(minX - COLLAGE_MARGIN));
    const y0 = Math.max(0, Math.floor(minY - COLLAGE_MARGIN));
    const x1 = Math.min(W, Math.ceil(maxX + COLLAGE_MARGIN));
    const y1 = Math.min(H, Math.ceil(maxY + COLLAGE_MARGIN));
    return { x: x0, y: y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) };
  }

  // Collage tile constants live in ./cellCollage.js so the math is
  // testable on its own. Vignette tints the cell over the collage.
  /** Vignette opacity at the centre (0 = clear window, 1 = solid color). */
  const VIGNETTE_INNER = 0;
  /** Vignette opacity at the polygon edge. */
  const VIGNETTE_OUTER = 1;

  /** @type {number} */
  let w = $state(0);
  /** @type {number} */
  let h = $state(0);

  /** Wrap element reference, used for the IntersectionObserver. */
  /** @type {HTMLDivElement | undefined} */
  let wrapEl;
  /** True once the wrap has been scrolled into view at least once. */
  let inView = $state(false);

  // ==========================================================
  // GEOMETRY HELPERS
  // ==========================================================

  /**
   * Area-weighted centroid of a polygon. Returns [cx, cy, area].
   * @param {Array<[number, number]>} poly
   * @returns {[number, number, number]}
   */
  function polyCentroid(poly) {
    let cx = 0;
    let cy = 0;
    let a = 0;
    const n = poly.length;
    for (let i = 0; i < n; i++) {
      const [x0, y0] = poly[i];
      const [x1, y1] = poly[(i + 1) % n];
      const f = x0 * y1 - x1 * y0;
      cx += (x0 + x1) * f;
      cy += (y0 + y1) * f;
      a += f;
    }
    a /= 2;
    if (a === 0) {
      let sx = 0;
      let sy = 0;
      for (let i = 0; i < n; i++) {
        sx += poly[i][0];
        sy += poly[i][1];
      }
      return [sx / n || 0, sy / n || 0, 0];
    }
    return [cx / (6 * a), cy / (6 * a), Math.abs(a)];
  }

  /**
   * Reduced-precision SVG path data for a polygon.
   * @param {Array<[number, number]>} poly
   * @returns {string}
   */
  function polyToPath(poly) {
    let d = 'M';
    for (let i = 0; i < poly.length; i++) {
      if (i > 0) d += 'L';
      d += poly[i][0].toFixed(1) + ',' + poly[i][1].toFixed(1);
    }
    return d + 'Z';
  }

  /**
   * Deterministic Mulberry32 PRNG factory.
   * @param {number} seed
   */
  function makePrng(seed) {
    let s = seed >>> 0;
    return function () {
      s |= 0;
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ==========================================================
  // SNAPSHOTS — capture {x, y, weight, _i} per site at given iter count
  // ==========================================================

  /**
   * Run voronoiTreemap for an exact iteration count and return the
   * per-site state (position + weight). All snapshots share the same
   * PRNG seed so they form a coherent trajectory.
   * @param {Array<{name:string,value:number}>} data
   * @param {number} W
   * @param {number} H
   * @param {number} iters
   * @returns {Array<{x:number,y:number,weight:number,_i:number}>}
   */
  function runSnapshot(data, W, H, iters) {
    const root = hierarchy({
      name: 'root',
      children: data.map((d, i) => ({ ...d, _i: i })),
    }).sum((/** @type {any} */ d) => d.value || 0);

    /** @type {[number, number][]} */
    const clip = [
      [0, 0],
      [W, 0],
      [W, H],
      [0, H],
    ];

    const tm = /** @type {any} */ (voronoiTreemap())
      .clip(clip)
      .prng(makePrng(SEED))
      .minWeightRatio(MIN_WEIGHT_RATIO)
      .convergenceRatio(0)
      .maxIterationCount(Math.max(2, iters));

    try {
      tm(/** @type {any} */ (root));
    } catch {
      return [];
    }

    /** @type {any[]} */
    const leaves = /** @type {any} */ (root).leaves();

    /** @type {Array<{x:number,y:number,weight:number,_i:number}>} */
    const sites = new Array(data.length);
    for (const leaf of leaves) {
      const i = leaf.data._i;
      const site = leaf.polygon && leaf.polygon.site;
      if (!site) continue;
      sites[i] = {
        x: site.x,
        y: site.y,
        weight: site.weight,
        _i: i,
      };
    }
    return sites.filter(Boolean);
  }

  /**
   * Build snapshots at logarithmically-spaced iteration counts so the
   * early frames (lots of motion) get more samples than the late ones.
   * @param {Array<{name:string,value:number}>} data
   * @param {number} W
   * @param {number} H
   */
  function buildSnapshots(data, W, H) {
    if (!data.length || W < 2 || H < 2) return [];
    /** @type {number[]} */
    const schedule = [];
    const k = Math.log(ITER_END / ITER_START);
    for (let i = 0; i < STAGES; i++) {
      const t = i / (STAGES - 1);
      schedule.push(Math.round(ITER_START * Math.exp(k * t)));
    }
    // de-dupe consecutive identical counts
    /** @type {number[]} */
    const cleaned = [];
    for (const n of schedule)
      if (cleaned[cleaned.length - 1] !== n) cleaned.push(n);

    /** @type {Array<ReturnType<typeof runSnapshot>>} */
    const snaps = [];
    for (const iters of cleaned) {
      const s = runSnapshot(data, W, H, iters);
      if (s.length === data.length) snaps.push(s);
    }
    return snaps;
  }

  // ==========================================================
  // PER-FRAME WEIGHTED VORONOI
  // ==========================================================

  /**
   * Build a power-weighted Voronoi from interpolated sites.
   * Returns one cell entry per input row (in input order).
   * @param {Array<{name:string,value:number}>} data
   * @param {Array<{x:number,y:number,weight:number,_i:number}>} sites
   * @param {number} W
   * @param {number} H
   * @param {number} tv
   */
  function buildCells(data, sites, W, H, tv) {
    /** @type {[number, number][]} */
    const clip = [
      [0, 0],
      [W, 0],
      [W, H],
      [0, H],
    ];

    const wv = /** @type {any} */ (weightedVoronoi())
      .x((/** @type {any} */ s) => s.x)
      .y((/** @type {any} */ s) => s.y)
      .weight((/** @type {any} */ s) => s.weight)
      .clip(clip);

    /** @type {any[]} */
    let polys;
    try {
      polys = wv(sites);
    } catch {
      return [];
    }

    /** @type {Array<{name:string,value:number,pct:string,polygon:[number,number][],cx:number,cy:number,area:number,color:string,colorIdx:number}>} */
    const out = new Array(data.length);
    for (const p of polys) {
      const site = p && p.site;
      // d3-weighted-voronoi wraps the input differently across versions —
      // try the known access paths in order.
      const original = (site && (site.originalObject || site)) || {};
      const inputItem = original.originalData || original;
      const idx =
        inputItem && typeof inputItem._i === 'number'
          ? inputItem._i
          : undefined;
      if (idx == null || idx < 0 || idx >= data.length) continue;
      /** @type {[number, number][]} */
      const ring = p;
      if (!ring || ring.length < 3) continue;
      const [cx, cy, area] = polyCentroid(ring);
      out[idx] = {
        name: data[idx].name,
        value: data[idx].value,
        pct: (((data[idx].value || 0) / tv) * 100).toFixed(1),
        // Oversample the ring so circle-phase looks like a real circle.
        polygon: ring,
        cx,
        cy,
        area,
        color: palette[idx % palette.length],
        colorIdx: idx % palette.length,
      };
    }
    return out.filter(Boolean);
  }

  /**
   * Resample a polygon ring to exactly `n` vertices, evenly distributed
   * along its perimeter. Preserves the shape (vertices lie on original
   * edges), but increases vertex density so we can morph from a circle
   * (which only looks like a circle with many points) into the polygon.
   * @param {[number, number][]} ring
   * @param {number} n
   * @returns {[number, number][]}
   */
  function resamplePolygon(ring, n) {
    const m = ring.length;
    if (m < 2) return ring;
    // 1. Cumulative edge lengths.
    /** @type {number[]} */
    const cum = new Array(m + 1);
    cum[0] = 0;
    for (let i = 0; i < m; i++) {
      const [x0, y0] = ring[i];
      const [x1, y1] = ring[(i + 1) % m];
      cum[i + 1] = cum[i] + Math.hypot(x1 - x0, y1 - y0);
    }
    const total = cum[m];
    if (total === 0) return ring;
    /** @type {[number, number][]} */
    const out = new Array(n);
    let edge = 0;
    for (let k = 0; k < n; k++) {
      const target = (k / n) * total;
      while (edge < m - 1 && cum[edge + 1] < target) edge++;
      const t = (target - cum[edge]) / (cum[edge + 1] - cum[edge] || 1);
      const [x0, y0] = ring[edge];
      const [x1, y1] = ring[(edge + 1) % m];
      out[k] = [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
    }
    return out;
  }

  /**
   * Build an SVG path string for a cell, growing it uniformly from its
   * own centroid. At b=0 every vertex collapses to `(cx, cy)` (a point),
   * at b=1 it sits at the true polygon vertex.
   *
   * Crucially this is just a scale-about-centroid transform expressed as
   * raw coordinates — so we can use the resulting path as both the cell
   * outline AND as a `<clipPath>`. The underlying image bed sees the
   * polygon "grow" out of the centroid while staying perfectly still.
   *
   * @param {{polygon:[number,number][], cx:number, cy:number}} cell
   * @param {number} b  morph progress in [0, 1]
   */
  function cellPath(cell, b) {
    const { polygon, cx, cy } = cell;
    if (b >= 1) return polyToPath(polygon);
    if (b <= 0) {
      // A zero-size dot at the centroid — keeps the path valid while
      // contributing no visible area.
      return `M${cx.toFixed(1)},${cy.toFixed(1)}Z`;
    }
    let d = 'M';
    for (let i = 0; i < polygon.length; i++) {
      const x = cx + (polygon[i][0] - cx) * b;
      const y = cy + (polygon[i][1] - cy) * b;
      if (i > 0) d += 'L';
      d += x.toFixed(1) + ',' + y.toFixed(1);
    }
    return d + 'Z';
  }

  /**
   * Catmull-Rom spline through 4 control values. Tension 0.5 (uniform).
   * @param {number} p0
   * @param {number} p1
   * @param {number} p2
   * @param {number} p3
   * @param {number} t
   */
  function catmullRom(p0, p1, p2, p3, t) {
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      0.5 *
      (2 * p1 +
        (-p0 + p2) * t +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
        (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
    );
  }

  /**
   * Index a sites snapshot by _i for fast lookup. Falls back to identity
   * indexing if _i is missing.
   * @param {Array<{x:number,y:number,weight:number,_i:number}>} s
   */
  function indexSites(s) {
    /** @type {Record<number, {x:number,y:number,weight:number,_i:number}>} */
    const m = {};
    for (const v of s) m[v._i] = v;
    return m;
  }

  /**
   * Smooth site interpolation across an array of snapshots using
   * Catmull-Rom — gives C1 continuity (continuous velocity) at every
   * snapshot boundary, so motion never "stutters" at stage transitions.
   *
   * @param {Array<Array<{x:number,y:number,weight:number,_i:number}>>} snaps
   * @param {number} u  global progress in [0, snaps.length - 1]
   */
  function sampleSitesCR(snaps, u) {
    if (!snaps.length) return [];
    if (snaps.length === 1) return snaps[0];

    const n = snaps.length;
    const clamped = Math.max(0, Math.min(u, n - 1));
    const i1 = Math.floor(clamped);
    const t = clamped - i1;

    const i0 = Math.max(0, i1 - 1);
    const i2 = Math.min(n - 1, i1 + 1);
    const i3 = Math.min(n - 1, i1 + 2);

    const s0 = indexSites(snaps[i0]);
    const s1 = snaps[i1];
    const s2 = indexSites(snaps[i2]);
    const s3 = indexSites(snaps[i3]);

    /** @type {Array<{x:number,y:number,weight:number,_i:number}>} */
    const out = new Array(s1.length);
    for (let k = 0; k < s1.length; k++) {
      const ref = s1[k];
      const a = s0[ref._i] || ref;
      const b = ref;
      const c = s2[ref._i] || ref;
      const d = s3[ref._i] || ref;
      out[k] = {
        _i: ref._i,
        x: catmullRom(a.x, b.x, c.x, d.x, t),
        y: catmullRom(a.y, b.y, c.y, d.y, t),
        weight: catmullRom(a.weight, b.weight, c.weight, d.weight, t),
      };
    }
    return out;
  }

  // ==========================================================
  // STATE
  // ==========================================================

  /** @type {ReturnType<typeof buildCells>} */
  let cells = $state([]);

  /** Per-cell birth scale 0..1 keyed by cell name. */
  let birth = $state(/** @type {Record<string, number>} */ ({}));

  /** Per-cell *final* polygon patch, computed once from the converged
   *  voronoi snapshot. Stays fixed across the entire morph timeline so
   *  the image bed never reflows. Keyed by cell.name. */
  let finalPatch = $state(
    /** @type {Record<string, {x:number, y:number, w:number, h:number}>} */ ({})
  );

  let debouncedW = $state(0);
  let debouncedH = $state(0);

  $effect(() => {
    const W = w;
    const H = h;
    if (!W || !H) return;
    const id = setTimeout(() => {
      debouncedW = W;
      debouncedH = H;
    }, RESIZE_DEBOUNCE_MS);
    return () => clearTimeout(id);
  });

  // Defer the animation until the chart scrolls into view.
  $effect(() => {
    if (!wrapEl || typeof IntersectionObserver === 'undefined') {
      inView = true; // graceful fallback (SSR / older browsers)
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            inView = true;
            io.disconnect(); // play once
            return;
          }
        }
      },
      { threshold: 0.15 }
    );
    io.observe(wrapEl);
    return () => io.disconnect();
  });

  /** easeInOutCubic */
  function ease(/** @type {number} */ t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // ==========================================================
  // ANIMATION — interpolate sites, rebuild weighted Voronoi each frame
  // ==========================================================

  $effect(() => {
    // Wait until visible — avoids burning CPU on offscreen charts and
    // ensures the entrance animation plays exactly when the user sees it.
    if (!inView || !debouncedW || !debouncedH || !counts.length) {
      cells = [];
      return;
    }

    const W = debouncedW;
    const H = debouncedH;
    const data = counts;
    const tv = data.reduce((s, d) => s + (d.value || 0), 0) || 1;

    // 1. Capture all snapshots up front.
    const snaps = buildSnapshots(data, W, H);
    if (!snaps.length) return;

    // 1b. Compute the *converged* cells once. Their polygon patches are
    //     used as the image-bed rectangles for every frame — keeping
    //     the collage layout perfectly still as cells morph above it.
    const finalCellsLayout = buildCells(
      data,
      snaps[snaps.length - 1],
      W,
      H,
      tv
    );
    /** @type {Record<string, {x:number, y:number, w:number, h:number}>} */
    const nextPatch = {};
    for (const c of finalCellsLayout) {
      nextPatch[c.name] = polyPatch(c.polygon, W, H);
    }
    finalPatch = nextPatch;

    // 1a. Initialise the first frame *synchronously* with birth=0 so the
    //     cells visibly start as circles before the first RAF callback.
    {
      const initSites = sampleSitesCR(snaps, 0);
      const initCells = buildCells(data, initSites, W, H, tv);
      /** @type {Record<string, number>} */
      const initBirth = {};
      for (const c of initCells) initBirth[c.name] = 0;
      cells = initCells;
      birth = initBirth;
    }

    // 2. RAF loop: spline-interpolate sites across snapshots, rebuild Voronoi.
    const morphMs = STAGE_MS * Math.max(snaps.length - 1, 1);
    const t0 = performance.now();
    let raf = 0;
    let running = true;

    function tick(/** @type {number} */ now) {
      if (!running) return;
      const elapsed = now - t0;

      // ONE global easing across the whole morph timeline, combined with
      // Catmull-Rom site interpolation → smooth (C1) motion throughout.
      const tNorm = Math.min(1, elapsed / morphMs);
      const u = ease(tNorm) * (snaps.length - 1);

      const sites = sampleSitesCR(snaps, u);
      const newCells = buildCells(data, sites, W, H, tv);

      // Per-cell "birth" scale from centroid during the first BIRTH_FRAC
      // of the morph. Bigger cells finish their birth a touch sooner so
      // they anchor the layout while small ones pop into place.
      /** @type {Record<string, number>} */
      const nextBirth = {};
      if (BIRTH_MS > 0 && elapsed < BIRTH_MS) {
        const totalArea = newCells.reduce((s, c) => s + c.area, 0) || 1;
        for (const c of newCells) {
          const sizeBoost = Math.min(0.5, (c.area / totalArea) * 2);
          const localT = (elapsed / BIRTH_MS) * (0.7 + sizeBoost);
          nextBirth[c.name] = localT <= 0 ? 0 : localT >= 1 ? 1 : ease(localT);
        }
      } else {
        for (const c of newCells) nextBirth[c.name] = 1;
      }

      cells = newCells;
      birth = nextBirth;

      if (elapsed < morphMs) {
        raf = requestAnimationFrame(tick);
      } else {
        // Final frame — guarantee converged state.
        const finalCells = buildCells(data, snaps[snaps.length - 1], W, H, tv);
        /** @type {Record<string, number>} */
        const finalBirth = {};
        for (const c of finalCells) finalBirth[c.name] = 1;
        cells = finalCells;
        birth = finalBirth;
      }
    }

    raf = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  });

  // ==========================================================
  // LABEL SIZING
  // ==========================================================

  /** @param {number} area */
  function labelSize(area) {
    if (area < LABEL_MIN_AREA) return 0;
    const s = Math.sqrt(area) * 0.18;
    return Math.max(LABEL_MIN_FS, Math.min(LABEL_MAX_FS, s));
  }
</script>

<div
  class="voronoi-wrap"
  bind:this={wrapEl}
  bind:clientWidth={w}
  bind:clientHeight={h}
>
  {#if debouncedW && debouncedH}
    <svg
      viewBox="0 0 {debouncedW} {debouncedH}"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <!-- Single shared radial vignette: every cell uses the same
             `--purple` tint, so 15 duplicated gradients were collapsed
             into one. `objectBoundingBox` units mean the percentages
             refer to each cell's own bbox.
             • End circle (cx/cy/r) defines where the gradient hits 100%
             • Focal point (fx/fy) is where 0% starts — top-left here,
               giving a soft diagonal "spotlight" effect. -->
        <radialGradient
          id="cellvig"
          cx="50%"
          cy="50%"
          r="75%"
          fx="50%"
          fy="50%"
        >
          <stop offset="50%" class="vig-stop" stop-opacity={VIGNETTE_INNER}
          ></stop>
          <stop
            offset="85%"
            class="vig-stop"
            stop-opacity={VIGNETTE_OUTER * 0.45}
          ></stop>
          <stop offset="100%" class="vig-stop" stop-opacity={VIGNETTE_OUTER}
          ></stop>
        </radialGradient>
      </defs>

      <!-- Per-cell clip paths. The clip uses the cell's *morphed* shape
           (circle at b=0 → polygon at b=1) so the collage underneath
           stays perfectly still — only the porthole opening grows. -->
      {#if getThumbs}
        <defs>
          {#each cells as cell (cell.name + '-clip')}
            {@const b = birth[cell.name] ?? 0}
            <clipPath id="cellclip-{slugId(cell.name)}">
              <path d={cellPath(cell, b)}></path>
            </clipPath>
          {/each}
        </defs>
      {/if}

      <!-- One static collage per cell. The image bed is only rendered
           inside the cell's bounding box (padded by COLLAGE_MARGIN) —
           tiles stay small and we don't render across the whole canvas.
           The clip-path on top still confines what's actually visible. -->
      <g class="collages">
        {#each cells as cell (cell.name + '-bg')}
          {@const thumbs = getThumbs ? getThumbs(cell.name) : []}
          {@const patch = finalPatch[cell.name]}
          {#if thumbs.length && patch}
            <g clip-path="url(#cellclip-{slugId(cell.name)})">
              <CollageBackground
                x={patch.x}
                y={patch.y}
                width={patch.w}
                height={patch.h}
                {thumbs}
                seed={'bed:' + cell.name}
              />
            </g>
          {/if}
        {/each}
      </g>

      <g class="cells">
        {#each cells as cell (cell.name)}
          {@const b = birth[cell.name] ?? 0}
          {@const hasCollage = getThumbs
            ? getThumbs(cell.name).length > 0
            : false}
          <path
            class="voronoi-cell"
            class:selected={cell.name === selected}
            class:tinted={hasCollage}
            d={cellPath(cell, b)}
            fill={hasCollage ? 'url(#cellvig)' : cell.color}
            role="button"
            tabindex="0"
            aria-label={`${cell.name}: ${cell.value} (${cell.pct}%)`}
            onclick={() => onselect?.(cell.name)}
            onkeydown={(e) => e.key === 'Enter' && onselect?.(cell.name)}
          >
            <title>{cell.name} — {cell.value} ({cell.pct}%)</title>
          </path>
        {/each}
      </g>

      <g class="labels" pointer-events="none">
        {#each cells as cell (cell.name + '-l')}
          {@const fs = labelSize(cell.area)}
          {@const b = birth[cell.name] ?? 1}
          {#if fs > 0 && b >= 1}
            <text
              class="cell-label"
              x={cell.cx}
              y={fs >= 13 ? cell.cy - fs * 0.45 : cell.cy}
              font-size={fs}
            >
              {cell.name}
            </text>
            {#if fs >= 13}
              <text
                class="cell-pct"
                x={cell.cx}
                y={cell.cy + fs * 0.75}
                font-size={fs * 0.78}
              >
                {cell.pct}%
              </text>
            {/if}
          {/if}
        {/each}
      </g>
    </svg>
  {/if}
</div>

<style lang="scss">
  .voronoi-wrap {
    width: 100%;
    // Fill viewport height minus an allowance for surrounding chrome.
    height: calc(0.8 * 100lvh);
    flex: 1 1 auto;
    min-height: 320px;
    overflow: hidden;
    position: relative;
    contain: layout paint;
    background-color: var(--purple-soft);

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  // SVG `stop-color` attributes do not evaluate CSS variables, so we
  // set the color via a CSS rule on the stops instead. This way the
  // vignette inherits `--purple` from the theme automatically.
  :global(.vig-stop) {
    stop-color: var(--purple-soft);
  }

  .voronoi-cell {
    cursor: pointer;
    outline: none;
    transition:
      filter 0.15s ease,
      fill-opacity 0.3s ease;
    shape-rendering: geometricPrecision;
    // Hairline same-color stroke fills the sub-pixel gaps between
    // adjacent cells that otherwise appear due to anti-aliasing.
    stroke: var(--purple-soft);
    stroke-width: 3;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;

    &:hover,
    &:focus-visible {
      filter: brightness(1.18);
    }

    &.selected {
      stroke: #fff;
      stroke-width: 3;
      stroke-dasharray: 6 3;
    }
  }

  // Make the path stroke inherit the fill color so anti-alias gaps disappear.
  .cells :global(path.voronoi-cell) {
    color: transparent;
    fill: transparent;
  }

  .cells :global(path.voronoi-cell:not(.selected)) {
    stroke: var(#fff, inherit);
  }

  .cell-label,
  .cell-pct {
    text-anchor: middle;
    dominant-baseline: middle;
    font-family: inherit;
    paint-order: stroke;
    stroke: rgba(0, 0, 0, 0.4);
    stroke-width: 2;
    stroke-linejoin: round;
  }

  .cell-label {
    fill: #fff;
    font-weight: 600;
  }

  .cell-pct {
    fill: rgba(255, 255, 255, 0.92);
    font-weight: 500;
  }
</style>
