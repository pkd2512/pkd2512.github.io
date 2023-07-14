<script>
  import Logo from '$lib/components/ui/Logo/index.svelte';
  import CircleType from 'circletype';
  import { onMount } from 'svelte';
  import remToPixels from '$utils/remToPixels';

  /**
   * @type {HTMLDivElement}
   */
  let circleTextEl;

  let circleText;
  onMount(
    () =>
      (circleText = new CircleType(circleTextEl)
        .dir(1)
        .radius(0.5 * parseInt(remToPixels(8.2).toString()))
        .forceWidth())
  );
</script>

<div class="emblem">
  <div class="logo">
    <Logo size="3rem" colour="var(--white)" />
  </div>
  <div class="text" bind:this="{circleTextEl}">
    &nbsp;Developer&nbsp;&middot;&nbsp;Dreamer&nbsp;&middot;&nbsp;Designer&nbsp;&middot;
  </div>
</div>

<style lang="scss">
  .emblem {
    pointer-events: none;
    width: 10rem;
    height: 10rem;
    background-color: var(--purple-soft);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .logo {
      position: absolute;
    }

    .text {
      color: var(--white);
      font-weight: var(--font-weight-regular);
      letter-spacing: var(--letter-spaced);

      transform-origin: center;
      transform: rotate3d(0, 0, 1, 0deg);
    }
  }
</style>
