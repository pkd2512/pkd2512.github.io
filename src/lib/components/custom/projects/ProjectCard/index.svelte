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
  .card {
    box-sizing: border-box;
    aspect-ratio: var(--ratio-square);
    background-color: var(--white);
    outline: 1px solid var(--white-soft);
    box-shadow: var(--shadow-2);
    transition: all 0.35s ease;
    display: block;
    overflow-y: hidden;

    @media (1024px <=width <=1280px) {
      aspect-ratio: var(--ratio-portrait);
    }

    @media (480px <=width <=768px) {
      aspect-ratio: var(--ratio-portrait);
    }

    &:hover {
      box-shadow: var(--shadow-1), var(--shadow-3);

      .img {
        height: calc(100% - var(--h));
      }
    }
  }

  .img {
    height: 100%;
    background-size: cover;
    background-position: center;
    transition: height 0.5s ease;
  }

  .body {
    padding: var(--space-l);

    @media (--xl-n-below) {
      padding: var(--space-m);
    }

    p {
      color: var(--black-soft);
      font-family: var(--font-serif);
      font-size: var(--font-size--1);
      @media (--sm-n-below) {
        font-size: var(--font-size-0);
      }
      margin: 0;

      &.title {
        color: var(--black-soft);
        margin-bottom: var(--space-2xs);
        font-size: var(--font-size-1);
        font-family: var(--font-sans);
        font-weight: var(--font-weight-light);
        line-height: var(--line-height-medium);

        @media (--sm-n-below) {
          font-weight: var(--font-weight-regular);
        }
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
