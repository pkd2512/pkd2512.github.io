<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import ParallaxHero from '$lib/components/ui/ParallaxHero/index.svelte';

  import { asset } from '$app/paths';

  import { scaleLinear } from 'd3-scale';

  let { meta } = $props();

  // Starts at 0, not undefined: an empty value would render `--anno-h: px`,
  // which makes `animation-range` invalid and spreads the sink over the
  // whole page instead of the first screen.
  let infoHeight = $state(0);
  let windowHeight = $state();
  /** How far the quote has sunk, in px. CSS drives this where it can. */
  let annoY = $state(0);

  const makeParallax = (pos) => {
    if (!infoHeight || !windowHeight) return 0;
    return scaleLinear()
      .clamp(true)
      .domain([infoHeight, 0.6 * windowHeight])
      .range([0, infoHeight])(pos);
  };

  $effect(() => {
    // Where scroll-driven animations are supported the CSS below does this
    // off the main thread; animating the `bottom` offset from script forced
    // a layout on every scroll event.
    if (CSS.supports('animation-timeline: scroll()')) return;

    const handleScroll = () => {
      annoY = makeParallax(window.scrollY);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<svelte:head>
  {#if meta?.intro}
    <link
      rel="preload"
      href={asset('/media/' + meta.intro.img)}
      as="image"
      fetchpriority="high"
    />
  {/if}
</svelte:head>

<svelte:window bind:innerHeight={windowHeight} />

{#if meta?.intro}
  <div class="img">
    <ParallaxHero img={asset('/media/' + meta.intro.img)} />
  </div>

  <Container width="fluid">
    <div class="anno" style="--anno-h: {infoHeight}px; --anno-y: {annoY}px">
      <aside bind:clientHeight={infoHeight}>
        {@html meta.intro.quote}
      </aside>
    </div>
  </Container>
{/if}

<style lang="scss">
  @use 'src/lib/styles/mixins' as *;

  .img {
    :global(.hero) {
      @include fullheight(0.8);
    }
    :global(.hero) {
      @media (max-width: 600px) {
        @include fullheight(0.65);
      }
    }
  }

  .anno {
    box-shadow: var(--shadow-2);
    max-width: 100%;
    position: relative;
    // Sinks by exactly its own height, as the old `bottom` offset did —
    // but as a transform, which costs no layout.
    transform: translateY(var(--anno-y, 0px));

    aside {
      text-wrap: balance;
      position: absolute;
      bottom: 0;
      left: 0;
      width: -webkit-fill-available;
      padding: var(--space-s) var(--space-l);
      color: var(--purple);
      text-align: center;
      font-family: var(--font-display);
      margin-bottom: 0;
      backdrop-filter: blur(5px);
      background-color: rgba($color: #fafafa, $alpha: 0.75);

      @media (--md-n-below) {
        padding: var(--space-s) var(--space-s);
        text-align: left;
        text-wrap: pretty;
      }

      @media (--sm-n-below) {
        font-size: var(--font-size--1);
      }
    }
  }

  // Same mapping as the fallback: starts once the quote's own height has
  // scrolled past, finishes at 60vh.
  @supports (animation-timeline: scroll()) {
    .anno {
      animation: anno-sink linear both;
      animation-timeline: scroll(root block);
      animation-range: var(--anno-h, 0px) 60vh;
    }

    @keyframes anno-sink {
      from {
        transform: translateY(0);
      }
      to {
        transform: translateY(var(--anno-h, 0px));
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .anno {
      animation: none;
      transform: none;
    }
  }
</style>
