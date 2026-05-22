<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import MetaTags from '$lib/components/ui/MetaTags/index.svelte';

  /**
   * Contents of the page from the md file.
   */
  let { data } = $props();

  let { title, description, keywords, image } = data.meta;
</script>

<MetaTags
  title="{title}"
  description="{description}"
  keywords="{keywords}"
  image="{image}"
  meta="{data.meta}"
/>

<svelte:component this="{data.content}" />
