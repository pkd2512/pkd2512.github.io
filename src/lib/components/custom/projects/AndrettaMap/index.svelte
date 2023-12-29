<script>
  // @ts-ignore
  import Scroller from '@sveltejs/svelte-scroller';
  import Container from '$lib/components/ui/Container/index.svelte';
  import Map from './Map.svelte';

  let index = 0,
    offset = 0,
    progress = 0;
</script>

<section id="travels">
  <Scroller
    top="{0}"
    bottom="{1}"
    threshold="{0.75}"
    query=".container-sm"
    bind:index="{index}"
    bind:offset="{offset}"
    bind:progress="{progress}"
  >
    <div slot="background">
      <Map />
    </div>

    <div slot="foreground">
      <Container width="sm">hi</Container>
    </div>
  </Scroller>
</section>

<style lang="scss">
  @import 'src/lib/styles/mixins/fullHeight';

  #travels {
    margin-block-end: var(--space-xl);
  }

  [slot='background'] {
    overflow: hidden;
  }

  [slot='foreground'] {
    :global(.container-sm) {
      @include fullheight(1.5);

      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
  }
</style>
