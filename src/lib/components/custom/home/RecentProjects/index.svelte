<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import Scroller from '@sveltejs/svelte-scroller';
  import { fade } from 'svelte/transition';

  import { page } from '$app/stores';

  let data = $page.data.contents
    .filter((/** @type {{ type: string; }} */ d) => d.type === 'project')
    .slice(0, 3);

  let index = 0,
    offset = 0,
    progress = 0;
</script>

<section id="recent-projects">
  <Scroller
    top="{0}"
    bottom="{1}"
    query=".container-sm"
    bind:index="{index}"
    bind:offset="{offset}"
    bind:progress="{progress}"
  >
    <div slot="background">
      {#key index}
        <div
          in:fade="{{ duration: 300 }}"
          out:fade="{{ duration: 350 }}"
          class="img"
          style="background-image:url(media/{data[index].intro.img})"
        ></div>
      {/key}
    </div>

    <div slot="foreground">
      {#each data as project}
        <Container width="sm">
          <div class="anno">
            <p>{project.intro.hed}</p>
            <p>{project.intro.dek}</p>
          </div>
        </Container>
      {/each}
    </div>
  </Scroller>
</section>

<style lang="scss">
  @import 'src/lib/styles/mixins/fullHeight';

  #recent-projects {
    margin-bottom: var(--space-2xl-3xl);
    margin-top: calc(-2 * var(--space-3xl));
  }

  :global {
    svelte-scroller-outer {
      overflow: hidden;
    }
  }

  [slot='background'] {
    overflow: hidden;
    .img {
      width: 100%;
      @include fullheight(1);
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      overflow: hidden;
    }
  }

  [slot='foreground'] {
    :global {
      .container-sm {
        @include fullheight(1.3);

        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .anno {
    }
  }
</style>
