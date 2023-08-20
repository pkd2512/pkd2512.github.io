<script>
  /**
   * @param info - contents for the card
   * @type {{ title: any; date: any; description: any; }}
   */
  export let info;
</script>

<div class="card">
  <div
    class="img"
    style="background-image: url('/media/{info.intro.img}');"
  ></div>
  <div class="body">
    <p class="title">{info.title}</p>
    <p class="description">{info.description}</p>
  </div>
</div>

<style lang="scss">
  .card {
    box-sizing: border-box;
    aspect-ratio: var(--ratio-portrait);
    background-color: var(--white);
    border-radius: 0.25rem;
    box-shadow: var(--shadow-2);
    transition: all 0.35s ease;
    display: block;
    overflow-y: hidden;

    width: var(--xxs);
    @media (--md-n-below) {
      width: calc(0.8 * var(--xxs));
    }

    &:hover {
      box-shadow: var(--shadow-1), var(--shadow-3);

      .img {
        height: 0px;
      }
    }
  }

  .img {
    width: calc(1 * var(--xxs));
    @media (--md-n-below) {
      width: calc(0.8 * var(--xxs));
    }
    height: 100%;
    background-size: cover;
    background-position: center;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    transition: height 0.5s ease;
  }

  .body {
    padding: var(--space-xs);
    height: 100%;

    p {
      color: var(--black);
      font-weight: var(--font-weight-regular);
      margin: 0;
      font-size: var(--font-size--1);

      &.title {
        color: var(--black-soft);

        margin-bottom: var(--space-2xs);
        font-size: var(--font-size-0);
        font-weight: var(--font-weight-regular);
        font-family: var(--font-display);
        line-height: var(--line-height-medium);
      }
    }
  }
</style>
