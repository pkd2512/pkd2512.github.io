<script>
  /**
   * @param url Path to the  image
   * @type {String}
   */
  export let url;

  /**
   * @param alt AltText for the image
   * @type {String}
   */
  export let alt;

  /**
   * @param caption Image caption
   * @type {String}
   */
  export let caption;

  /**
   * @param overflow Amount of overflow
   * @type {String}
   */
  export let maxWidth = '200%';

  /**
   * @param breakpoint Screenwidth below which image will overflow
   * @type {Number}
   */
  export let breakpoint = 480;

  import { assets } from '$app/paths';

  /**
   * @type {Number}
   */
  let width;
</script>

<svelte:window bind:innerWidth="{width}" />

<div class="overflow-img">
  <figure style="overflow-x:{width < breakpoint ? 'scroll' : 'auto'}">
    <img
      src="{assets}/{url}"
      alt="{alt}"
      loading="lazy"
      style="max-width:{width < breakpoint ? maxWidth : '100%'}"
    />
  </figure>

  <!-- svelte-ignore a11y-structure -->
  <figcaption>
    {@html caption}
  </figcaption>
</div>

<style lang="scss">
  .overflow-img {
    margin-block-end: var(--space-s);

    figure {
      margin-block-end: 0;
    }
  }
</style>
