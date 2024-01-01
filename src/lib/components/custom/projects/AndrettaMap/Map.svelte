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

  // $: console.log(windowWidth);

  let map;
  let chapters;
  let mapContainer;
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
      Closing: {
        bearing: 0,
        center: [75.67555805096436, 19.16551504383851],
        zoom: 3.2,
        pitch: 45,
        maxZoom: 5,
      },
    };
  } else {
    chapters = {
      Opening: {
        bearing: 0,
        center: [80.67555805096436, 19.16551504383851],
        zoom: 5,
        pitch: 45,
        maxZoom: 5,
      },
      Amritsar: {
        bearing: -35,
        center: [76.7, 31.74288500970745],
        zoom: 8.2,
        pitch: 45,
        maxZoom: 12.1,
      },
      Palampur: {
        bearing: -35,
        center: [76.7, 32.07353259002102],
        zoom: 11,
        pitch: 45,
        maxZoom: 12,
        speed: 0.69,
      },
      Andretta: {
        bearing: 21,
        center: [76.569, 32.03766792690715],
        zoom: 15.7,
        pitch: 60,
        maxZoom: 16.5,
        speed: 0.69,
      },
      'Wah Tea Estate': {
        bearing: 28.8,
        center: [76.57, 32.08059484693874],
        zoom: 13.6,
        pitch: 45,
        maxZoom: 14,
        speed: 0.69,
      },
      Ashapuri: {
        bearing: 9.6,
        center: [76.8, 31.84099457082523],
        zoom: 11,
        pitch: 35,
        maxZoom: 11.5,
        speed: 0.69,
      },
      Baijnath: {
        bearing: 0,
        center: [76.66, 32.08095014508136],
        zoom: 12.5,
        pitch: 60,
        maxZoom: 13.5,
        speed: 0.69,
      },
      'Bir-Billing': {
        bearing: 40,
        center: [76.73, 32.01],
        zoom: 12,
        pitch: 40,
        maxZoom: 13,
        speed: 0.69,
      },
      Closing: {
        bearing: -35,
        center: [76.7, 31.98],
        zoom: 10.5,
        pitch: 45,
        maxZoom: 12,
        speed: 0.69,
      },
    };
  }

  // Animate flight path opening

  let origin = [77.5901, 13.1];
  let flight = [77.5901, 14.5];
  let destination1 = [77.218, 28.462];
  let destination = [74.8753, 31.6364];

  // A simple line from origin to destination.
  let route = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [origin, destination1, destination],
        },
      },
    ],
  };

  let point = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: origin,
        },
      },
    ],
  };
  let flightPoint = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: flight,
        },
      },
    ],
  };

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

    // Add a source and layer displaying a point which will be animated in a circle.
    map.on('load', () => {
      map.addSource('route', {
        type: 'geojson',
        data: route,
      });

      map.addLayer({
        id: 'route',
        source: 'route',
        type: 'line',
        paint: {
          'line-width': 2,
          'line-color': '#ffc107',
          'line-opacity': 0.8,
          'line-blur': 1,
        },
      });

      map.addSource('flightPoint', {
        type: 'geojson',
        data: flightPoint,
      });

      map.addLayer({
        id: 'flightPoint',
        source: 'flightPoint',
        type: 'symbol',
        layout: {
          'icon-image': 'airport-15',
          'icon-allow-overlap': true,
        },
      });

      map.setLayoutProperty('flightPoint', 'icon-rotate', 3);
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
