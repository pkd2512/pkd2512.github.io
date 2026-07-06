<script>
  import Icon from '@iconify/svelte';
  import { asset } from '$app/paths';

  /**
   * @type {{ type: string; logo?: string; url?: string; label?: string; link?: boolean; inverted?: boolean; size?: string; }}
   */
  let {
    type,
    logo = '',
    url = '',
    label = '',
    link = false,
    inverted = false,
    size = '3',
  } = $props();
</script>

<div
  class="badge"
  class:clickable={link}
  class:inverted
  tabindex={link && url ? 0 : -1}
  title={type}
  style="--size:{size}rem"
>
  <Icon
    class="laurel"
    icon="hugeicons:laurel-wreath-left-02"
    height="{size}rem"
    style="color: {inverted ? 'var(--white-soft)' : 'var(--purple-soft)'}"
  />

  {#if logo}
    <img class="logo" src={asset('/media/' + logo)} alt={type} />
  {/if}

  <Icon
    class="laurel"
    icon="hugeicons:laurel-wreath-right-02"
    height="{size}rem"
    style="color: {inverted ? 'var(--white-soft)' : 'var(--purple-soft)'}"
  />
</div>

<style lang="scss">
  .badge {
    display: inline-flex;
    align-items: center;
    padding: var(--space-3xs) 0;
    background-color: var(--white-soft);
    backdrop-filter: blur(8px);
    text-decoration: none;
    cursor: default;
    transition: box-shadow 0.2s;
    font-size: var(--font-size--1);

    &.inverted {
      background-color: var(--purple-soft);
    }

    pointer-events: none;

    &.clickable {
      pointer-events: all;
    }

    &[href] {
      cursor: pointer;

      &:hover {
        box-shadow: var(--shadow-2);
      }
    }

    :global(.laurel path) {
      // stroke-width: 1px;
    }
  }

  .logo {
    width: auto;
    height: var(--size);
    object-fit: contain;
    flex-shrink: 0;

    filter: brightness(0) saturate(100%) invert(17%) sepia(38%) saturate(2250%)
      hue-rotate(237deg) brightness(94%) contrast(92%);
  }

  .badge.inverted {
    .logo {
      filter: brightness(0) saturate(100%) invert(100%) sepia(0%)
        saturate(7500%) hue-rotate(247deg) brightness(103%) contrast(103%);
    }
  }
</style>
