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
      <a class="award-item" href={item.url}>
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
    gap: var(--space-xs);
    max-height: 100%;
    width: 100%;

    // When the parent flips to bottom-row layout, items flow horizontally
    // and wrap. Each item targets the width of 2 of the 12 page-grid
    // columns (6 items per row), with a 300px floor that triggers wrapping
    // on narrower screens.
    :global([data-awards='bottom']) & {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: start;
      max-height: none;
    }
  }

  .award-item {
    max-width: 10rem;
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
      min-width: 100px;
      max-width: none;
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
