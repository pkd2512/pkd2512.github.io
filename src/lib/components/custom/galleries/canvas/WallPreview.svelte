<script>
  import {
    tileStyle,
    masonryContainerStyle,
    makePerm,
    calcMasonryWidth,
  } from './infiniteCanvas.js';
  import { thumbUrl } from '../data/mediaUrl.js';

  /**
   * Static render of a group's wall, laid out exactly as InfiniteCanvas lays
   * it out, so the gallery can take over from it without a visible cut. The
   * tile CSS below mirrors InfiniteCanvas's resting tile — keep them in step.
   *
   * `x`/`y` place the top-left of the cards; `height` reports the masonry's
   * unscaled height so the parent can position the wall.
   *
   * @type {{
   *   items: Array<{img_url: string, aspect: number}>,
   *   seed: string,
   *   frameW: number,
   *   gap: number,
   *   scale: number,
   *   x: number,
   *   y: number,
   *   height?: number
   * }}
   */
  let {
    items,
    seed,
    frameW,
    gap,
    scale,
    x,
    y,
    // No fallback: Svelte rejects binding an undefined parent value to a
    // bindable prop that has one.
    height = $bindable(),
  } = $props();

  let perm = $derived(makePerm(seed));
  let width = $derived(calcMasonryWidth(items.length, frameW, gap));
</script>

<div
  class="wall"
  style="transform: translate({x}px, {y}px) scale({scale}); --frame-width: {frameW}px; --gap: {gap}px; --row-h: {frameW /
    100}px; --inv: {1 / scale};"
>
  <div
    class="masonry-inner"
    style={masonryContainerStyle(width, frameW, gap)}
    bind:clientHeight={height}
  >
    {#each items as it, i (it.img_url + '#' + i)}
      <div class="tile" style={tileStyle(it, seed, i, perm, frameW, gap)}>
        <div class="tile-inner">
          <img
            src={thumbUrl(it.img_url, 300)}
            alt=""
            decoding="async"
            draggable="false"
          />
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .wall {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 0;
    pointer-events: none;
  }

  .masonry-inner {
    grid-auto-rows: var(--row-h);
  }

  .tile {
    aspect-ratio: var(--w) / var(--h);
    width: 100%;
    grid-row: span var(--span);
    align-self: start;
    content-visibility: auto;
    contain-intrinsic-size: var(--frame-width) var(--frame-width);
  }

  .tile-inner {
    position: absolute;
    inset: calc(var(--gap) / 2);
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    /* On-screen frame width follows the zoom: 1px at the 0.25x overview,
       3px from full size up. Same formula in WallPreview and InfiniteCanvas
       so the gallery takes over from the chart without a jump. */
    --ow: clamp(1px, (1px / var(--inv, 1) - 0.25px) * 2.667 + 1px, 3px);
    outline: calc(var(--ow) * var(--inv, 1)) solid var(--purple-soft);
    background-color: #fff;
  }

  img {
    width: 100%;
    height: 100%;
    padding: 2.5%;
    box-sizing: border-box;
    object-fit: contain;
    display: block;
  }
</style>
