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
      width: auto;
      display: block;
      margin-inline: auto;
      padding-inline: var(--grid-gutter);

      &.snap {
        @each $key1, $value1 in $media-sizes {
          @if $key1 != 'xxs' and $key1 != 'xs' {
            @media (--#{$key1}-n-above) {
              &:not(.skip-#{$key1}) {
                width: #{$value1};
              }
            }
          }
        }
      }
    }
  }

  .container {
    max-width: none;
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
