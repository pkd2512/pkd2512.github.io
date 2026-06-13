<script>
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import ProjectList from '$lib/components/custom/projects/ProjectList/index.svelte';

  let data = $derived(
    page.data.contents
      .filter((/** @type {{ type: string; }} */ d) => d.type === 'project')
      // @ts-ignore
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  );

  let cols = $state(3);

  onMount(() => {
    const mq1 = window.matchMedia('(max-width: 1200px)');
    const mq2 = window.matchMedia('(width < 850px)');

    const update = () => {
      if (mq2.matches) cols = 1;
      else if (mq1.matches) cols = 2;
      else cols = 3;
    };

    mq1.addEventListener('change', update);
    mq2.addEventListener('change', update);
    update();

    return () => {
      mq1.removeEventListener('change', update);
      mq2.removeEventListener('change', update);
    };
  });

  let displayData = $derived(cols === 2 ? data.slice(0, 4) : data.slice(0, 3));
</script>

<section id="recent-projects">
  <ProjectList posts={displayData} />
</section>

<style lang="scss">
  #recent-projects {
    margin-bottom: var(--space-2xl-3xl);
    margin-top: calc(1.5 * var(--space-3xl));
    padding-block-start: calc(0.5 * var(--grid-gutter));
  }
</style>
