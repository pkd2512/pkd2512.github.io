<script>
  import AwardBadge from '$lib/components/custom/projects/AwardBadge/index.svelte';

  /**
   * @type {{ awards?: { type: string; logo?: string; url?: string; label?: string }[] }}
   */
  let { awards = [] } = $props();
</script>

{#if awards.length > 0}
  <div class="strip">
    {#each awards as item}
      <a class="award-item" href={item.url} title={item.type}>
        <AwardBadge
          type={item.type}
          logo={item.logo}
          url={item.url}
          label={item.label}
          inverted
        />
        {#if item.label}
          <span class="label">{@html item.label}</span>
        {/if}
      </a>
    {/each}
  </div>
{/if}

<style lang="scss">
  .strip {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    // gap: var(--space-xs);
    max-height: 100%;
    width: 100%;

    // 1-column side rail: start at the top so it lines up with the title.
    :global([data-awards='side']) & {
      justify-content: flex-start;
    }

    // 2-column side rail: absolutely positioned anchored to the LEFT edge
    // of the .awards column so the second wrapped column overflows to the
    // RIGHT into the empty bleed area (never overlapping the header text
    // on the left).
    :global([data-awards='side-2']) & {
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      flex-direction: column;
      flex-wrap: wrap;
      align-content: flex-start;
      // Width = 2 page-grid columns + 1 gutter between them.
      width: calc(
        (var(--grid-max-width) - 11 * var(--grid-gutter)) / 12 * 2 +
          var(--grid-gutter)
      );
      // gap: var(--grid-gutter);
    }

    // When the parent flips to bottom-row layout, items flow horizontally
    // and wrap. Each item targets the width of 2 of the 12 page-grid
    // columns (6 items per row), with a 300px floor that triggers wrapping
    // on narrower screens.
    :global([data-awards='bottom']) & {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      max-height: none;

      @media (--md-n-below) {
        column-gap: var(--space-2xs);
      }
    }
  }

  .award-item {
    max-width: 10rem;
    // Width = 2 page-grid columns + 1 gutter between them.
    width: calc(
      (var(--grid-max-width) - 11 * var(--grid-gutter)) / 12 * 2 +
        var(--grid-gutter)
    );
    text-wrap: balance;
    text-decoration: none;
    break-inside: avoid;
    padding: var(--space-xs) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3xs);
    background-color: var(--purple-soft);
    -webkit-mask: var(--mask-edge-scalloped);

    // In the bottom layout, each item is sized to span ~2 of the 12 grid
    // columns (i.e. 6 per row), with min-width: 300px so they wrap nicely.
    :global([data-awards='bottom']) & {
      flex: 0 1 calc((100% - 5 * var(--grid-gutter)) / 6);
      min-width: 130px;
      max-width: none;

      // On phones let each tile share its row, so a pair spreads across the
      // full column. Capped at half a row (less the column gap) so a lone
      // award on the last row stays the same width and sits centred.
      @media (--md-n-below) {
        flex: 1 1 130px;
        max-width: calc((100% - var(--space-2xs)) / 2);
      }
    }
  }

  .label {
    font-size: var(--font-size--2);
    font-weight: var(--font-weight-medium);
    font-family: var(--font-sans);
    color: var(--white-soft);
    text-align: center;
    width: auto;
    line-height: var(--line-height-tight);
  }
</style>
