<script>
  let {
    width = '',
    grid = false,
    children,
    style: styleProp = '',
    ...restProps
  } = $props();

  let cls = $derived(
    width !== '' ? `container-${width}` : grid ? 'container-grid' : 'container'
  );

  let containerStyle = $derived(
    width && width !== 'fluid'
      ? `max-width:var(--${width});${styleProp}`
      : styleProp
  );
</script>

<div {...restProps} class={cls} style={containerStyle}>
  {@render children()}
</div>

<style lang="scss">
  .container,
  [class^='container-'] {
    display: block;
    width: auto;
    margin-inline: auto;
    padding-inline: var(--grid-gutter);
  }

  .container-grid {
    display: grid;
    max-width: var(--grid-max-width);
  }

  .container-fluid {
    max-width: none;
    padding-inline: 0;
  }
</style>
