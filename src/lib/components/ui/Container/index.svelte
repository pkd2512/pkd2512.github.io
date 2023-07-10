<script>
  /**
   * @param {string} width - xxs, xs, sm, md, lg, xl, xxl, fluid.
   * Check media-sizes.scss for reference
   */
  export let width = 'md';
</script>

<div {...$$restProps} class="container-{width}">
  <slot />
</div>

<style lang="scss">
  // https://sparkbox.com/foundry/responsive_class_suffixes_automating_classes_with_sass_mixins_and_sass_maps
  // https://medium.com/the-web-crunch-publication/advanced-css-selectors-you-never-knew-about-972d8275d079

  [class^='container-'] {
    width: 100%;
    margin-inline: auto;
    padding-inline: var(--gutter-container);
  }

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
    }
  }

  .container-fluid {
    max-width: none;
    padding-inline: 0;
  }
</style>
