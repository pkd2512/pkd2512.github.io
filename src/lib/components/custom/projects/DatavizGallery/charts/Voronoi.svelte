<script>
  import { hierarchy } from 'd3-hierarchy';
  import { voronoiTreemap } from 'd3-voronoi-treemap';
  import { weightedVoronoi } from 'd3-weighted-voronoi';
  import WallPreview from '../canvas/WallPreview.svelte';
  import { frameMetrics, calcMasonryWidth } from '../canvas/infiniteCanvas.js';

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
  /** Width of the purple "leading" between windows, in px. */
  const LEAD = 10;
  /** Tag height, and approximate width per character, at 12px type. */
  const TAG_H = 20;
  const TAG_CHAR_W = 6.6;
  /** Voronoi treemap tuning. */
  const MIN_WEIGHT_RATIO = 0.001;

  // ==========================================================

  /**
   * @type {{
   *   counts: Array<{name: string, value: number}>,
   *   palette?: string[],
   *   selected?: string,
   *   onselect?: (name: string, rect?: DOMRect, reveal?: {polygon: [number, number][], x: number, y: number, scale: number, anchor: [number, number]}) => void,
   *   getItems?: (name: string) => Array<{img_url: string, aspect: number}>
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
    getItems,
  } = $props();

  /** Scale each topic's wall is shown at through its window. */
  const WALL_SCALE = 0.25;

  /**
   * Place a span of `size` near `start` inside [0, span]: kept fully inside
   * when it fits, otherwise made to cover the whole span — so a window never
   * shows empty backdrop the wall could have filled.
   * @param {number} start
   * @param {number} size
   * @param {number} span
   */
  function fitSpan(start, size, span) {
    return size <= span
      ? Math.min(Math.max(start, 0), span - size)
      : Math.min(Math.max(start, span - size), 0);
  }

  /**
   * CSS clip-path for a cell, grown from its centroid by `b` in [0, 1] —
   * the HTML twin of `cellPath`.
   * @param {{polygon:[number,number][], cx:number, cy:number}} cell
   * @param {number} b
   */
  function cellClip(cell, b) {
    const { polygon, cx, cy } = cell;
    return (
      'polygon(' +
      polygon
        .map(
          ([x, y]) =>
            `${(cx + (x - cx) * b).toFixed(1)}px ${(cy + (y - cy) * b).toFixed(1)}px`
        )
        .join(', ') +
      ')'
    );
  }

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

  /** True once the morph has converged — tags only appear then. */
  let settled = $state(false);

  /** Per-cell birth scale 0..1 keyed by cell name. */
  let birth = $state(/** @type {Record<string, number>} */ ({}));

  /** Each cell's *converged* centroid. Walls are anchored here so they stay
   *  still while the cells morph over them. Keyed by cell.name. */
  let finalCentre = $state(
    /** @type {Record<string, {x:number, y:number}>} */ ({})
  );

  /** Unscaled masonry height of each wall, reported by WallPreview. */
  let wallH = $state(/** @type {Record<string, number>} */ ({}));

  /** Same tile geometry the gallery overlay will use. */
  let metrics = $state(frameMetrics(1200));

  /**
   * Top-left of a group's cards in wrap coordinates: centred on its cell,
   * then kept inside the chart (or covering it, if larger).
   * @param {string} name
   * @param {number} count
   */
  function wallOrigin(name, count) {
    const c = finalCentre[name];
    if (!c) return { x: 0, y: 0 };
    const { frameW, gap } = metrics;
    const cw = (calcMasonryWidth(count, frameW, gap) - gap) * WALL_SCALE;
    const ch = Math.max(0, (wallH[name] || 0) - gap) * WALL_SCALE;
    return {
      x: fitSpan(c.x - cw / 2, cw, debouncedW),
      y: fitSpan(c.y - ch / 2, ch, debouncedH),
    };
  }

  /**
   * Everything the gallery needs to open exactly where this window is:
   * the cell outline and the wall's transform, in viewport coordinates,
   * plus the point to zoom in from (the click, else the cell's centre).
   * @param {{name: string, polygon: [number, number][], cx: number, cy: number}} cell
   * @param {MouseEvent | KeyboardEvent} e
   */
  function revealFor(cell, e) {
    if (!wrapEl || !getItems) return undefined;
    const r = wrapEl.getBoundingClientRect();
    const o = wallOrigin(cell.name, getItems(cell.name).length);
    const clicked = 'clientX' in e && (e.clientX || e.clientY);
    return {
      polygon: cell.polygon.map(
        ([x, y]) => /** @type {[number, number]} */ ([x + r.left, y + r.top])
      ),
      x: o.x + r.left,
      y: o.y + r.top,
      scale: WALL_SCALE,
      anchor: /** @type {[number, number]} */ (
        clicked
          ? [
              /** @type {MouseEvent} */ (e).clientX,
              /** @type {MouseEvent} */ (e).clientY,
            ]
          : [cell.cx + r.left, cell.cy + r.top]
      ),
    };
  }

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
    settled = false;
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

    // 1b. Compute the *converged* cells once. Walls anchor on their
    //     centroids so they stay still as the cells morph above them.
    const finalCellsLayout = buildCells(
      data,
      snaps[snaps.length - 1],
      W,
      H,
      tv
    );
    /** @type {Record<string, {x:number, y:number}>} */
    const nextCentre = {};
    for (const c of finalCellsLayout) nextCentre[c.name] = { x: c.cx, y: c.cy };
    finalCentre = nextCentre;
    metrics = frameMetrics(window.innerWidth);

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
        settled = true;
      }
    }

    raf = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  });

  // ==========================================================
  // TAGS — each window's name, pinned to its longest inner edge
  // ==========================================================

  /**
   * One tag per cell, laid along the cell's longest interior edge (not the
   * chart's outer border), just inside the window so it hangs off the
   * leading. Edges are claimed once, so neighbours never share a seam;
   * smallest cells choose first since they have the fewest long edges.
   * Cells with no edge long enough for their tag go unlabelled.
   * @param {Array<{name: string, polygon: [number, number][], cx: number, cy: number, area: number}>} list
   * @param {number} W
   * @param {number} H
   */
  function placeTags(list, W, H) {
    /** @param {[number, number]} q */
    const onFrame = (q) => q[0] < 1 || q[0] > W - 1 || q[1] < 1 || q[1] > H - 1;
    const used = new Set();
    const tags = [];
    for (const c of [...list].sort((a, b) => a.area - b.area)) {
      const w = c.name.length * TAG_CHAR_W + 22;
      const p = c.polygon;
      const edges = [];
      for (let j = 0; j < p.length; j++) {
        const a = p[j];
        const b = p[(j + 1) % p.length];
        if (onFrame(a) && onFrame(b)) continue;
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (len < w + LEAD * 2) continue;
        const key = [a, b]
          .map((q) => q.map(Math.round).join(','))
          .sort()
          .join('|');
        edges.push({ a, b, len, key });
      }
      edges.sort((x, y) => y.len - x.len);
      const e = edges.find((x) => !used.has(x.key));
      if (!e) continue;
      used.add(e.key);
      const [ax, ay] = e.a;
      const ex = e.b[0] - ax;
      const ey = e.b[1] - ay;
      const mx = ax + ex / 2;
      const my = ay + ey / 2;
      // Unit normal pointing into this cell.
      let nx = -ey / e.len;
      let ny = ex / e.len;
      if ((c.cx - mx) * nx + (c.cy - my) * ny < 0) {
        nx = -nx;
        ny = -ny;
      }
      let angle = (Math.atan2(ey, ex) * 180) / Math.PI;
      if (angle > 90) angle -= 180;
      if (angle <= -90) angle += 180;
      // Tag's near edge tucks 1px under the leading, so it reads as hung
      // from it rather than floating in the window.
      const off = LEAD / 2 + TAG_H / 2 - 1;
      tags.push({
        name: c.name,
        x: mx + nx * off,
        y: my + ny * off,
        angle,
        w,
      });
    }
    return tags;
  }

  let tags = $derived(settled ? placeTags(cells, debouncedW, debouncedH) : []);
