<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import truncateText from '$utils/truncateText';

  /**
   * @param info - contents for the card
   * @type {{ intro: { img: any; }; title: any; categories: any; }}
   */
  export let info;

  /**
   * @type {number}
   */
  let infoHeight;

  /**
   * @type {number}
   */
  let cardHeight;
</script>

<div
  class="card"
  bind:clientHeight="{cardHeight}"
  style="--ch:{cardHeight}px; --ih:{infoHeight}px"
>
  <div
    class="img"
    style="background-image: url('/media/{info.intro.img}');"
  ></div>
  <Container width="sm" style="position:relative;">
    <div class="body" bind:clientHeight="{infoHeight}">
      <p class="hed">{@html info.title}</p>
      <p class="dek">{@html info.description}</p>
      <div class="tags">
        {#each info.categories as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    </div>
  </Container>
</div>

<style lang="scss">
  .card {
    box-sizing: border-box;
    position: relative;
    aspect-ratio: var(--ratio-square);
    background-color: var(--white);
    outline: 1px solid var(--white-soft);
    box-shadow: var(--shadow-2);
    transition: all 0.35s ease;
    display: block;
    overflow: hidden;

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

      .body {
        opacity: 1;
      }

      .img {
        filter: blur(3px);
        transform: scale3d(1.05, 1.05, 1.05);
      }
    }
  }

  .card {
    :global(.container-sm) {
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
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
    opacity: 0;
    width: 100%;
    max-height: calc(var(--ch) - 3 * var(--space-l));
    transition: opacity 0.35s ease;
    background-color: var(--white);
    padding: var(--space-s-m) var(--space-m-l);
    margin-bottom: var(--space-l);
    border-radius: 0.25rem;
    box-shadow: var(--shadow-3);
    display: flex;
    flex-flow: column;
    overflow-y: scroll;

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
      text-wrap: balance;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      margin-top: var(--space-xs);
      background-color: var(--white);

      .tag {
        border-radius: 1rem;
        margin-right: var(--space-3xs);
        padding: var(--space-3xs) var(--space-2xs);
        font-size: var(--font-size--2);
        text-transform: capitalize;
        color: var(--purple);
        background-color: var(--white-soft);
        box-shadow: var(--shadow-1), var(--inner-shadow-1);
        letter-spacing: var(--letter-spaced);
      }
    }
  }
</style>
