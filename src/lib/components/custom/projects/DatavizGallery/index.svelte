<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import ColumnPicker from './ColumnPicker.svelte';
  import Treemap from './Treemap.svelte';
  // @ts-ignore
  import { getCounts, getGroup, getAllRows } from './dataviz-gallery-counts.js';
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

  const total = getAllRows().length;
</script>

<Container width="lg">
  <section class="gallery-treemap">
    <ColumnPicker
      {groupers}
      {active}
      onchange={(k) => {
        active = k;
        selected = '';
      }}
    />
    <Treemap
      {counts}
      {selected}
      onselect={(name) => {
        selected = selected === name ? '' : name;
      }}
    />
    <p class="caption">
      {counts.length}
      {activeDef.label.toLowerCase()} &middot; {total} graphics total
    </p>
  </section>
  {#if selectedItems.length}
    <div class="gallery-items">
      <h3>{selected}</h3>
      <div class="gallery-grid">
        {#each selectedItems as item}
          <a href="/{item.url}" class="gallery-card">
            <img src="/{item.url}" alt={item.alt} loading="lazy" />
            <span class="card-label">{item.title}</span>
          </a>
        {/each}
      </div>
    </div>
  {/if}
</Container>

<style lang="scss">
  .gallery-treemap {
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 10rem);

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
