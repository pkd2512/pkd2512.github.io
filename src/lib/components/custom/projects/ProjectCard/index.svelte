<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import truncateText from '$utils/truncateText';
  import { asset } from '$app/paths';

  /**
   * @type {{ info: { image: any; intro: { hed: any; }; description: any; categories: any; } }}
   */
  let { info } = $props();

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
  data-sveltekit-preload-code
  bind:clientHeight={cardHeight}
  style="--ch:{cardHeight}px; --ih:{infoHeight}px"
>
  <div
    class="img"
    style={"background-image: url('" +
      asset('/media/share-images/' + info.image) +
      "');"}
  ></div>
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
      // box-shadow: var(--shadow-3);
      @include m.filter-shadow();
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

  .body {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(8px);
    border-radius: var(--space-s-m) var(--space-s-m) 0 0;
    padding: var(--space-m) var(--space-s);
    box-shadow: var(--shadow-5);
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
