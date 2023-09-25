<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import Scroller from '@sveltejs/svelte-scroller';
  import { fade } from 'svelte/transition';
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
  import Icon from '@iconify/svelte';
  import { page } from '$app/stores';

  let data = $page.data.contents
    .filter((/** @type {{ type: string; }} */ d) => d.type === 'project')
    .slice(0, 3);

  let index = 0,
    offset = 0,
    progress = 0;

  $: console.log(data);
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
            <p class="hed">{project.intro.hed}</p>
            <p class="dek">{project.intro.dek}</p>

            {#if project.links}
              <div class="links">
                {#each project.links as link}
                  <div class="link">
                    <LinkButton
                      url="{link.url}"
                      label="{link.label}"
                      target="{link.target || ''}"
                    />
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </Container>
      {/each}
    </div>
  </Scroller>

  <div id="all-projects">
    <div class="icon">
      <Icon icon="icon-park-solid:more-app" />
    </div>

    <LinkButton solid="{true}" url="projects/" label="Show more work" />
  </div>
</section>

<style lang="scss">
  @import 'src/lib/styles/mixins/fullHeight';

  #recent-projects {
    margin-bottom: var(--space-2xl-3xl);

    :global(svelte-scroller-outer) {
      overflow: hidden;
    }
  }

  #all-projects {
    width: 100%;
    text-align: center;
    margin-block: var(--space-s);

    .icon {
      margin-block: var(--space-2xs);
      font-size: var(--font-size-1);
      :global(path) {
        fill: var(--purple);
      }
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
    :global(.container-sm) {
      @include fullheight(1.3);

      display: flex;
      justify-content: center;
      align-items: center;
    }

    .anno {
      background-color: var(--white);
      padding: var(--space-s-m) var(--space-m-l);
      border-radius: 0.25rem;
      box-shadow: var(--shadow-2);
      display: flex;
      flex-flow: column;
    }

    .hed {
      font-size: var(--font-size-1);
      color: var(--black-soft);
      font-weight: var(--font-weight-light);
      font-family: var(--font-sans);
      line-height: var(--line-height-medium);
    }

    .dek {
      color: var(--black-soft);
      font-family: var(--font-sans);
      font-weight: var(--font-weight-light);
      margin: 0;
    }

    .links {
      margin-top: var(--space-s-m);
      display: flex;
      justify-content: end;
      width: 100%;

      .link {
        width: 10rem;
        text-align: end;
      }
    }
  }
</style>
