<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import ColumnPicker from './ui/ColumnPicker.svelte';
  import Treemap from './charts/Treemap.svelte';
  import Voronoi from './charts/Voronoi.svelte';
  import InfiniteCanvas from './canvas/InfiniteCanvas.svelte';
  // eslint-disable-next-line no-unused-vars
  import GalleryList from './ui/GalleryList.svelte';
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

  let selectedItems = $derived(
    selected ? getGroup(active, selected)?.items || [] : []
  );

  /** @type {string | null} */
  let expandedGroup = $state(null);

  /** @type {DOMRect | null} */
  let originRect = $state(null);

  /**
   * Resolve thumbnail URLs for the items in one group. CSV stores
   * `projects/dataviz-gallery/<file>`, but the static assets live at
   * `static/media/projects/dataviz-gallery/thumbs/<file>` — so we
   * prepend `media/` and insert `thumbs/` before the filename.
   *
   * The Voronoi component renders one static collage *per group*,
   * each filling the SVG canvas and clipped by its polygon.
   *
   * @param {string} name
   * @returns {string[]}
   */
  function thumbsFor(name) {
    if (!name) return [];
    const items = getGroup(active, name)?.items || [];
    return items.map((/** @type {{url:string}} */ it) =>
      ('media/' + it.url).replace(
        /^(media\/projects\/dataviz-gallery)\/([^/]+)$/,
        '$1/thumbs/$2'
      )
    );
  }

  const total = getAllRows().length;

  let layout = $state('voronoi');
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
      <!-- <div class="layout-toggle" role="radiogroup">
        <button
          role="radio"
          aria-checked={layout === 'treemap'}
          class:active={layout === 'treemap'}
          onclick={() => (layout = 'treemap')}
        >
          ▦ Treemap
        </button>
        <button
          role="radio"
          aria-checked={layout === 'voronoi'}
          class:active={layout === 'voronoi'}
          onclick={() => (layout = 'voronoi')}
        >
          ⬡ Voronoi
        </button>
      </div> -->
    </div>
    <div class="chart-overlap">
      {#if layout === 'treemap'}
        <Treemap
          {counts}
          {selected}
          onselect={(name) => {
            selected = selected === name ? '' : name;
          }}
        />
      {:else}
        <Voronoi
          {counts}
          {selected}
          getThumbs={thumbsFor}
          onselect={(name, rect) => {
            if (rect && selected === name) {
              expandedGroup = name;
              originRect = rect;
            } else {
              selected = selected === name ? '' : name;
            }
          }}
        />
      {/if}
    </div>
    <p class="caption">
      {counts.length}
      {activeDef.label.toLowerCase()} &middot; {total} graphics total
    </p>
  </section>
  <!--
    Old bottom grid — kept around for reference, replaced by the
    upcoming infinite-canvas overlay (see GalleryList.svelte).

  {#if selectedItems.length}
    <GalleryList title={selected} items={selectedItems} />
  {/if}
  -->
</Container>

{#if expandedGroup && originRect}
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

    .layout-toggle {
      display: flex;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid var(--purple-soft, #41295a);

      button {
        background: transparent;
        border: none;
        padding: 0.35rem 0.75rem;
        cursor: pointer;
        font-size: var(--font-size--1);
        color: var(--purple-soft, #41295a);
        transition: background 0.15s;

        &.active {
          background: var(--purple-soft, #41295a);
          color: white;
        }

        &:not(.active):hover {
          background: color-mix(
            in srgb,
            var(--purple-soft, #41295a) 10%,
            transparent
          );
        }
      }
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

  .gallery-items {
    margin-top: var(--space-lg);
    padding-inline: var(--grid-gutter);
    max-width: var(--lg);
    margin-inline: auto;

    h3 {
      font-size: var(--font-size-2);
      margin-bottom: var(--space-sm);
      text-transform: capitalize;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--space-sm);
    }

    .gallery-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-3xs);
      text-decoration: none;
      border-radius: 6px;
      overflow: hidden;
      background: var(--bg-soft, #f5f5f5);
      transition: transform 0.15s;

      &:hover {
        transform: translateY(-2px);
      }

      img {
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
        display: block;
      }

      .card-label {
        font-size: var(--font-size--1);
        padding: 0 var(--space-2xs) var(--space-2xs);
        color: var(--text, #333);
      }
    }
  }
</style>
