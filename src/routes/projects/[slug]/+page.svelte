<script>
  import MetaTags from '$lib/components/ui/MetaTags/index.svelte';
  import Intro from '$lib/components/custom/projects/ProjectIntro/index.svelte';
  export let data;

  // $: console.log(data);

  let { title, description, keywords, image } = data.meta;
</script>

<MetaTags
  title="{title}"
  description="{description}"
  keywords="{keywords}"
  image="{image}"
/>

<Intro />

<svelte:component this="{data.content}" />
