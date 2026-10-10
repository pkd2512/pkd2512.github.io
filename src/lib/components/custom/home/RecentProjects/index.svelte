<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import Icon from '@iconify/svelte';

  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
  import ProjectList from '$lib/components/custom/projects/ProjectList/index.svelte';

  let data = $derived(
    page.data.contents
      .filter((/** @type {{ type: string; }} */ d) => d.type === 'project')
      // @ts-ignore
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  );

  let cols = $state(2);

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
  <Container width="xxl">
    <!-- <div class="col-span-full"> -->
    <ProjectList posts={displayData} />
    <!-- </div> -->
  </Container>

  <div id="all-projects">
    <div class="icon">
      <Icon icon="icon-park-solid:more-app" />
    </div>

    <LinkButton solid={true} url="projects/" label="Show more work" />
  </div>
</section>

<style lang="scss">
  #recent-projects {
    margin-block-start: var(--space-xl);
    margin-block-end: var(--space-2xl-3xl);
    // margin-top: calc(1.5 * var(--space-3xl));
    // padding-block-start: calc(0.5 * var(--grid-gutter));
  }

  #all-projects {
    width: 100%;
    text-align: center;
    margin-block: var(--space-s);

    .icon {
      margin-block: var(--space-2xs);
      font-size: var(--font-size-1);
      :global(path) {
        fill: var(--purple);
      }
    }
  }
</style>
