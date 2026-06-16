<script>
  import AwardBadge from '$lib/components/custom/projects/AwardBadge/index.svelte';

  /**
   * @type {{ awards?: { type: string; logo?: string; url?: string; label?: string }[] }}
   */
  let { awards = [] } = $props();

  let items = $derived(
    awards.flatMap((a) => {
      const labels = (a.label || '')
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean);
      return labels.length > 0 ? labels.map((label) => ({ ...a, label })) : [a];
    })
  );
</script>

{#if items.length > 0}
  <div class="strip">
    {#each items as item}
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
    column-width: 16ch;
    column-gap: var(--grid-gutter);
    max-height: 100%;
  }

  .award-item {
    max-width: 10rem;
    text-decoration: none;
    break-inside: avoid;
    padding: var(--space-xs) var(--space-s);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3xs);
    margin-bottom: var(--space-xs);
    background-color: var(--purple-soft);
    -webkit-mask: var(--mask-edge-scalloped);
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
