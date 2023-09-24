<script>
  /**
   * @param info - contents for the card
   * @type {{ intro: { img: any; }; title: any; categories: any; }}
   */
  export let info;

  /**
   * @type {number}
   */
  let infoHeight;
</script>

<div class="card" style="--h:{infoHeight}px">
  <div
    class="img"
    style="background-image: url('/media/{info.intro.img}');"
  ></div>
  <div class="body" bind:clientHeight="{infoHeight}">
    <p class="title">{info.title}</p>
    <p class="description">{info.description}</p>
    <div class="tags">
      {#each info.categories as tag}
        <span class="tag">{tag}</span>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  :global {
    :where(html) {
      --card-width: calc(1.1 * var(--sm));
      @media (--md-n-below) {
        --card-width: calc(0.5 * var(--sm));
      }
    }
  }
  .card {
    box-sizing: border-box;
    aspect-ratio: var(--ratio-square);
    background-color: var(--white);
    border-radius: 0.25rem;
    box-shadow: var(--shadow-2);
    transition: all 0.35s ease;
    display: block;
    overflow-y: hidden;

    width: var(--card-width);

    &:hover {
      box-shadow: var(--shadow-1), var(--shadow-3);

      .img {
        height: calc(100% - var(--h));
      }
    }
  }

  .img {
    width: var(--card-width);
    height: 100%;
    background-size: cover;
    background-position: center;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    transition: height 0.5s ease;
  }

  .body {
    padding: var(--space-s);

    p {
      color: var(--black);
      font-weight: var(--font-weight-regular);
      margin: 0;
      font-size: var(--font-size--1);

      &.title {
        color: var(--black-soft);

        margin-bottom: var(--space-2xs);
        font-size: var(--font-size-0);
        font-family: var(--font-display);
        font-weight: var(--font-weight-bold);
        line-height: var(--line-height-medium);
      }
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      margin-top: var(--space-xs);

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
