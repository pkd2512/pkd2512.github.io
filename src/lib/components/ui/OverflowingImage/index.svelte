<script>
  import Container from '$lib/components/ui/Container/index.svelte';

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

  /**
   * @param shadow Whether to show image shadow
   */
  export let shadow = true;

  import { assets } from '$app/paths';

  /**
   * @type {Number}
   */
  let width;
</script>

<svelte:window bind:innerWidth="{width}" />

<div class="overflow-img">
  <figure
    class:shadow="{shadow}"
    style="overflow-x:{width < breakpoint ? 'scroll' : 'auto'}"
  >
    <img
      src="{assets}/{url}"
      alt="{alt}"
      loading="lazy"
      style="max-width:{width < breakpoint ? maxWidth : '100%'}"
    />

    <figcaption></figcaption>
  </figure>

  <!-- svelte-ignore a11y-structure -->
  <Container width="md" style="padding-inline: 0">
    <figcaption>
      {@html caption}
    </figcaption>
  </Container>
</div>

<style lang="scss">
  .overflow-img {
    margin-block-end: var(--space-l);

    figure {
      display: inline-flex;
      margin-block-end: 0;

      &.shadow {
        box-shadow: var(--shadow-2);
        border: 1px solid var(--gray-soft);
      }
    }
  }
</style>
