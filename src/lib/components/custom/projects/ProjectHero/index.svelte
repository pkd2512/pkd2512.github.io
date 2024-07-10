<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import ParallaxHero from '$lib/components/ui/ParallaxHero/index.svelte';
  import { assets } from '$app/paths';
  import { onMount } from 'svelte';

  import { scaleLinear } from 'd3-scale';

  /**
   * @type {{ intro: { img: String; quote: String; }; }}
   */
  export let meta;

  /**
   * @type {number}
   */
  let infoHeight;

  /**
   * @type {number}
   */
  let windowHeight;

  /**
   * @type {number}
   */
  let bottom;

  const makeParallax = (/** @type {number | undefined} */ pos) => {
    return scaleLinear()
      .clamp(true)
      .domain([infoHeight, 0.6 * windowHeight])
      .range([0, -infoHeight])(pos);
  };

  onMount(() => {
    window.addEventListener('scroll', () => {
      bottom = makeParallax(window.scrollY);
    });
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
