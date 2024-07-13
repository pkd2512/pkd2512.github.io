<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import { range } from 'd3-array';
  import Modal from '$lib/components/ui/Modal/index.svelte';
  import ImageSlideshow from '$lib/components/ui/ImageSlideshow/index.svelte';

  let images = range(33).map((i) => `${i + 1}.webp`);
  let showModal = false;
</script>

<Container style="text-align:center;">
  <button on:click="{() => (showModal = true)}"> Show screens </button>

  <div class="screens">
    <Modal bind:showModal="{showModal}">
      <ImageSlideshow images="{images}" />
    </Modal>
  </div>
</Container>

<style lang="scss">
  .screens {
    :global(img) {
      display: block;
      box-shadow: 0 1px 16px 12px
        hsl(var(--shadow-color) / calc(var(--shadow-strength) + 50%));
    }

    :global(svg path) {
      fill: var(--white);
    }
  }
</style>
