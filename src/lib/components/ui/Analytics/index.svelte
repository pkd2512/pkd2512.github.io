<script context="module">
  import { registerPageview as registerGAPageview } from '$utils/googleAnalytics';

  /** Register virtual pageviews when using client-side routing in multipage applications. */
  export function registerPageview() {
    registerGAPageview();
  }
</script>

<script>
  import { onMount } from 'svelte';
  import googleAnalytics from '$utils/googleAnalytics';

  onMount(() => {
    googleAnalytics();
  });
</script>
