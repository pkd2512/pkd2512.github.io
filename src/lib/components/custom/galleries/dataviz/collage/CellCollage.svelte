<script>
  import { slugId, tilesForCell } from './cellCollage.js';

  /**
   * Renders the image collage for one voronoi cell — a `<clipPath>`
   * matching the polygon plus a grid of clipped `<image>` tiles.
   *
   * Lives inside the same transformed `<g>` as the cell's outline path,
   * so it scales / morphs with the cell automatically.
   *
   * @type {{
   *   cell: { polygon: [number, number][], area: number, name: string },
   *   thumbs: string[]
   * }}
   */
  let { cell, thumbs } = $props();

  let tiles = $derived(tilesForCell(cell, thumbs));
  let clipId = $derived('cellclip-' + slugId(cell.name));

  /** @param {[number,number][]} poly */
  function polyToPath(poly) {
    let d = 'M';
    for (let i = 0; i < poly.length; i++) {
      if (i > 0) d += 'L';
      d += poly[i][0].toFixed(1) + ',' + poly[i][1].toFixed(1);
    }
    return d + 'Z';
  }
</script>

{#if tiles.length}
  <defs>
    <clipPath id={clipId}>
      <path d={polyToPath(cell.polygon)}></path>
    </clipPath>
  </defs>
  <g class="collage" clip-path="url(#{clipId})">
    {#each tiles as t (t.key)}
      <image
        href={t.url}
        x={t.x}
        y={t.y}
        width={t.width}
        height={t.height}
        preserveAspectRatio="xMidYMid slice"
        transform="rotate({t.rot} {t.cx} {t.cy})"
      ></image>
    {/each}
  </g>
{/if}

<style lang="scss">
  .collage {
    pointer-events: none;
    image-rendering: auto;
  }
</style>
