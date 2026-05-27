<script>
  import { Delaunay } from 'd3-delaunay';
  import { stratify, pack } from 'd3-hierarchy';

  /**
   * @type {{
   *   counts: Array<{name: string, value: number}>,
   *   palette?: string[],
   *   selected?: string,
   *   onselect?: (name: string) => void
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
  } = $props();

  /** @type {number} */
  let w = $state(800);
  /** @type {number} */
  let h = $state(600);

  let totalVal = $derived(counts.reduce((s, d) => s + d.value, 0));

  /**
   * @param {Array<[number, number]>} poly
   * @returns {number}
   */
  function polygonArea(poly) {
    let area = 0;
    const n = poly.length;
    for (let i = 0; i < n; i++) {
      const [x1, y1] = poly[i];
      const [x2, y2] = poly[(i + 1) % n];
      area += x1 * y2 - x2 * y1;
    }
    return Math.abs(area) / 2;
  }

  /**
   * @param {Array<[number, number]>} poly
   * @returns {[number, number]}
   */
  function centroid(poly) {
    let cx = 0,
      cy = 0;
    for (const [x, y] of poly) {
      cx += x;
      cy += y;
    }
    return [cx / poly.length, cy / poly.length];
  }

  /**
   * @param {Array<any>} seeds
   * @param {number[]} values
   * @param {number} totalVal
   * @param {number} w
   * @param {number} h
   * @param {number} iter
   * @returns {Array<any>}
   */
  function relax(seeds, values, totalVal, w, h, iter) {
    const delaunay = Delaunay.from(seeds);
    const voronoi = delaunay.voronoi([0, 0, w, h]);
    const newSeeds = [];
    for (let i = 0; i < seeds.length; i++) {
      const poly = voronoi.cellPolygon(i);
      if (!poly || poly.length < 3) {
        newSeeds.push(seeds[i]);
        continue;
      }
      const actualArea = polygonArea(poly);
      const target = (values[i] / totalVal) * (w * h);
      const ratio = target > 0 ? actualArea / target : 1;
      const [cx, cy] = centroid(poly);
      const step = iter < 20 ? 0.3 : 0.1;
      const move = 1 - step * (ratio - 1);
      let nx = cx + (seeds[i][0] - cx) / Math.max(move, 0.1);
      let ny = cy + (seeds[i][1] - cy) / Math.max(move, 0.1);
      const margin = 10;
      nx = Math.max(margin, Math.min(w - margin, nx));
      ny = Math.max(margin, Math.min(h - margin, ny));
      newSeeds.push([nx, ny]);
    }
    return newSeeds;
  }

  /**
   * @param {Array<[number, number]>} seeds
   * @param {string[]} names
   * @param {number[]} values
   * @param {number} totalVal
   * @param {number} w
   * @param {number} h
   * @returns {Array<any>}
   */
  function computeVoronoi(seeds, names, values, totalVal, w, h) {
    const delaunay = Delaunay.from(seeds);
    const voronoi = delaunay.voronoi([0, 0, w, h]);
    return names
      .map((/** @type {string} */ name, /** @type {number} */ i) => {
        const poly = voronoi.cellPolygon(i);
        if (!poly) return null;
        const d =
          'M' + poly.map((/** @type {any} */ p) => p.join(',')).join('L') + 'Z';
        const [cx, cy] = centroid(poly);
        return {
          name,
          value: values[i],
          pct: (((values[i] || 0) / totalVal) * 100).toFixed(1),
          d,
          cx,
          cy,
          color: palette[i % palette.length],
        };
      })
      .filter(Boolean);
  }

  /** @type {Array<any>} */
  let cells = $state([]);

  // Seed history + animation
  /** @type {Array<Array<any>>} */
  let seedSets = $state([]);

  $effect(() => {
    if (!w || !h || !counts.length) {
      seedSets = [];
      cells = [];
      return;
    }

    const names = counts.map((d) => d.name);
    const values = counts.map((d) => d.value);

    const tv = values.reduce((s, d) => s + d, 0) || 1;
    const tabular = [
      { id: 'root', parentId: '', value: 0 },
      ...counts.map((d, i) => ({
        id: d.name,
        parentId: 'root',
        value: Math.sqrt(values[i] / tv) * tv,
      })),
    ];
    const root =
      // @ts-ignore
      stratify()
        .id((d) => d.id)
        .parentId((d) => d.parentId)(tabular)
        .sum((d) => d.value);
    // @ts-ignore
    pack().size([w, h]).padding(6)(root);
    let seeds = /** @type {any} */ (root)
      .leaves()
      .map((/** @type {any} */ d) => [d.x, d.y]);

    const sets = [seeds.map((/** @type {any} */ s) => [...s])];
    for (let iter = 0; iter < 50; iter++) {
      seeds = relax(seeds, values, totalVal, w, h, iter);
      sets.push(seeds.map((/** @type {any} */ s) => [...s]));
    }
    seedSets = sets;
  });

  // RAF-based smooth interpolation
  $effect(() => {
    const n = seedSets.length;
    if (n < 2) return;

    let start = performance.now();
    const durPerStep = 1000;
    let iter = 0;
    let raf = 0;

    function frame(/** @type {number} */ now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / durPerStep, 1);

      // Interpolate seeds between seedSets[iter] and seedSets[iter + 1]
      const a = seedSets[iter];
      const b = seedSets[Math.min(iter + 1, n - 1)];
      const interp = a.map(
        (/** @type {[number, number]} */ s, /** @type {number} */ i) => {
          const bi = b[i] || s;
          return [s[0] + (bi[0] - s[0]) * t, s[1] + (bi[1] - s[1]) * t];
        }
      );

      cells = computeVoronoi(
        /** @type {Array<[number, number]>} */ (interp),
        counts.map((d) => d.name),
        counts.map((d) => d.value),
        totalVal,
        w,
        h
      );

      if (t >= 1) {
        if (iter < n - 2) {
          iter++;
          start = performance.now();
          raf = requestAnimationFrame(frame);
        }
      } else {
        raf = requestAnimationFrame(frame);
      }
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  });
</script>

<div class="voronoi-wrap" bind:clientWidth={w} bind:clientHeight={h}>
  <svg viewBox="0 0 {w} {h}">
    {#each cells as cell}
      <path
        class="voronoi-cell"
        class:selected={cell.name === selected}
        d={cell.d}
        fill={cell.color}
        role="button"
        tabindex="0"
        onclick={() => onselect?.(cell.name)}
        onkeydown={(e) => e.key === 'Enter' && onselect?.(cell.name)}
      >
        <title>{cell.name} — {cell.value}</title>
      </path>
      <text
        x={cell.cx}
        y={cell.cy}
        text-anchor="middle"
        dominant-baseline="middle"
        fill="white"
        font-size="14"
        font-weight="600"
        pointer-events="none"
      >
        {cell.name}
      </text>
      <text
        x={cell.cx}
        y={cell.cy + 18}
        text-anchor="middle"
        dominant-baseline="middle"
        fill="rgba(255,255,255,0.85)"
        font-size="12"
        pointer-events="none"
      >
        {cell.pct}%
      </text>
    {/each}
  </svg>
</div>

<style lang="scss">
  .voronoi-wrap {
    width: 100%;
    flex: 1;
    min-height: 0;
    border-radius: 8px;
    overflow: hidden;

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .voronoi-cell {
    cursor: pointer;
    outline: none;
    transition: filter 0.15s;

    &:hover {
      filter: brightness(1.15);
    }

    &.selected {
      stroke: white;
      stroke-width: 3;
      stroke-dasharray: 6 3;
    }
  }
</style>
