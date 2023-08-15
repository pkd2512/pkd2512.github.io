<script>
  import Logo from '$lib/components/ui/Logo/index.svelte';
  import CircleType from 'circletype';
  import { onMount } from 'svelte';
  import remToPixels from '$utils/remToPixels';
  import { scaleLinear } from 'd3-scale';

  /**
   * @type {HTMLDivElement}
   */
  let circleTextEl;

  let circleText;

  let scrollY = 0;

  let windowHeight = 0;

  let getRotation = (/** @type {any} */ d) => {};

  /**
   * @type {HTMLDivElement}
   */
  let badgeEl;

  onMount(() => {
    // generate circular text
    circleText = new CircleType(circleTextEl)
      .dir(1)
      .radius(0.5 * parseInt(remToPixels(7.6).toString()))
      .forceWidth();

    // generate circle rotation scale
    getRotation = scaleLinear()
      .domain([0, windowHeight * 0.8])
      .range([0, 360])
      .clamp(true);
  });
</script>

<svelte:window bind:scrollY="{scrollY}" bind:innerHeight="{windowHeight}" />

<div
  class="badge"
  aria-hidden="true"
  bind:this="{badgeEl}"
  style="--angle:{getRotation(scrollY)}deg"
>
  <div class="logo">
    <Logo size="3.75rem" colour="var(--white)" />
  </div>
  <div class="text" aria-hidden="true" bind:this="{circleTextEl}">
    &numsp;D&hairsp;e&hairsp;v&hairsp;e&hairsp;l&hairsp;o&hairsp;p&hairsp;e&hairsp;r&hairsp;&numsp;&bull;&numsp;D&hairsp;r&hairsp;e&hairsp;a&hairsp;m&hairsp;e&hairsp;r&hairsp;&numsp;&bull;&numsp;
    D&hairsp;e&hairsp;s&hairsp;i&hairsp;g&hairsp;n&hairsp;e&hairsp;r&hairsp;&numsp;&bull;
  </div>
</div>

<style lang="scss">
  @import 'src/lib/styles/mixins/_shadows';
  .badge {
    pointer-events: none;
    width: 8.5rem;
    aspect-ratio: var(--ratio-square);
    background-color: var(--purple-soft);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    background-image: url('/media/textures/small-crackle-bright.png');
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
      user-select: none;
      color: var(--white);
      font-size: var(--font-size--2);

      font-weight: var(--font-weight-regular);
      font-family: var(--font-display);
      @include text-shadow(var(--purple));
    }
  }
</style>
