<script>
  import media from '$utils/media';

  /**
   * @type {any}
   */
  /**
   * @type {any}
   */
  let { src, alt } = $props();
</script>

<img src={media(src)} {alt} loading="lazy" draggable="false" />

<style>
  img {
    border-radius: 0.5rem;
  }
</style>
