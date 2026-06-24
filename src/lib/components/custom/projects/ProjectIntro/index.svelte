<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import ProjectAward from '$lib/components/custom/projects/ProjectAward/index.svelte';
  import Icon from '@iconify/svelte';

  /**
   * @type {number}
   */
  let infoHeight = $state(0);

  /**
   * @type {{ meta: { intro: { hed: any; dek?: any; img?: any; client?: any; url?: any; duration?: any; }; awards?: { type: string; logo?: string; url?: string; label?: string }[] } }}
   */
  let { meta } = $props();

  // How many awards fit in the 1-column side rail.
  const SIDE_RAIL_CAPACITY = 4;
  // How many awards fit in the 2-column side rail (wider viewports).
  const SIDE_RAIL_2COL_CAPACITY = 8;

  // Below this width we switch to bottom-row entirely.
  const WIDE_QUERY = '(min-width: 1024px)'; // --lg-n-above
  // Above this width we have room for the 2-column side rail.
  const XWIDE_QUERY = '(min-width: 1440px)'; // --xl-n-above

  let isWide = $state(false);
  let isXWide = $state(false);

  $effect(() => {
    if (typeof window === 'undefined') return;
    const mqlW = window.matchMedia(WIDE_QUERY);
    const mqlXW = window.matchMedia(XWIDE_QUERY);
    const update = () => {
      isWide = mqlW.matches;
      isXWide = mqlXW.matches;
    };
    update();
    mqlW.addEventListener('change', update);
    mqlXW.addEventListener('change', update);
    return () => {
      mqlW.removeEventListener('change', update);
      mqlXW.removeEventListener('change', update);
    };
  });

  let position = $derived.by(() => {
    const count = meta.awards?.length ?? 0;
    if (!isWide) return 'bottom';
    if (count <= SIDE_RAIL_CAPACITY) return 'side';
    if (isXWide && count <= SIDE_RAIL_2COL_CAPACITY) return 'side-2';
    return 'bottom';
  });
</script>

<section
  id="hero"
  data-awards={position}
  style="--info-height: {Math.round(infoHeight)}px;"
>
  <Container grid>
    <header class="col-span-lg-10">
      <div class="text" bind:clientHeight={infoHeight}>
        <h1>{@html meta.intro.hed}</h1>
        <p class="dek">
          {@html meta.intro.dek}
        </p>
        <p class="meta">
          <span title="client">
            <Icon icon="mdi:company" width="24" height="24" />{@html meta.intro
              .client}
          </span>
          <span title="duration">
            <Icon icon="mdi:calendar" width="24" height="24" />{@html meta.intro
              .duration}
          </span>
          {#if meta.intro?.url}
            {@const internal = meta.intro.url.includes('#')}
            <span title="link">
              <a href={meta.intro.url}>
                <Icon
                  icon={internal
                    ? 'mdi:file-document-box-multiple-outline'
                    : 'mdi:open-in-new'}
                  width="24"
                  height="24"
                />View project
              </a>
            </span>
          {/if}
        </p>
      </div>
    </header>

    <div class="awards col-span-2">
      <ProjectAward awards={meta.awards} />
    </div>
  </Container>
</section>

<style lang="scss">
  @use 'src/lib/styles/mixins' as *;

  #hero {
    margin-top: calc(-1.5 * var(--space-3xl));
    background-color: var(--purple-soft);
    position: relative;
    z-index: var(--layer-2);
  }

  // Side-rail layout (1- or 2-column).
  // Uses --info-height (set inline on #hero) so it tracks the h1's height.
  #hero[data-awards='side'] .awards,
  #hero[data-awards='side-2'] .awards {
    height: var(--info-height);
    margin-block-start: calc(
      var(--info-height) * 0.25 + var(--space-xl) + 67px
    );
  }

  // 2-column side rail: the .awards column itself stays at col-span-2,
  // but its strip is absolutely positioned so it can overflow into the
  // empty space to the right of the page grid without affecting layout
  // or overlapping the header text on the left.
  #hero[data-awards='side-2'] .awards {
    position: relative;
    overflow: visible;
  }

  .awards {
    display: flex;
    align-self: start;
    justify-content: center;
  }

  // Bottom-row layout: awards take full grid width below the header.
  #hero[data-awards='bottom'] {
    header {
      min-height: 0;
    }

    .awards {
      grid-column: 1 / -1;
      height: auto;
      margin-block-start: 0;
      margin-block-end: var(--space-l);
    }
  }

  header {
    min-height: 90lvh;
    height: calc(var(--info-height) * 1.5);

    @media (max-width: 600px) {
      min-height: 80lvh;
    }

    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white-soft);

    .text {
      max-width: calc(0.85 * var(--lg));
      position: relative;
      z-index: var(--layer-1);

      @media (--xl-n-below) {
        max-width: calc(var(--lg) - 2 * var(--space-xl));
      }

      @media (--lg-n-below) {
        max-width: calc(1.15 * var(--md));
      }
    }

    .dek {
      column-count: 2;
      margin-block-start: var(--space-s);

      @media (--lg-n-below) {
        column-count: 1;
      }
    }

    p {
      color: var(--white-soft);
      // font-size: var(--font-size-1);
      font-weight: var(--font-weight-regular);
      @include text-shadow(var(--purple));

      &.meta {
        font-family: var(--font-sans);
        font-size: var(--font-size--1);
        font-weight: var(--font-weight-medium);

        span {
          display: inline-flex;
          align-items: flex-end;
          margin-inline-end: var(--space-s);
          letter-spacing: var(--letter-spaced);
          :global(svg) {
            margin-inline-end: var(--space-3xs);
          }
        }

        a {
          text-decoration: none;
          color: inherit;
          display: inline-flex;
          align-items: flex-end;
          margin-inline-end: var(--space-s);
          font-size: var(--font-size--1);
          transition: font-weight 0.3s ease;

          :global(svg) {
            transition: all 0.3s ease;
          }

          &:hover {
            font-weight: var(--font-weight-bold);

            :global(svg) {
              transform: scale(1.1);
            }
          }
        }
      }
    }

    h1 {
      color: var(--white-soft);
      @include text-shadow(var(--purple));
      margin-inline: auto;
    }
  }
</style>
