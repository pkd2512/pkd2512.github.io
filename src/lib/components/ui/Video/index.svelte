<script>
  import Icon from '@iconify/svelte';
  import { assets } from '$app/paths';

  /**
   * @param {string} id - The ID of the video.
   */
  export let id;

  /**
   * @param {string} url - The URL of the video.
   */
  export let url;

  /**
   * @param {string} poster - The URL of the video poster image.
   */
  export let poster;

  /**
   * @param {string} alt - The alternative text for the video.
   */
  export let alt = 'video';

  /**
   * @param {string} caption - The caption for the video.
   */
  export let caption;

  let iconSize = 24;

  let time = 0;
  /**
   * @type {number}
   */
  let duration;
  let paused = true;
  let showControls = true;
  // @ts-ignore
  $: progress = duration ? Number.parseFloat(time / duration).toFixed(3) : 0;

  /**
   * @type {string | number | NodeJS.Timeout | undefined}
   */
  let showControlsTimeout;

  // Used to track time of last mouse down event
  /**
   * @type {number | Date}
   */
  let lastMouseDown;

  // @ts-ignore
  const handleMove = (e) => {
    // Make the controls visible, but fade out after
    // 2.5 seconds of inactivity
    clearTimeout(showControlsTimeout);
    showControlsTimeout = setTimeout(() => (showControls = false), 1500);
    showControls = true;

    if (!duration) return; // video not loaded yet
    if (e.type !== 'touchmove' && !(e.buttons & 1)) return; // mouse not down

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const { left, right } = e.target.getBoundingClientRect();

    time = (duration * (clientX - left)) / (right - left);
  };

  // we can't rely on the built-in click event, because it fires
  // after a drag — we have to listen for clicks ourselves
  // @ts-ignore
  function handleMousedown(e) {
    lastMouseDown = new Date();
  }

  // @ts-ignore
  function handleMouseup(e) {
    // @ts-ignore
    if (new Date() - lastMouseDown < 300) {
      if (paused) e.target.play();
      else e.target.pause();
    }
  }
</script>

<figure>
  <div class="wrapper" id="{id}">
    <video
      playsinline
      autoplay
      controlslist="nodownload noremoteplayback"
      on:mousemove="{handleMove}"
      on:touchmove|preventDefault="{handleMove}"
      on:mousedown="{handleMousedown}"
      on:mouseup="{handleMouseup}"
      bind:currentTime="{time}"
      bind:duration="{duration}"
      bind:paused="{paused}"
      src="{assets}/{url}"
      poster="{assets}/{poster}"
    >
      <track kind="captions" />
      <meta itemprop="description" content="{alt}" />
    </video>

    <div
      class="controls"
      style="--progress:{progress}; --icon-size: {iconSize}px; opacity: {duration &&
      showControls
        ? 1
        : 0}"
    >
      {#if paused}
        <Icon
          icon="mdi:play-circle-outline"
          width="{iconSize}"
          height="{iconSize}"
        />
      {:else}
        <Icon
          icon="mdi:motion-pause-outline"
          width="{iconSize}"
          height="{iconSize}"
        />
      {/if}

      <progress value="{time / duration || 0}"></progress>
    </div>
  </div>
  {#if caption}
    <figcaption>
      {caption}
    </figcaption>
  {/if}
</figure>

<style lang="scss">
  .wrapper {
    position: relative;
  }

  figcaption {
    max-width: var(--md);
    margin-block-start: var(--space-xs);
    margin-inline: auto;
  }

  video {
    width: 100%;
  }

  .controls {
    margin-inline: auto;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 6px;
    width: 100%;
    // max-width: var(--md);
    transition: opacity 1s;
    pointer-events: none;

    :global(svg) {
      position: absolute;
      left: calc((var(--progress) * 100%) - (0.5 * var(--icon-size)));
      background: var(--white-soft);
      border-radius: 24px;
    }

    :global(svg path) {
      fill: var(--purple);
    }
  }

  progress {
    display: block;
    width: 100%;
    height: 3px;
    -webkit-appearance: none;
    appearance: none;
  }

  progress::-webkit-progress-bar {
    background-color: var(--gray-soft);
  }

  progress::-webkit-progress-value {
    background-color: var(--purple-soft);
  }
</style>
