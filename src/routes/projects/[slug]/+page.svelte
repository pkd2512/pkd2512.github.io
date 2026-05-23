<script>
  import MetaTags from '$lib/components/ui/MetaTags/index.svelte';
  import Intro from '$lib/components/custom/projects/ProjectIntro/index.svelte';
  import getAdjacentProjects from '$utils/getAdjacentProjects.js';
  import ProjectNav from '$lib/components/custom/projects/ProjectNav/index.svelte';

  let { data } = $props();

  let meta = $derived(data.meta);
  let Page = $derived(data.content);

  let adjacent = $derived(
    getAdjacentProjects(
      data.meta,
      data.contents.filter((d) => d.type === 'project')
    )
  );
</script>

<MetaTags
  title={meta.title}
  description={meta.description}
  keywords={meta.keywords}
  image={meta.image}
  {meta}
/>

<Intro meta={data.meta} />

<Page />

<ProjectNav {adjacent} />
