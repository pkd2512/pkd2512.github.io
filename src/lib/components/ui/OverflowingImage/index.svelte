<script>
  import Icon from '@iconify/svelte';
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

  $: showNudge = true;

  const handleScroll = (/** @type {any} */ e) => {
    showNudge = false;
  };
</script>

<svelte:window bind:innerWidth="{width}" />

<div class="overflow-img">
  {#if width < breakpoint && showNudge}
    <div class="nudge">
      <Icon
        icon="ph:hand-swipe-left-bold"
        width="24"
        height="24"
        style="color: white"
      />
    </div>
  {/if}

  <figure
    class:shadow="{shadow}"
    style="overflow-x:{width < breakpoint ? 'scroll' : 'auto'}"
    on:scroll="{handleScroll}"
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
    position: relative;

    figure {
      display: inline-flex;
      margin-block-end: 0;
      position: relative;

      &.shadow {
        box-shadow: var(--shadow-2);
        border: 1px solid var(--gray-soft);
      }
    }
  }

  .nudge {
    position: absolute;
    top: 30%;
    right: var(--space-s);
    z-index: var(--layer-1);
    background-color: var(--purple-soft);
    padding: 0.8rem 1rem;
    border-radius: 50px;
    animation: swipe 1.5s cubic-bezier(0.86, 0, 0.07, 1) infinite forwards;
  }

  @keyframes swipe {
    0% {
      right: calc(-1 * var(--space-s));
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      right: var(--space-s);
      opacity: 1;
    }
  }
</style>
