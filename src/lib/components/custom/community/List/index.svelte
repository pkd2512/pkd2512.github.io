<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import ListItem from '$lib/components/custom/community/ListItem/index.svelte';
  import slugify from '$utils/slugify';
  import isUpcoming from '$utils/isUpcoming';
  import { onMount } from 'svelte';

  let { content = [], title = '' } = $props();

  // Re-evaluated in the browser so the badge flips on the day, not on the next deploy.
  let now = $state(new Date());
  onMount(() => (now = new Date()));

  let sorted = $derived(
    [...content].sort((a, b) => new Date(b.date) - new Date(a.date))
  );
</script>

{#if sorted.length > 0}
  <Container width="fluid">
    <div class="list-wrapper">
      <h2 id={slugify(title)}>{title}</h2>
      <ul>
        {#each sorted as item}
          <ListItem {item} upcoming={isUpcoming(item.date, now)} />
        {/each}
      </ul>
    </div>
  </Container>
{/if}

<style lang="scss">
  @use 'src/lib/styles/mixins/sectionTitle' as *;
  h2 {
    @include sectionTitle;
  }

  ul {
    padding: 0;
    margin-block: var(--space-m);
    column-count: 2;
    column-gap: var(--space-l);

    @media (--md-n-below) {
      column-count: 1;
    }
  }

</style>
