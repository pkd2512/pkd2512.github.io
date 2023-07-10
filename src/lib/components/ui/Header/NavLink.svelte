<script>
  export let disabled = false;
  export let active = false;
  export let href = '#';

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
  href="{href}"
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
