<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import ColumnPicker from './ui/ColumnPicker.svelte';
  import Voronoi from './charts/Voronoi.svelte';
  import InfiniteCanvas from './canvas/InfiniteCanvas.svelte';
  import { thumbUrl } from './data/mediaUrl.js';
  // @ts-ignore
  import {
    getCounts,
    getGroup,
    getAllRows,
  } from './data/dataviz-gallery-counts.js';
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

  let activeDef = $derived(
    groupers.find((/** @type {{ key: string }} */ g) => g.key === active) ||
      groupers[0]
  );

  let counts = $derived(getCounts(active));

  /** @type {string} */
  let selected = $state('');

  /** @type {string | null} */
  let expandedGroup = $state(null);

  /** @type {DOMRect | null} */
  let originRect = $state(null);

  /**
   * Thumbnail URLs for the items in one group, at the smallest
   * generated size — the Voronoi renders one static collage per group
   * where each image occupies only a few dozen pixels.
   *
   * @param {string} name
   * @returns {string[]}
   */
  function thumbsFor(name) {
    if (!name) return [];
    const items = getGroup(active, name)?.items || [];
    return items.map((/** @type {{img_url:string}} */ it) =>
      thumbUrl(it.img_url, 50)
    );
  }

  const total = getAllRows().length;
</script>

<Container width="fluid">
  <section class="gallery-treemap">
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
        getThumbs={thumbsFor}
        onselect={(name, rect) => {
          selected = name;
          expandedGroup = name;
          originRect = rect || null;
        }}
      />
    </div>
    <p class="caption">
      {counts.length}
      {activeDef.label.toLowerCase()} &middot; {total} graphics total
    </p>
  </section>
</Container>

{#if expandedGroup}
  <InfiniteCanvas
    items={getGroup(active, expandedGroup)?.items || []}
    title={expandedGroup}
    {originRect}
    onclose={() => {
      expandedGroup = null;
      originRect = null;
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
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--space-xs);
      margin-bottom: var(--space-xs);
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

    .caption {
      text-align: center;
      font-size: var(--font-size-0);
      color: var(--gray);
      margin-top: var(--space-xs);
      font-style: italic;
      flex-shrink: 0;
    }
  }

</style>
