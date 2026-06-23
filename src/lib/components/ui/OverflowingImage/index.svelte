<script>
  import Icon from '@iconify/svelte';
  import { asset } from '$app/paths';

  let {
    url,
    alt,
    caption,
    maxWidth = '200%',
    breakpoint = 480,
    shadow = true,
  } = $props();

  let width = $state();
  let showNudge = $state(true);

  const handleScroll = (/** @type {any} */ e) => {
    showNudge = false;
  };
</script>

<svelte:window bind:innerWidth={width} />

<div class="overflow-img">
  {#if width !== undefined && width < breakpoint && showNudge}
    <div class="nudge">
      <Icon
        icon="ph:hand-swipe-left-bold"
        width="24"
        height="24"
        style="color: white"
      />
    </div>
  {/if}

  <!-- 1. CAPTION MUST COME FIRST IN THE DOM TO FLOAT CORRECTLY -->
  {#if caption}
    <div class="caption">
      {@html caption}
    </div>
  {/if}

  <!-- 2. THE IMAGE CONTAINER SITS NEXT TO IT -->
  <figure
    class:shadow
    style="overflow-x:{width !== undefined && width < breakpoint
      ? 'scroll'
      : 'auto'}"
    onscroll={handleScroll}
  >
    <img
      src={asset('/' + url)}
      {alt}
      loading="lazy"
      style="max-width:{width !== undefined && width < breakpoint
        ? maxWidth
        : '100%'}"
    />
  </figure>
</div>

<style lang="scss">
  .overflow-img {
    margin-block-end: var(--space-l);
    position: relative;
    text-align: center;

    // Mobile layout: stack vertically
    display: flex;
    flex-direction: column;

    @media (width > 1500px) {
      // Desktop: Reset display back to allow standard centering via inline-flex/text-center
      display: block;
      max-width: var(--grid-max-width);
      margin-inline: auto;
    }

    figure {
      display: inline-flex;
      margin-block-end: 0;
      position: relative;
      text-align: start;

      // Mobile first: image on top
      order: 1;

      @media (width > 1500px) {
        order: unset;
      }

      &.shadow {
        box-shadow: var(--shadow-2);
        border: 1px solid var(--gray-soft);
        border-radius: 0.5rem;
      }
    }
  }

  img {
    border-radius: 0.5rem;
  }

  .caption {
    font-style: italic;
    font-family: var(--font-serif);
    line-height: var(--line-height-medium);
    text-align: start;
    max-width: var(--grid-max-width);
    margin-inline: auto;
    padding-inline: var(--grid-gutter);

    // Mobile first: caption on bottom
    order: 2;
    margin-top: var(--space-2xs);

    @media (width > 1500px) {
      order: unset;

      // Pulls it completely out of layout flow so the image stays dead center
      position: absolute;
      top: var(
        --space-l
      ); // Aligns top edge perfectly with the top of the image
      right: 0; // Snaps to the right edge of the page grid
      transform: translateX(
        calc(100% + var(--grid-gutter))
      ); // Offsets it completely outside the page grid

      max-width: var(--xxs);
      margin: 0;
      padding-inline: 0;
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
