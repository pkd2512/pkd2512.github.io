<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import { assets } from '$app/paths';

  /**
   * @type {number}
   */
  let height;

  /**
   * @type {String}
   */
  export let img = '';

  /**
   * @type {String}
   */
  export let notes = '';

  /**
   * @type {String}
   */
  export let url = '';
</script>

<Container width="sm">
  <div
    class="award"
    bind:clientHeight="{height}"
    style="margin-block-start: -{0.35 * height}px"
  >
    <a href="{url}" target="_blank">
      <img
        src="{assets}/media/awards/{img}"
        alt="Adobe Design Achievement Awards"
      />
      <div class="notes">
        {@html notes}
      </div>
    </a>
  </div>
</Container>

<style lang="scss">
  img {
    max-width: var(--xs);
    width: 100%;
    margin-inline: auto;
  }

  a {
    text-decoration: none;
  }

  .notes {
    font-size: var(--font-size-0);
    font-family: var(--font-display);
    margin-block: var(--space-xs);
  }

  .award {
    padding: var(--space-s) var(--space-l);
    text-align: center;
    background-color: var(--white);
    z-index: var(--layer-5);
    -webkit-mask: var(--mask-edge-zig-zag-horizontal);
    box-shadow: var(--shadow-5);
    margin-block: var(--space-xl);
    margin-inline: auto;
  }
</style>
