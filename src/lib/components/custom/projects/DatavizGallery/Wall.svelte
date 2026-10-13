<script>
  import InfiniteCanvas from './canvas/InfiniteCanvas.svelte';
  // @ts-ignore
  import { getAllRows } from './data/dataviz-gallery-counts.js';
</script>

<!--
  Every graphic on one pannable wall, in the page flow. index.svelte is the
  older entry: a Voronoi chart of topics whose cells open this same wall.
-->
<InfiniteCanvas items={getAllRows()} title="Dataviz gallery" embedded />
