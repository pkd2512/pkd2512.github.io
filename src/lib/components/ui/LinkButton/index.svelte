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
</script>

<a {...$$restProps} href="{url}" target="{target}">
  {@html label}
</a>

<style lang="scss">
  a {
    padding: var(--space-3xs);
    padding-top: var(--space-2xs);

    &:not(:last-child) {
      margin-right: var(--space-xs);
    }
    text-decoration: none;

    text-transform: uppercase;
    font-size: var(--font-size--1);
    font-family: var(--font-display);
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spaced-more);

    transition: all 0.15s linear;
    // border-radius: 0.25rem;

    &:hover,
    &:active {
      background-color: var(--white-soft);
      font-weight: var(--font-weight-bold);
      border-bottom: 0.25rem solid var(--purple);
    }
  }
</style>
