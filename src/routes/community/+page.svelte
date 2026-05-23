<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import MetaTags from '$lib/components/ui/MetaTags/index.svelte';

  /**
   * Contents of the page from the md file.
   */
  let { data } = $props();

  let meta = $derived(data.meta);
  let Page = $derived(data.content);
</script>

<MetaTags
  title={meta.title}
  description={meta.description}
  keywords={meta.keywords}
  image={meta.image}
  meta={data.meta}
/>

<Page />
