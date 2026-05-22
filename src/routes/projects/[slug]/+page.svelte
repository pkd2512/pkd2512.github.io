<script>
  import MetaTags from '$lib/components/ui/MetaTags/index.svelte';
  import Intro from '$lib/components/custom/projects/ProjectIntro/index.svelte';
  import getAdjacentProjects from '$utils/getAdjacentProjects.js';
  import ProjectNav from '$lib/components/custom/projects/ProjectNav/index.svelte';

  let { data } = $props();

  // @ts-ignore
  data.adjacent = getAdjacentProjects(
    data.meta,
    // @ts-ignore
    data.contents.filter((d) => d.type === 'project')
  );

  console.log(data);
</script>

<MetaTags
  title="{data.meta.title}"
  description="{data.meta.description}"
  keywords="{data.meta.keywords}"
  image="{data.meta.image}"
  meta="{data.meta}"
/>

<Intro meta="{data.meta}" />

<data.content />

<ProjectNav />
