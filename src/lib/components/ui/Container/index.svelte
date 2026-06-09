<script>
  let { width = '', grid = false, children, ...restProps } = $props();
</script>

<div
  {...restProps}
  class={[width === 'fluid' ? 'container-fluid' : 'container', grid && 'grid'].filter(Boolean).join(' ')}
>
  {@render children()}
</div>

<style lang="scss">
  .container {
    max-width: var(--grid-max-width);
    width: auto;
    display: block;
    margin-inline: auto;
    padding-inline: var(--grid-gutter);
  }

  .container-fluid {
    max-width: none;
    display: block;
    margin-inline: auto;
    padding-inline: 0;
  }
</style>
