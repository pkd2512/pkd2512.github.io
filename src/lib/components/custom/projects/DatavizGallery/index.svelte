<script>
  import { onMount } from 'svelte';
  import Container from '$lib/components/ui/Container/index.svelte';
  import ColumnPicker from './ui/ColumnPicker.svelte';
  import Voronoi from './charts/Voronoi.svelte';
  import InfiniteCanvas from './canvas/InfiniteCanvas.svelte';
  // @ts-ignore
  import { getCounts, getGroup } from './data/dataviz-gallery-counts.js';
  // @ts-ignore
  import csvcols from '$contents/data/dataviz-gallery.csv';

  const allCols = (csvcols.columns || Object.keys(csvcols[0] || {})).filter(
    /** @param {string} c */
    (c) => c && c !== 'id'
  );

  const autoGroupers = allCols.map(
    /** @param {string} c */
    (c) => ({
      key: c,
      label: c
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (/** @type {string} */ l) => l.toUpperCase()),
      multi: c === 'category',
    })
  );

  /**
   * @type {{ groupers?: Array<{key: string, label: string, multi: boolean}> }}
   */
  let { groupers: groupersProp } = $props();

  let groupers = $derived(groupersProp || autoGroupers);

  let active = $state(groupers[0]?.key || '');

  let counts = $derived(getCounts(active));

  /** @type {string} */
  let selected = $state('');

  /** @type {string | null} */
  let expandedGroup = $state(null);

  /** @type {DOMRect | null} */
  let originRect = $state(null);

  /** @type {{polygon: [number, number][], x: number, y: number, scale: number, anchor: [number, number]} | null} */
  let reveal = $state(null);

  /** The chart section; the gallery zooms it toward the clicked cell. */
  /** @type {HTMLElement | undefined} */
  let sectionEl = $state();

  // The gallery's opening animation runs on gsap; fetch it now so the first
  // click doesn't wait on the download.
  onMount(() => {
    import('gsap');
    import('gsap/Draggable');
    import('gsap/InertiaPlugin');
  });

  /** @param {string} name */
  function itemsFor(name) {
    return getGroup(active, name)?.items || [];
  }
</script>

<Container width="fluid">
  <section class="gallery-treemap" bind:this={sectionEl}>
    <div class="toolbar">
      <ColumnPicker
        {groupers}
        {active}
        onchange={(k) => {
          active = k;
          selected = '';
        }}
      />
    </div>
    <div class="chart-overlap">
      <Voronoi
        {counts}
        {selected}
        getItems={itemsFor}
        onselect={(name, rect, from) => {
          selected = name;
          expandedGroup = name;
          originRect = rect || null;
          reveal = from || null;
        }}
      />
    </div>
  </section>
</Container>

{#if expandedGroup}
  <InfiniteCanvas
    items={itemsFor(expandedGroup)}
    title={expandedGroup}
    {originRect}
    {reveal}
    portalEl={sectionEl}
    onclose={() => {
      expandedGroup = null;
      originRect = null;
      reveal = null;
    }}
  />
{/if}

<style lang="scss">
  .gallery-treemap {
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 10rem);
    position: relative;
    // Lift the whole gallery up so the chart extends *behind* the hero;
    // toolbar gets its own higher z-index below so it sits ON the hero.
    margin-top: clamp(-12rem, -10vw, -4rem);
    z-index: 5; // above the hero's stacking context

    .toolbar {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: var(--space-xs);
      // Half the Voronoi leading (10px): the active tab covers the top seam
      // and joins the window beneath it.
      margin-bottom: -5px;
      flex-shrink: 0;
      // Force the toolbar to paint above everything, including the hero
      // it now visually overlaps.
      position: relative;
      z-index: 10;
    }

    // Wrapper around the chart only — keeps it growing/flexing as before.
    .chart-overlap {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
    }
  }
</style>
