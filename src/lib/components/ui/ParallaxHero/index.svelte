<script>
  import { scaleLinear } from 'd3-scale';
  import { onMount } from 'svelte';

  /**
   * @param {String} img
   * url of background image
   */
  export let img = '';

  /**
   * @type {number}
   */
  let windowHeight;

  /**
   * @param {String}
   * background-y position
   */
  let vPos = 10;

  const makeParallax = (/** @type {number | undefined} */ pos) => {
    return scaleLinear()
      .clamp(true)
      .domain([0, 0.9 * windowHeight])
      .range([10, -100])
      .clamp(true)(pos);
  };

  onMount(() => {
    window.addEventListener('scroll', () => {
      vPos = makeParallax(window.scrollY);
    });
  });
</script>

<svelte:window bind:innerHeight="{windowHeight}" />
<div class="hero" style="--img: url({img}); --y:{vPos}%">
  <slot />
</div>

<style lang="scss">
  @import 'src/lib/styles/mixins/fullHeight';
  .hero {
    width: 100%;
    margin-inline: auto;
    @include fullheight(0.9);
    background-image: var(--img);
    background-size: cover;

    background-repeat: no-repeat;
    background-position: center var(--y);

    @media (max-width: 600px) {
      @include fullheight(0.8);
    }

    &.parallax {
      background-attachment: fixed;
      @media (--md-n-below) {
        background-attachment: unset;
      }

      @include fullheight(0.8);
      @media (max-width: 600px) {
        @include fullheight(0.65);
      }
    }

    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
</style>
