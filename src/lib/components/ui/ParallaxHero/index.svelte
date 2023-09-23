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
    width: auto;
    @include fullheight(0.9);

    background-image: var(--img);
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-position-x: center;
    background-color: hsl(269, 33%, 22%);
    background-blend-mode: luminosity;
    filter: saturate(0.75);

    // &:before {
    //   content: '';
    //   @include fullheight(0.9);
    //   width: 100%;
    //   will-change: transform;
    //   z-index: -1;
    //   position: fixed;
    //   top: 0;
    //   left: 0;
    //   background-image: var(--img);
    //   background-size: cover;
    //   background-repeat: no-repeat;
    //   background-position-x: center;
    //   background-color: hsl(269, 33%, 22%);
    //   background-blend-mode: luminosity;
    //   filter: saturate(0.75);
    // }

    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
</style>
