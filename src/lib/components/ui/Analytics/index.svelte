<script>
  import { onMount } from 'svelte';
  import { initGA } from '$utils/googleAnalytics';

  onMount(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initGA, { timeout: 3000 });
    } else {
      setTimeout(initGA, 3000);
    }
  });
</script>
