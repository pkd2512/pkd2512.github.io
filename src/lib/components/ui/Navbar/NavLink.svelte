<script>
  /**
   * @param {Boolean} disabled
   */
  export let disabled = false;

  /**
   * @param {Boolean} active - Show active link on navbar
   */
  export let active = false;

  /**
   * @param {String} url
   */
  export let url = '#';

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
  {...$$restProps}
  href="{url}"
  on:click="{handleClick}"
  class="nav-link"
  class:disabled="{disabled}"
  class:active="{active}"
>
  <slot />
</a>

<style>
  a {
    text-decoration: none;

    &.active {
      font-weight: bolder;
    }
  }
</style>
