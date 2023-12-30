<script>
  // @ts-nocheck
  import { Map } from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import { onMount, afterUpdate, onDestroy } from 'svelte';
  import { env } from '$env/dynamic/public';

  /**
   * @param {String} chapter Name of active chapter
   */
  export let activeChapter = '';

  $: console.log(activeChapter);

  let map;
  let mapContainer;
  let chapters;
  let windowWidth = 0;

  // Map props corresponding to the places chapters for desktop and mobile
  $: if (windowWidth < 768) {
    chapters = {
      Opening: {
        bearing: 0,
        center: [75.67555805096436, 19.16551504383851],
        zoom: 3.2,
        pitch: 45,
        maxZoom: 5,
      },
      Amritsar: {
        bearing: -35,
        center: [75.68727914869692, 31.9584518165087],
        zoom: 6.5,
        pitch: 45,
        maxZoom: 12.1,
      },
      Palampur: {
        bearing: -35,
        center: [76.61724697513705, 32.07697236483118],
        zoom: 10,
        pitch: 45,
        maxZoom: 12,
        speed: 0.69,
      },
      Andretta: {
        bearing: 21,
        center: [76.56561167753148, 32.03723247076803],
        zoom: 15.4,
        pitch: 60,
        maxZoom: 16.5,
        speed: 0.69,
      },
      'Wah Tea Estate': {
        bearing: 28.8,
        center: [76.55348119511552, 32.091809775256934],
        zoom: 12,
        pitch: 45,
        maxZoom: 14,
        speed: 0.69,
      },
      Ashapuri: {
        bearing: 9.6,
        center: [76.7056679896466, 31.85956834559414],
        zoom: 10,
        pitch: 35,
        maxZoom: 11.5,
        speed: 0.69,
      },
      Baijnath: {
        bearing: 0,
        center: [76.63416322088835, 32.069179195570115],
        zoom: 12.2,
        pitch: 60,
        maxZoom: 13.5,
        speed: 0.69,
      },
      'Bir-Billing': {
        bearing: 40,
        center: [76.7301326957695, 32.05757235949123],
        zoom: 11.5,
        pitch: 40,
        maxZoom: 13,
        speed: 0.69,
      },
    };
  } else {
    chapters = {
      Opening: {
        bearing: 0,
        center: [78.365309, 20.225282],
        zoom: 5,
        pitch: 45,
        maxZoom: 5,
      },
      Amritsar: {
        bearing: -35,
        center: [75.92305318958245, 31.74288500970745],
        zoom: 8.2,
        pitch: 45,
        maxZoom: 12.1,
      },
      Palampur: {
        bearing: -35,
        center: [76.64597012574859, 32.07353259002102],
        zoom: 11,
        pitch: 45,
        maxZoom: 12,
        speed: 0.69,
      },
      Andretta: {
        bearing: 21,
        center: [76.56615374230614, 32.03766792690715],
        zoom: 16.3,
        pitch: 60,
        maxZoom: 16.5,
        speed: 0.69,
      },
      'Wah Tea Estate': {
        bearing: 28.8,
        center: [76.55468340701486, 32.08059484693874],
        zoom: 13.6,
        pitch: 45,
        maxZoom: 14,
        speed: 0.69,
      },
      Ashapuri: {
        bearing: 9.6,
        center: [76.6972066282583, 31.84099457082523],
        zoom: 11.4,
        pitch: 35,
        maxZoom: 11.5,
        speed: 0.69,
      },
      Baijnath: {
        bearing: 0,
        center: [76.63541299172641, 32.08095014508136],
        zoom: 12.5,
        pitch: 60,
        maxZoom: 13.5,
        speed: 0.69,
      },
      'Bir-Billing': {
        bearing: 40,
        center: [76.73028711948291, 32.05158797135131],
        zoom: 12.3,
        pitch: 40,
        maxZoom: 13,
        speed: 0.69,
      },
    };
  }

  // Draw the map
  onMount(() => {
    map = new Map({
      container: mapContainer,
      accessToken: env.PUBLIC_MAPBOX_TOKEN,
      style: 'mapbox://styles/pkddapacific/clqrro3qz00tu01qych922aj6',
      center: chapters.Opening.center,
      zoom: chapters.Opening.zoom,
      bearing: chapters.Opening.bearing,
      pitch: chapters.Opening.pitch,
      maxZoom: chapters.Opening.maxZoom,
      minZoom: 3,
    });
  });

  afterUpdate(() => {
    if (map) map.resize();
  });

  onDestroy(() => {
    if (map) map.remove();
  });

  // Update map using fly to
  const updateMap = (props) => {
    if (!props) return;
    map.setMaxZoom(props.maxZoom);
    map.flyTo(props);
  };

  $: if (activeChapter && map) {
    updateMap(chapters[activeChapter] || '');
  }
</script>

<svelte:window bind:innerWidth="{windowWidth}" />

<div class="map" bind:this="{mapContainer}"></div>

<style lang="scss">
  @import 'src/lib/styles/mixins/fullHeight';

  .map {
    @include fullheight;
    margin: 0;
  }
</style>
