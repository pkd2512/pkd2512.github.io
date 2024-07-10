<script>
  import Icon from '@iconify/svelte';
  import Container from '$lib/components/ui/Container/index.svelte';
  import { assets } from '$app/paths';

  /**
   * @type {string | any[]}
   * List of image urls
   */
  export let images = [];

  $: index = 0;

  const handlePrev = (/** @type {any} */ e) => {
    if (index === 0) return;
    index = index > 0 ? index - 1 : images.length - 1;
  };
  const handleNext = (/** @type {any} */ e) => {
    if (index === images.length - 1) return;
    index = index < images.length - 1 ? index + 1 : 0;
  };
</script>

<Container
  id="screens"
  style="display:flex; justify-content:center; align-items:stretch;"
>
  <div class="icon prev" on:click="{handlePrev}">
    {#if index > 0}
      <Icon
        icon="pajamas:chevron-lg-left"
        style="color:var(--purple-soft)"
        width="36"
        height="36"
      />
    {/if}
  </div>
  <img
    src="{assets}/media/projects/soulace/screens/{images[index]}"
    alt="Mockup of a screen of the app"
    loading="lazy"
    draggable="false"
  />
  <div class="icon next" on:click="{handleNext}">
    {#if index < images.length - 1}
      <Icon
        icon="pajamas:chevron-lg-right"
        style="color:var(--purple-soft)"
        width="36"
        height="36"
      />
    {/if}
  </div>
</Container>

<style lang="scss">
  img {
    user-select: none;
  }
  .icon {
    width: 3rem;
    display: flex;
    align-items: center;

    :global(svg) {
      transition: all 0.3s ease;
    }

    &.prev:hover {
      :global(svg) {
        transform: translateX(-5px);
      }
    }
    &.next:hover {
      :global(svg) {
        transform: translateX(5px);
      }
    }
  }
</style>
