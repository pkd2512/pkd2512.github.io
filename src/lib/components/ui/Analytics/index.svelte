<script>
  import { onMount } from 'svelte';
  import { registerPageview as registerGAPageview } from '$utils/googleAnalytics';
  import googleAnalytics from '$utils/googleAnalytics';

  /** Register virtual pageviews when using client-side routing in multipage applications. */
  export function registerPageview() {
    registerGAPageview();
  }

  onMount(() => {
    googleAnalytics();
  });
</script>
