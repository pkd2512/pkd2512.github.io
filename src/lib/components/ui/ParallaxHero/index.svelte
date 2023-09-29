<script>
  /**
   * @param {String} img
   * url of background image
   */
  export let img = '';

  /**
   * @param {String}
   * background-y position
   */
  export let vPos = 'center';
</script>

<div class="hero" style="--img: url({img}); --y:{vPos}">
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

    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
</style>
