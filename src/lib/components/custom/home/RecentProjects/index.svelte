<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import { fade } from 'svelte/transition';
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
  import Icon from '@iconify/svelte';
  import checkAbsoluteUrl from '$utils/checkAbsoluteUrl';
  import { page } from '$app/stores';
  import { base, assets } from '$app/paths';
  // @ts-ignore
  import Scroller from '@sveltejs/svelte-scroller';

  $: data = $page.data.contents
    .filter((/** @type {{ type: string; }} */ d) => d.type === 'project')
    .slice(0, 3)
    // @ts-ignore
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  let index = 0,
    offset = 0,
    progress = 0;
</script>

<svelte:head>
  {#each data as d}
    <link rel="preload" as="image" href="{assets}/media/{d.intro.img}" />
  {/each}
</svelte:head>

<section id="recent-projects">
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
      {#key index}
        <div
          in:fade="{{ duration: 250 }}"
          class="img"
          style="background-image:url({assets}/media/{data[index].intro.img})"
        ></div>
      {/key}
    </div>

    <div slot="foreground">
      {#each data as project}
        <Container width="sm">
          <div class="anno">
            <p class="hed">{project.intro.hed}</p>
            <p class="dek">{project.description}</p>

            {#if project.links}
              <div class="links">
                {#each project.links as link}
                  <div class="link">
                    <LinkButton
                      url="{checkAbsoluteUrl(link.url)
                        ? link.url
                        : base + link.url}"
                      label="{link.label}"
                      target=""
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
      @include fullheight(1.5);

      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    :global(.container-sm:last-child) {
      @include fullheight(1.15);
    }

    .anno {
      background-color: var(--white);
      margin-block-start: 50lvh;
      padding: var(--space-s-m) var(--space-m-l);
      border-radius: 0.25rem;
      box-shadow: var(--shadow-2);
      display: flex;
      flex-flow: column;

      @media (--md-n-below) {
        width: calc(100% - var(--space-xl));
        margin-block-start: 300px;
      }
    }

    .hed {
      font-size: var(--font-size-1);
      color: var(--black-soft);
      font-weight: var(--font-weight-light);
      font-family: var(--font-sans);
      line-height: var(--line-height-medium);
      margin-bottom: var(--space-2xs);
    }

    .dek {
      margin: 0;
      font-style: italic;
    }

    .links {
      margin-top: var(--space-xs);
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
