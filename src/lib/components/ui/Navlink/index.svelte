<script>
  /**
   * @param {Boolean} disabled
   */
  /**
   * @param {Boolean} active - Show active link on navbar
   */
  /**
   * @param {String} url
   */
  let { disabled = false, active = false, url = '#', children, ...restProps } = $props();

  /**
   * @param {{ preventDefault: () => void; stopImmediatePropagation: () => void; }} e
   */
  function handleClick(e) {
    if (disabled) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
  }
</script>

<a
  {...restProps}
  href="{url}"
  onclick="{handleClick}"
  class="nav-link"
  class:disabled="{disabled}"
  class:active="{active}"
>
  {@render children?.()}
</a>

<style lang="scss">
  a {
    text-decoration: none;
    text-align: center;

    font-size: var(--font-size--1);
    font-family: var(--font-display);
    font-weight: var(--font-weight-light);
    letter-spacing: var(--letter-spaced-more);

    display: inline-block;
    position: relative;

    transition: all 0.15s ease;

    &:hover,
    &.active {
      font-weight: var(--font-weight-bold);
    }
  }
</style>
