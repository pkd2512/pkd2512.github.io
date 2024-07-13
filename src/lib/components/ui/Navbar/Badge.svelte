<script>
  import Logo from '$lib/components/ui/Logo/index.svelte';
  import CircleType from 'circletype';
  import GraphemeSplitter from 'grapheme-splitter';
  import { onMount, afterUpdate } from 'svelte';
  import remToPixels from '$utils/remToPixels';
  import { scaleLinear } from 'd3-scale';

  /**
   * @type {HTMLDivElement}
   */
  let circleTextEl;

  /**
   * @param {Boolean} mobile Is the badge for mobile
   */
  export let mobile = false;

  // @ts-ignore
  let circleText;

  let scrollY = 0;

  let windowHeight = 0;

  let size = mobile ? '7.5rem' : '8.75rem';

  let getRotation = (/** @type {any} */ d) => {};

  /**
   * @type {HTMLDivElement}
   */
  let badgeEl;

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
    // generate circular text
    circleText = new CircleType(circleTextEl, makeText);

    circleText.dir(1).forceWidth();

    // generate circle rotation scale
    getRotation = scaleLinear()
      .domain([0, windowHeight * 0.8])
      .range([0, 360])
      .clamp(true);
  };

  onMount(() => {
    makeCircleText();

    if (window)
      window.addEventListener('resize', () => {
        // @ts-ignore
        circleText.refresh();
      });

    return () => {
      window.removeEventListener('resize', () => {
        // @ts-ignore
        circleText.refresh();
      });
    };
  });

  afterUpdate(() => {
    // @ts-ignore
    circleText.refresh();
    circleTextEl.classList.add('visible');
  });
</script>

<svelte:window bind:scrollY="{scrollY}" bind:innerHeight="{windowHeight}" />

<div
  class="badge"
  aria-hidden="true"
  bind:this="{badgeEl}"
  style="--angle:{getRotation(scrollY)}deg; width: {size}; height: {size}"
>
  <div class="logo">
    <Logo size="{mobile ? '3rem' : '3.75rem'}" colour="var(--white)" />
  </div>
  <div class="text" bind:this="{circleTextEl}">Designer;Developer;Dreamer;</div>
</div>

<style lang="scss">
  @import 'src/lib/styles/mixins/_shadows';
  .badge {
    pointer-events: none;
    aspect-ratio: var(--ratio-square);
    background-color: var(--purple-soft);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    filter: drop-shadow(0 1px 35px hsl(269, 33%, 22%));

    background-image: url('/media/textures/small-crackle-bright.webp');
    background-blend-mode: overlay;

    box-shadow: var(--shadow-3);

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
