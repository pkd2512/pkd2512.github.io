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

  $: activeChapter = places[index]?.hed || '';

  $: console.log(index);
</script>

<section id="travels">
  <Scroller
    top="{0}"
    bottom="{1}"
    threshold="{0.1}"
    query=".container-sm"
    bind:index="{index}"
    bind:offset="{offset}"
    bind:progress="{progress}"
  >
    <div slot="background">
      <Map bind:activeChapter="{activeChapter}" />
    </div>

    <div slot="foreground">
      {#each places as place}
        <Container width="sm" id="{place.hed}">
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
    // width: calc(100% - (var(--sm) + var(--space-3xl)));
    // box-shadow: var(--shadow-2);
  }

  [slot='foreground'] {
    width: calc(var(--sm) + var(--space-3xl));
    margin-left: auto;
    margin-right: var(--space-xs);

    :global(figure) {
      margin-block-start: 0;
    }

    :global(.container-sm) {
      background-color: var(--white-soft);
      box-shadow: var(--shadow-2);
      padding-inline: var(--space-xl);
      padding-block-start: var(--space-l);
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
  }
</style>
