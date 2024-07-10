<script>
  import MetaTags from '$lib/components/ui/MetaTags/index.svelte';

  /**
   * Contents of the page from the md file.
   */
  export let data;

  let { title, description, keywords, image } = data.meta;
</script>

<MetaTags
  title="{title}"
  description="{description}"
  keywords="{keywords}"
  image="{image}"
/>

<svelte:component this="{data.content}" />
