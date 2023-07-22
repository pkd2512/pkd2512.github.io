<script>
  /**
   * @param {String} url
   */
  export let url = '#';

  /**
   * @param {String} label
   * Text to show
   */
  export let label = 'Read';

  /**
   * @param {String} target
   */
  export let target = '';

  /**
   * @param {Boolean} solid
   */
  export let solid = false;
</script>

<a {...$$restProps} class:solid="{solid}" href="{url}" target="{target}">
  {@html label}
</a>

<style lang="scss">
  a {
    padding: var(--space-3xs);
    padding-top: var(--space-2xs);

    // &:not(:last-child) {
    //   margin-right: var(--space-xs);
    // }
    text-decoration: none;

    text-transform: uppercase;
    font-size: var(--font-size--1);
    font-family: var(--font-display);
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spaced);

    transition: all 0.15s linear;

    &.solid {
      background-color: var(--purple-soft);
      padding-block: var(--space-xs);
      padding-inline: var(--space-s);
      color: var(--white);
      border-radius: 0.125rem;
    }

    &:hover,
    &:active {
      border-radius: 0;
      color: var(--purple);
      background-color: var(--white-soft);
      font-weight: var(--font-weight-bold);
      border-bottom: 0.25rem solid var(--purple);
    }
  }
</style>
