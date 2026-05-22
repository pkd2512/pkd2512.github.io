<script>
  import Icon from '@iconify/svelte';
  import Container from '$lib/components/ui/Container/index.svelte';
  import { assets } from '$app/paths';

  let {
    url,
    alt,
    caption,
    maxWidth = '200%',
    breakpoint = 480,
    shadow = true,
  } = $props();

  /**
   * @type {Number | undefined}
   */
  let width = $state();

  let showNudge = $state(true);

  const handleScroll = (/** @type {any} */ e) => {
    showNudge = false;
  };
</script>

<svelte:window bind:innerWidth="{width}" />

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

  <figure
    class:shadow="{shadow}"
    style="overflow-x:{width !== undefined && width < breakpoint
      ? 'scroll'
      : 'auto'}"
    onscroll="{handleScroll}"
  >
    <img
      src="{assets}/{url}"
      alt="{alt}"
      loading="lazy"
      style="max-width:{width !== undefined && width < breakpoint
        ? maxWidth
        : '100%'}"
    />
  </figure>

  <Container width="md" style="padding-inline: 0">
    <div class="caption">
      {@html caption}
    </div>
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
