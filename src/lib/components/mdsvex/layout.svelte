<script module>
  import img from '$lib/components/ui/Image/index.svelte';

  /**
   * Custom components to replace native HTML elements in mdsvex
   */
  export { img };
</script>

<script>
  let { children } = $props();
</script>

{@render children()}
