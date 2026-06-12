<script>
  import { dev } from '$app/environment';

  let visible = $state(false);
  let columns = $state(4);

  /** @param {KeyboardEvent} e */
  function toggle(e) {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === 'KeyG') {
      e.preventDefault();
      visible = !visible;
    }
  }

  $effect(() => {
    if (dev) {
      window.addEventListener('keydown', toggle);
      return () => window.removeEventListener('keydown', toggle);
    }
  });

  $effect(() => {
    if (!dev || !visible) return;
    const update = () => {
      columns =
        parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue('--grid-columns')
            .trim()
        ) || 4;
    };
    update();
    const mqlMd = window.matchMedia('(min-width: 768px)');
    const mqlLg = window.matchMedia('(min-width: 1024px)');
    const handler = () => update();
    mqlMd.addEventListener('change', handler);
    mqlLg.addEventListener('change', handler);
    return () => {
      mqlMd.removeEventListener('change', handler);
      mqlLg.removeEventListener('change', handler);
    };
  });
</script>

{#if dev && visible}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="overlay" aria-hidden="true" role="presentation">
    <div class="overlay__container">
      <div class="overlay__baseline"></div>
      <div class="overlay__grid" style="--columns: {columns}">
        {#each Array(columns) as _, i}
          <div class="overlay__col"></div>
        {/each}
      </div>
    </div>

    <div class="overlay__badge">
      {columns} cols
      <kbd>^⇧G</kbd>
    </div>
  </div>
{/if}

<style lang="scss">
  .overlay {
    position: fixed;
    inset: 0;
    z-index: var(--layer-important);
    pointer-events: none;
    overflow: hidden;
  }

  .overlay__container {
    width: 100%;
    height: 100%;
    max-width: var(--grid-max-width);
    margin-inline: auto;
    padding-inline: var(--grid-gutter);
    position: relative;
  }

  .overlay__baseline {
    position: absolute;
    inset: 0;

    background-image: repeating-linear-gradient(
      to bottom,
      rgba(255, 100, 200, 0.3) 0,
      rgba(255, 100, 200, 0.3) 1px,
      transparent 1px,
      transparent var(--grid-baseline, 8px)
    );
  }

  .overlay__grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-columns), 1fr);
    gap: var(--grid-gutter);
    height: 100%;
    position: relative;
    outline: 1px solid rgba(255, 100, 200, 0.5);
  }

  .overlay__col {
    position: relative;
    background: var(--white);
    background: rgba(255, 100, 200, 0.1);

    // &::after {
    //   content: '';
    //   position: absolute;
    //   inset: 0;
    //   background-image: repeating-linear-gradient(
    //     to right,
    //     cyan 0,
    //     cyan 1px,
    //     transparent 1px,
    //     transparent calc(100% / var(--grid-subs, 4))
    //   );
    //   opacity: 0.3;
    // }
  }

  .overlay__badge {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.35em 0.75em;
    background: rgba(0, 0, 0, 0.75);
    color: #fff;
    font-family: monospace;
    font-size: 0.75rem;
    line-height: 1;
    border-radius: 4px;
    pointer-events: auto;
    backdrop-filter: blur(4px);

    kbd {
      font-family: inherit;
      font-size: 0.65rem;
      opacity: 0.55;
    }
  }
</style>
