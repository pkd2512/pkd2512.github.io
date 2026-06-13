<script>
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
    <p class="hed">{@html info.intro.hed}</p>
    <p class="dek">{@html info.description}</p>
    <div class="tags">
      {#each info.categories as tag}
        <span class="tag">{tag}</span>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .card {
    box-sizing: border-box;
    position: relative;
    aspect-ratio: var(--ratio-square);
    background-color: var(--white-soft);
    // border: var(--space-3xs) solid var(--white-soft);
    box-shadow: var(--shadow-2);
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
      box-shadow: var(--shadow-1), var(--shadow-3);
      z-index: var(--layer-1);

      .body {
        transform: translateY(0);
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
    transform: translateY(110%);
    // max-height: calc(var(--ch) - 3 * var(--space-l));
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    background-color: var(--white);
    padding: var(--space-s-m) var(--space-m-l);
    // border-radius: 0.5rem 0.5rem 0 0;
    box-shadow: var(--shadow-5);
    display: flex;
    flex-flow: column;
    overflow-y: hidden;

    .hed {
      font-size: var(--font-size-1);
      color: var(--black-soft);
      font-weight: var(--font-weight-regular);
      font-family: var(--font-sans);
      line-height: var(--line-height-medium);
      margin-bottom: var(--space-3xs);
    }

    .dek {
      margin: 0;
      font-style: italic;
      text-wrap: pretty;
      line-height: var(--line-height-medium);
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      margin-top: var(--space-xs);
      background-color: var(--white);

      .tag {
        border-radius: 0.25rem;
        margin-right: var(--space-3xs);
        padding: var(--space-3xs) var(--space-2xs);
        font-size: var(--font-size--2);
        text-transform: capitalize;
        color: var(--purple);
        background-color: var(--white-soft);
        // box-shadow: var(--shadow-1), var(--inner-shadow-1);
        letter-spacing: var(--letter-spaced);
      }
    }
  }
</style>
