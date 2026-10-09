<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import truncateText from '$utils/truncateText';
  import { asset } from '$app/paths';
  import AwardBadge from '$lib/components/custom/projects/AwardBadge/index.svelte';
  import { lazyBackground } from '$lib/actions/lazyBackground';

  // `lazy` defers the image until the card nears the screen. Leave it off for
  // cards that can be above the fold: an inline background is fetched before
  // any script runs.
  /**
   * @type {{ info: { image: any; intro: { hed: any; }; description: any; categories: any; awards?: { type: string; logo?: string; url?: string; label?: string }[] }, lazy?: boolean }}
   */
  let { info, lazy = false } = $props();

  let image = $derived(asset('/media/share-images/' + info.image));

  let hasAwards = $derived(!!info.awards && info.awards.length > 0);

  /**
   * @type {number}
   */
  let infoHeight = $state(0);

  /**
   * @type {number}
   */
  let cardHeight = $state();
</script>

<div
  class="card"
  class:has-badge={hasAwards}
  data-sveltekit-preload-code
  bind:clientHeight={cardHeight}
  style="--ch:{cardHeight}px; --ih:{infoHeight}px"
>
  {#if hasAwards}
    <div class="awards-strip">
      {#each info.awards?.slice(0, 1) as award}
        <AwardBadge
          type={award.type}
          logo={award.logo}
          url={award.url}
          inverted
          size="2"
        />
      {/each}
    </div>
  {/if}
  {#if lazy}
    <div class="img" use:lazyBackground={image}></div>
  {:else}
    <div class="img" style={"background-image: url('" + image + "');"}></div>
  {/if}
  <div class="body" bind:clientHeight={infoHeight}>
    <Container width="sm">
      <p class="hed">{@html info.intro.hed}</p>
      <div class="tags">
        {#each info.categories as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
      <div class="body-rest">
        <div class="body-rest-inner">
          <p class="dek">{@html info.description}</p>
        </div>
      </div>
    </Container>
  </div>
</div>

<style lang="scss">
  @use 'lib/styles/mixins' as m;

  .card {
    box-sizing: border-box;
    position: relative;
    aspect-ratio: var(--ratio-square);
    background-color: var(--white-soft);
    // border: var(--space-3xs) solid var(--white-soft);
    box-shadow: var(--shadow-1);
    transition: all 0.35s ease;
    display: block;
    overflow: hidden;
    border-radius: 0.25rem;

    @media (1280px<= width <=1440px) {
      aspect-ratio: var(--ratio-portrait);
    }

    @media (850px<= width <=1024px) {
      aspect-ratio: var(--ratio-portrait);
    }

    @media (620px<= width <850px) {
      aspect-ratio: var(--ratio-golden);
    }

    &:hover {
      box-shadow: var(--shadow-2);
      // @include m.filter-shadow();
      z-index: var(--layer-1);

      .body {
        background-color: var(--white);

        .body-rest {
          grid-template-rows: 1fr;
        }
      }

      .img {
        filter: blur(3px);
        transform: scale3d(1.01, 1.01, 1.01);
      }
    }
  }

  .img {
    width: 100%;
    height: 100%;
    position: absolute;
    background-size: cover;
    background-position: center;
    transition: all 0.35s ease;
  }

  // Sits toward the bottom of the card and grows on hover, every card the
  // same — the hero is just a bigger card, not a different component. It is
  // inset from the bottom edge rather than welded to it, because it is a
  // rounded panel floating over the image, not a bar closing it off.
  //
  // Width is set by the copy, not by the card. The container inside caps the
  // text at --sm, so anything wider than that plus this element's own padding
  // is empty glass: on a 1920 hero the old full-width panel carried 77px of
  // blank frosting down each side. The second term keeps it inside narrow
  // cards, where it shrinks to fit instead.
  .body {
    position: absolute;
    bottom: var(--space-m);
    left: 50%;
    transform: translateX(-50%);
    width: min(
      calc(var(--sm) + 2 * var(--space-s)),
      calc(100% - 2 * var(--project-gap))
    );
    background-color: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(8px);
    // Matches the PhotoPile images so rounded things on the page agree.
    border-radius: 0.5rem;
    padding: var(--space-m) var(--space-s);
    box-shadow: var(--shadow-2);
    display: flex;
    flex-flow: column;
    transition: background-color 0.35s ease;

    .hed {
      font-size: var(--font-size-1);
      color: var(--black-soft);
      font-weight: var(--font-weight-medium);
      font-family: var(--font-sans);
      line-height: var(--line-height-tight);
      margin-bottom: var(--space-2xs);
      max-width: var(--sm);
    }
  }

  .body-rest {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .body-rest-inner {
    overflow: hidden;

    .dek {
      margin: var(--space-2xs) auto;
      font-size: var(--font-size-0);
      font-style: italic;
      text-wrap: pretty;
      line-height: var(--line-height-medium);
      max-width: var(--sm);
    }
  }
  .awards-strip {
    position: absolute;
    top: var(--space-xs);
    right: 0;
    display: flex;
    flex-wrap: wrap;
    box-shadow: var(--shadow-1);
    gap: var(--space-2xs);
    padding: var(--space-3xs) 0 var(--space-3xs) var(--space-s);
    z-index: var(--layer-1);
    pointer-events: none;
    // border-radius: 0.25rem 0 0 0.25rem;
    background-color: var(--purple-soft);
    -webkit-mask: var(--mask-edge-scalloped-left);
    mask: var(--mask-edge-scalloped-left);

    :global(.badge) {
      pointer-events: auto;
    }
  }

  .has-badge {
    .img {
      filter: brightness(0.85);
    }
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    // margin-top: var(--space-xs);
    // background-color: var(--white);

    .tag {
      border-radius: 0.25rem;
      margin-right: var(--space-3xs);
      padding: var(--space-3xs) var(--space-2xs);
      font-size: var(--font-size--2);
      text-transform: capitalize;
      color: var(--purple);
      background-color: var(--white);
      letter-spacing: var(--letter-spaced);
    }
  }
</style>
