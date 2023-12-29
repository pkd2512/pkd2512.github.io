<script>
  import { Map } from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import { onMount, onDestroy } from 'svelte';
  import { env } from '$env/dynamic/public';

  // @ts-ignore
  let map;
  /**
   * @type {HTMLDivElement}
   */
  let mapContainer;
  let lng, lat, zoom;

  onMount(() => {
    map = new Map({
      container: mapContainer,
      accessToken: env.PUBLIC_MAPBOX_TOKEN,
      style: 'mapbox://styles/pkddapacific/cjftgscmo2pzt2rpgjky1aykh',
      center: [80.67555805096436, 19.16551504383851],
      zoom: 5,
      bearing: 0,
      pitch: 45,
      minZoom: 3,
    });
  });

  onDestroy(() => {
    if (map) map.remove();
  });
</script>

<div class="map" bind:this="{mapContainer}"></div>

<style lang="scss">
  @import 'src/lib/styles/mixins/fullHeight';

  .map {
    @include fullheight;
    margin: 0;
  }
</style>
