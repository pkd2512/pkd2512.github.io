<script>
  import Logo from '$lib/components/ui/Logo/index.svelte';
  import CircleType from 'circletype';
  import GraphemeSplitter from 'grapheme-splitter';
  import { onMount } from 'svelte';
  import remToPixels from '$utils/remToPixels';
  import { scaleLinear } from 'd3-scale';

  let { mobile = false } = $props();

  /**
   * @type {HTMLDivElement}
   */
  let circleTextEl;

  /**
   * @type {HTMLDivElement}
   */
  let badgeEl;

  /**
   * @type {any}
   */
  let circleText = $state(null);

  let scrollY = $state(0);
  let windowHeight = $state(0);

  let size = $derived(mobile ? '7.5rem' : '8.75rem');

  let getRotation = $derived(
    scaleLinear().domain([0, windowHeight * 0.8]).range([0, 360]).clamp(true)
  );

  const makeText = (/** @type {String} */ text) => {
    let chars = new GraphemeSplitter().splitGraphemes(text);

    return chars.map((c) =>
      c === ';'
        ? mobile
          ? `&nbsp;&bull;&nbsp;`
          : `&numsp;&bull;&numsp;`
        : mobile
          ? `${c}`
          : `${c}&hairsp;`
    );
  };

  const makeCircleText = () => {
    // @ts-ignore
    circleText?.destroy();
    circleText = new CircleType(circleTextEl, makeText);

    const badgeRect = badgeEl.getBoundingClientRect();
    const radius = (Math.min(badgeRect.width, badgeRect.height) / 2) * 0.75;

    circleText.dir(1).forceWidth(true).radius(radius);
  };

  onMount(() => {
    /** @type {number} */
    let rafId;

    // Fires once immediately on observe, covering the initial layout too.
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(makeCircleText);
    });

    observer.observe(badgeEl);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      // @ts-ignore
      circleText?.destroy();
    };
  });

  $effect(() => {
    if (circleText && circleTextEl) {
      // @ts-ignore
      circleText.refresh();
      circleTextEl.classList.add('visible');
    }
  });
</script>

<svelte:window bind:scrollY bind:innerHeight={windowHeight} />

<div class="wrapper">
  <div
    class="badge"
    aria-hidden="true"
    bind:this={badgeEl}
    style="--angle:{getRotation(scrollY)}deg; width: {size}; height: {size}"
  >
    <div class="logo">
      <Logo size={mobile ? '3rem' : '3.75rem'} colour="var(--white)" />
    </div>
    <div class="text" bind:this={circleTextEl}>Designer;Developer;Dreamer;</div>
  </div>
</div>

<style lang="scss">
  @use 'src/lib/styles/mixins/shadows' as *;

  .wrapper {
    border-radius: 50%;
    box-shadow: var(--shadow-3);
  }
  .badge {
    pointer-events: none;
    aspect-ratio: var(--ratio-square);
    background-color: var(--purple-soft);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    // filter: drop-shadow(0 1px 25px hsl(269, 33%, 22%));

    background-image: url('/media/textures/small-crackle-bright.webp');
    background-blend-mode: overlay;

    transform-origin: center;
    transition: transform 0.3s step-start;
    transform: rotate3d(0, 0, 1, var(--angle));

    .logo {
      position: absolute;
      @include filter-shadow(var(--purple));

      transform-origin: center;
      transition: transform 0.3s step-start;
      transform: rotate3d(0, 0, 1, calc(-1 * var(--angle)));
    }

    .text {
      text-transform: uppercase;
      user-select: none;
      color: var(--white);
      font-size: var(--font-size--2);

      font-weight: var(--font-weight-regular);
      font-family: var(--font-display);
      @include text-shadow(var(--purple));
      opacity: 0;
      transition: opacity 0.35s ease;
    }

    :global(.text.visible) {
      opacity: 1;
    }
  }
</style>
