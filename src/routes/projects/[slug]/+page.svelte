<script>
  import MetaTags from '$lib/components/ui/MetaTags/index.svelte';
  import Intro from '$lib/components/custom/projects/ProjectIntro/index.svelte';
  import getAdjacentProjects from '$utils/getAdjacentProjects.js';

  export let data;

  $: if (data) {
    // @ts-ignore
    data['adjacent'] = getAdjacentProjects(
      data.meta,
      // @ts-ignore
      data.contents.filter((d) => d.type === 'project')
    );
  }
</script>

<MetaTags
  title="{data.meta.title}"
  description="{data.meta.description}"
  keywords="{data.meta.keywords}"
  image="{data.meta.image}"
/>

<Intro meta="{data.meta}" />

<svelte:component this="{data.content}" />
