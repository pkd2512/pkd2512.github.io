<script>
  // @ts-ignore
  import Scroller from '@sveltejs/svelte-scroller';
  import Container from '$lib/components/ui/Container/index.svelte';
  import Map from './Map.svelte';
  import places from './places';

  import { assets } from '$app/paths';

  let index = 0,
    offset = 0,
    progress = 0;

  $: activeChapter = places[index]?.key || '';

  /**
   * @type {number}
   */
  let windowWidth;
</script>

<svelte:window bind:innerWidth="{windowWidth}" />

<section id="travels">
  <Scroller
    top="{0}"
    bottom="{1}"
    threshold="{windowWidth < 1440 ? 1 : 0.75}"
    query=".container-sm"
    bind:index="{index}"
    bind:offset="{offset}"
    bind:progress="{progress}"
  >
    <div slot="background">
      <Map bind:activeChapter="{activeChapter}" />
    </div>

    <div slot="foreground">
      {#each places as place, i}
        <div class="slide {index === i ? 'visible' : 'invisible'}">
          <Container width="sm" id="{place.key}">
            {#if place.hed}
              <div class="h4">{place.hed}</div>
            {/if}

            {#if place.dek}
              <p>{place.dek}</p>
            {/if}

            {#if place.img}
              <figure>
                <img
                  src="{assets}/media/projects/andretta/{place.img}"
                  alt="{place.alt}"
                />
                <figcaption>{place.caption}</figcaption>
              </figure>
            {/if}
          </Container>
        </div>
      {/each}
    </div>
  </Scroller>
</section>

<style lang="scss">
  @import 'src/lib/styles/mixins/fullHeight';

  #travels {
    margin-block-end: var(--space-xl);

    :global(svelte-scroller-foreground) {
      pointer-events: none;
    }
  }

  [slot='background'] {
    overflow: hidden;
  }

  [slot='foreground'] {
    width: calc(var(--sm) + var(--space-3xl));
    margin-left: auto;
    margin-right: var(--space-xs);

    @media (--lg-n-below) {
      width: auto;
      margin: 0;
    }

    :global(figure) {
      margin-block-start: 0;
    }

    :global(.container-sm) {
      background-color: var(--white-soft);
      box-shadow: var(--shadow-3);
      padding-inline: var(--space-xl);
      padding-block-start: var(--space-l);
      margin-block-end: var(--space-3xl);
      display: flex;
      flex-direction: column;
    }

    :global(.container-sm#Opening) {
      visibility: hidden;
      @include fullheight;
    }
    :global(.container-sm#Closing) {
      visibility: hidden;
      @include fullheight;
    }

    .slide {
      transition: all 0.45s cubic-bezier(0.83, 0, 0.17, 1);

      &.visible {
        opacity: 1;
      }

      &.invisible {
        opacity: 0;
        transform: scale3d(0.95, 0.95, 1);
      }

      @media (--xl-n-below) {
        margin-bottom: 100lvh;

        @media (width <= 720px) {
          margin-bottom: 750px;
        }

        &:last-of-type {
          margin-bottom: 0;
        }

        &.invisible {
          opacity: 1;
          transform: scale3d(1, 1, 1);
        }
      }
    }
  }
</style>
