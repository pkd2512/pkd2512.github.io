<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
  import Icon from '@iconify/svelte';
</script>

<Container id="shop" width="lg">
  <div class="shop">
    <div class="icon">
      <Icon icon="material-symbols:wall-art-outline" />
    </div>

    <LinkButton
      solid="{true}"
      target=""
      url="https://www.redbubble.com/people/daPacificArt/shop"
      label="Shop art prints"
    />
  </div>
</Container>

<style lang="scss">
  .shop {
    margin-bottom: var(--space-xl);
    text-align: center;

    .icon {
      margin-block: var(--space-2xs);
      font-size: var(--font-size-2);
      :global {
        path {
          fill: var(--purple);
        }
      }
    }
  }
</style>
