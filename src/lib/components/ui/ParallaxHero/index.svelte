<script>
  import { scaleLinear } from 'd3-scale';
  import { onMount } from 'svelte';

  let { img = '', children } = $props();

  let windowHeight = $state(0);
  let vPos = $state(0);

  /** Drift in % of the image layer's own height, matching the CSS keyframes. */
  const makeParallax = (pos) => {
    return scaleLinear()
      .clamp(true)
      .domain([0, 0.9 * windowHeight])
      .range([8, -8])(pos);
  };

  onMount(() => {
    // Browsers with scroll-driven animations run this off the main thread from
    // CSS alone (see below); only the rest need a scroll listener.
    if (CSS.supports('animation-timeline: scroll()')) return;

    const handleScroll = () => {
      vPos = makeParallax(window.scrollY);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<svelte:window bind:innerHeight={windowHeight} />
<div class="hero">
  <div
    class="hero-bg"
    style="background-image: url({img}); --y: {vPos}%"
    aria-hidden="true"
  ></div>
  {#if children}{@render children()}{/if}
</div>

<style lang="scss">
  @use 'src/lib/styles/mixins/fullHeight' as *;
  .hero {
    position: relative;
    overflow: hidden;
    width: 100%;
    margin-inline: auto;
    @include fullheight(0.9);

    @media (max-width: 600px) {
      @include fullheight(0.8);
    }

    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  // Its own layer, taller than the frame so it can drift without gapping.
  // Transform (not background-position) so the drift stays off the main thread.
  .hero-bg {
    position: absolute;
    inset: -10% 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transform: translateY(var(--y, 0));
  }

  // Driven by the page's own scroll over the first 90vh — the same mapping the
  // JS fallback uses. A `view()` timeline would be half spent before the first
  // scroll, since this hero starts at the top of the page already in frame.
  @supports (animation-timeline: scroll()) {
    .hero-bg {
      animation: hero-drift linear both;
      animation-timeline: scroll(root block);
      animation-range: 0 90vh;
    }

    @keyframes hero-drift {
      from {
        transform: translateY(8%);
      }
      to {
        transform: translateY(-8%);
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-bg {
      animation: none;
      transform: none;
    }
  }
</style>
