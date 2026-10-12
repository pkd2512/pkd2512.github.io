<script>
  // @ts-ignore
  import Scroller from '@sveltejs/svelte-scroller';
  import Container from '$lib/components/ui/Container/index.svelte';
  import places from './places';

  import media from '$utils/media';
  import { onMount } from 'svelte';

  let index = $state(0);
  let offset = $state(0);
  let progress = $state(0);

  let activeChapter = $derived(places[index]?.key || '');

  // Several slides share one place key, and an id cannot repeat or contain
  // spaces: the first slide keeps the key, later ones get a numeric suffix.
  const seen = {};
  const chapterIds = places.map((place) => {
    const base = place.key.replace(/\s+/g, '-');
    seen[base] = (seen[base] ?? 0) + 1;
    return seen[base] === 1 ? base : `${base}-${seen[base]}`;
  });

  let windowWidth = $state();
  let Map = $state(null);

  onMount(async () => {
    const mod = await import('./Map.svelte');
    Map = mod.default;
  });
</script>

<svelte:window bind:innerWidth={windowWidth} />

<section id="travels">
  <Scroller
    top={0}
    bottom={1}
    threshold={windowWidth && windowWidth < 1440 ? 1 : 0.75}
    query=".container-sm"
    bind:index
    bind:offset
    bind:progress
  >
    <div slot="background">
      {#if Map}
        <Map bind:activeChapter />
      {/if}
    </div>

    <div slot="foreground">
      {#each places as place, i}
        <div class="slide {index === i ? 'visible' : 'invisible'}">
          <Container width="sm" id={chapterIds[i]}>
            {#if place.hed}
              <div class="h4">{place.hed}</div>
            {/if}

            {#if place.dek}
              <p>{place.dek}</p>
            {/if}

            {#if place.img}
              <figure>
                <img
                  src={media('/media/projects/andretta/' + place.img)}
                  alt={place.alt}
                  loading="lazy"
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
  @use 'src/lib/styles/mixins/fullHeight' as *;

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
