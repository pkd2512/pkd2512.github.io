<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import ParallaxHero from '$lib/components/ui/ParallaxHero/index.svelte';
  import { assets } from '$app/paths';

  import { scaleLinear } from 'd3-scale';

  /**
   * @type {{ meta: { intro: { img: String; quote: String; }; } }}
   */
  let { meta } = $props();

  /**
   * @type {number | undefined}
   */
  let infoHeight = $state();

  /**
   * @type {number | undefined}
   */
  let windowHeight = $state();

  /**
   * @type {number | undefined}
   */
  let bottom = $state();

  const makeParallax = (/** @type {number | undefined} */ pos) => {
    if (!infoHeight || !windowHeight) return 0;
    return scaleLinear()
      .clamp(true)
      .domain([infoHeight, 0.6 * windowHeight])
      .range([0, -infoHeight])(pos);
  };

  $effect(() => {
    const handleScroll = () => {
      bottom = makeParallax(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<svelte:window bind:innerHeight="{windowHeight}" />

<div class="img">
  <ParallaxHero img="{assets}/media/{meta.intro.img}" />
</div>

<Container width="fluid">
  <div class="anno" style="bottom:{bottom}px">
    <aside bind:clientHeight="{infoHeight}">
      {@html meta.intro.quote}
    </aside>
  </div>
</Container>

<style lang="scss">
  @import 'src/lib/styles/mixins/index';

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
</style>