</script>

<div
  class="voronoi-wrap"
  bind:this={wrapEl}
  bind:clientWidth={w}
  bind:clientHeight={h}
>
  {#if debouncedW && debouncedH}
    <!-- Every topic's wall sits behind the chart; each cell is a window
         onto its own. The gallery opens by growing that window. -->
    {#if getItems}
      <div class="windows" aria-hidden="true">
        {#each cells as cell (cell.name + '-win')}
          {@const items = getItems(cell.name)}
          {@const o = wallOrigin(cell.name, items.length)}
          <div
            class="window"
            style="clip-path: {cellClip(cell, birth[cell.name] ?? 0)}"
          >
            <WallPreview
              {items}
              seed={cell.name}
              frameW={metrics.frameW}
              gap={metrics.gap}
              scale={WALL_SCALE}
              x={o.x}
              y={o.y}
              bind:height={wallH[cell.name]}
            />
          </div>
        {/each}
      </div>
    {/if}
    <svg
      viewBox="0 0 {debouncedW} {debouncedH}"
      preserveAspectRatio="xMidYMid meet"
    >
      <g class="cells" class:settled>
        {#each cells as cell (cell.name)}
          {@const b = birth[cell.name] ?? 0}
          <path
            class="voronoi-cell"
            class:selected={cell.name === selected}
            d={cellPath(cell, b)}
            fill={getItems ? 'transparent' : cell.color}
            role="button"
            tabindex="0"
            aria-label={`${cell.name}: ${cell.value} (${cell.pct}%)`}
            onclick={(e) =>
              onselect?.(
                cell.name,
                e.currentTarget.getBoundingClientRect(),
                revealFor(cell, e)
              )}
            onkeydown={(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return;
              e.preventDefault();
              onselect?.(
                cell.name,
                e.currentTarget.getBoundingClientRect(),
                revealFor(cell, e)
              );
            }}
          >
            <title>{cell.name} — {cell.value} ({cell.pct}%)</title>
          </path>
        {/each}
      </g>

      <g class="tags" pointer-events="none">
        {#each tags as t (t.name)}
          <g transform="translate({t.x} {t.y}) rotate({t.angle})">
            <rect
              class="tag"
              x={-t.w / 2}
              y={-TAG_H / 2}
              width={t.w}
              height={TAG_H}
              rx={TAG_H / 2}
            ></rect>
            <text class="tag-text">{t.name}</text>
          </g>
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
      position: relative; // above the windows
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .windows,
  .window {
    position: absolute;
    inset: 0;
  }

  .window {
    overflow: hidden;
    // Same ground as the gallery overlay, so the reveal has no seam.
    background-color: var(--white-soft);
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
    // The leading between windows: header purple, wide enough to read as
    // the sheet the windows are cut from.
    stroke: var(--purple-soft);
    stroke-width: 10px; // = LEAD
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;

    &:hover,
    &:focus-visible {
      filter: brightness(1.35);
    }
  }

  // The leading casts a soft shadow onto the windows, so they sit recessed
  // behind the sheet. Applied once the cells settle: a blur filter over the
  // whole chart is too costly to recompute on every frame of the morph.
  .cells {
    transition: filter 0.5s ease;

    &.settled {
      filter: drop-shadow(0 1px 1.5px rgba(0, 0, 0, 0.45))
        drop-shadow(0 3px 8px rgba(0, 0, 0, 0.28));
    }
  }

  // Make the path stroke inherit the fill color so anti-alias gaps disappear.
  .cells :global(path.voronoi-cell) {
    color: transparent;
    fill: transparent;
  }

  .tags {
    animation: tags-in 0.45s ease both;
  }

  .tag {
    fill: var(--purple-soft);
  }

  .tag-text {
    fill: var(--white, #fff);
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-anchor: middle;
    dominant-baseline: central;
  }

  @keyframes tags-in {
    from {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .tags {
      animation: none;
    }
  }
</style>
