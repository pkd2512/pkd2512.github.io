<script>
  import { stratify, treemap } from 'd3-hierarchy';

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
      '#41295a', '#2f0743', '#6b3fa0', '#8b5cf6',
      '#a78bfa', '#7c3aed', '#6d28d9', '#5b21b6',
      '#4c1d95', '#3b0764', '#9333ea', '#c084fc',
      '#e9d5ff', '#d8b4fe', '#c4b5fd',
    ],
    selected = '',
    onselect,
  } = $props();

  /** @type {number} */
  let w = $state(800);
  /** @type {number} */
  let h = $state(600);

  let tabular = $derived.by(() => {
    const totalVal = counts.reduce((s, d) => s + d.value, 0) || 1;
    return [
      { id: 'root', parentId: '', value: 0 },
      ...counts.map((d) => ({
        id: d.name,
        parentId: 'root',
        value: Math.sqrt(d.value / totalVal) * totalVal,
      })),
    ];
  });

  /**
   * @param {Array<{id: string, parentId: string, value: number}>} data
   * @returns {any}
   */
  function buildTree(data) {
    // @ts-ignore
    return stratify().id((d) => d.id).parentId((d) => d.parentId)(data).sum((d) => d.value);
  }

  let totalVal = $derived(counts.reduce((s, d) => s + d.value, 0));

  /** @type {Array<{name: string, value: number, pct: string, left: number, top: number, pwidth: number, pheight: number, color: string}>} */
  let cells = $derived.by(() => {
    if (!w || !h) return [];
    const root = buildTree(tabular);
    // @ts-ignore
    treemap().size([w, h]).padding(6).round(true)(root);
    return root.leaves().map((/** @type {any} */ leaf, /** @type {number} */ i) => ({
      name: leaf.data.id,
      value: leaf.value,
      pct: ((counts.find((c) => c.name === leaf.data.id)?.value || 0) / totalVal * 100).toFixed(1),
      left: (leaf.x0 / w) * 100,
      top: (leaf.y0 / h) * 100,
      pwidth: ((leaf.x1 - leaf.x0) / w) * 100,
      pheight: ((leaf.y1 - leaf.y0) / h) * 100,
      color: palette[i % palette.length],
    }));
  });
</script>

<div
  class="treemap-wrap"
  bind:clientWidth={w}
  bind:clientHeight={h}
  role="group"
>
  {#each cells as cell}
    <div
      class="treemap-cell"
      class:selected={cell.name === selected}
      style="left: {cell.left}%; top: {cell.top}%; width: {cell.pwidth}%; height: {cell.pheight}%; background: {cell.color}"
      role="button"
      tabindex="0"
      onclick={() => onselect?.(cell.name)}
      onkeydown={(e) => e.key === 'Enter' && onselect?.(cell.name)}
    >
      <span class="cell-label">{cell.name}</span>
      <span class="cell-value">{cell.pct}%</span>
    </div>
  {/each}
</div>

<style lang="scss">
  .treemap-wrap {
    position: relative;
    width: 100%;
    flex: 1;
    min-height: 0;
    border-radius: 8px;
    overflow: hidden;
  }

  .treemap-cell {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    outline: none;
    border-radius: 6px;
    transition: filter 0.15s;

    &:hover {
      filter: brightness(1.15);
    }

    &.selected {
      box-shadow: inset 0 0 0 3px white;
      z-index: 1;
    }
  }

  .cell-label {
    color: white;
    font-size: clamp(11px, 1.2vw, 16px);
    font-weight: 600;
    text-align: center;
    line-height: 1.2;
    word-break: break-word;
  }

  .cell-value {
    color: rgba(255, 255, 255, 0.85);
    font-size: clamp(10px, 1vw, 14px);
    margin-top: 2px;
  }
</style>
