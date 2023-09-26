<script>
  /**
   * @param {String} img
   * url of background image
   */
  export let img = '/media/pexels-prasanta-kr-dutta-104361.jpg';
</script>

<div class="hero" style="--img: url({img});">
  <slot />
</div>

<style lang="scss">
  @import 'src/lib/styles/mixins/fullHeight';
  .hero {
    width: 100%;
    @include fullheight(0.95);
    background-image: var(--img);
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-position: center;

    @media (max-width: 600px) {
      @include fullheight(0.85);
    }

    @media (--md-n-below) {
      background-attachment: unset;
      background-position-y: top;
    }

    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
</style>
