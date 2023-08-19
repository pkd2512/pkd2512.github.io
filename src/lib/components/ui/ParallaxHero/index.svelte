<script>
  /**
   * @param {String} img
   * url of background image
   */
  export let img = '/media/pexels-prasanta-kr-dutta-104361.jpg';
</script>

<div class="hero" style="background-image: url({img});">
  <slot />
</div>

<style lang="scss">
  @import 'src/lib/styles/mixins/fullHeight';
  .hero {
    width: auto;
    @include fullheight(0.9);
    background-size: cover;
    background-repeat: no-repeat;
    background-position-x: center;
    background-attachment: fixed;
    background-color: hsl(269, 33%, 22%);
    background-blend-mode: luminosity;
    filter: saturate(0.75);

    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
</style>
