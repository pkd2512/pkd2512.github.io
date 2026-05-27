<script>
  /**
   * @type {{
   *   title: string,
   *   items: Array<{url: string, alt?: string, title?: string}>
   * }}
   */
  let { title, items } = $props();
</script>

{#if items?.length}
  <div class="gallery-items">
    <h3>{title}</h3>
    <div class="gallery-grid">
      {#each items as item}
        <a href="/{item.url}" class="gallery-card">
          <img src="/{item.url}" alt={item.alt} loading="lazy" />
          <span class="card-label">{item.title}</span>
        </a>
      {/each}
    </div>
  </div>
{/if}

<style lang="scss">
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
