<script>
  import ListItem from '$lib/components/custom/community/ListItem/index.svelte';
  import isUpcoming from '$utils/isUpcoming';
  import { onMount } from 'svelte';

  // @ts-ignore
  import talks from '/src/contents/data/talks.csv';

  let now = $state(new Date());
  onMount(() => (now = new Date()));

  // The nearest future talk; nothing renders when there isn't one.
  let next = $derived(
    talks
      .filter((t) => isUpcoming(t.date, now))
      .sort((a, b) => a.date.localeCompare(b.date))[0]
  );
</script>

{#if next}
  <ul>
    <ListItem item={next} upcoming />
  </ul>
{/if}

<style>
  ul {
    padding: 0;
    margin-block: var(--space-s) 0;
  }
</style>
