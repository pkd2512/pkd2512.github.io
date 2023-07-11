<script>
  /**
   * @param {string} width - xxs, xs, sm, md, lg, xl, xxl, fluid.
   * Check media-sizes.scss for reference
   */
  export let width = '';
</script>

<div {...$$restProps} class="{width ? `container-${width}` : 'container'}">
  <slot />
</div>

<style lang="scss">
  // https://sparkbox.com/foundry/responsive_class_suffixes_automating_classes_with_sass_mixins_and_sass_maps
  // https://medium.com/the-web-crunch-publication/advanced-css-selectors-you-never-knew-about-972d8275d079

  $media-sizes: (
    'xxs': var(--xxs),
    'xs': var(--xs),
    'sm': var(--sm),
    'md': var(--md),
    'lg': var(--lg),
    'xl': var(--xl),
    'xxl': var(--xxl),
  );

  @each $key, $value in $media-sizes {
    .container-#{$key} {
      max-width: #{$value};
      width: 100%;
      margin-inline: auto;
      padding-inline: var(--gutter-container);
    }
  }

  .container {
    max-width: none;
    margin-inline: auto;
    padding-inline: var(--gutter-container);
  }

  .container-fluid {
    max-width: none;
    margin-inline: auto;
    padding-inline: 0;
  }
</style>
