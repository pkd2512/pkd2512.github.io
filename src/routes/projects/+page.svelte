<script>
  import MetaTags from '$lib/components/ui/MetaTags/index.svelte';

  let { data } = $props();

  let meta = $derived(data.meta);
  let Page = $derived(data.content);
</script>

<MetaTags
  title={meta.title}
  description={meta.description}
  image={meta.image}
  meta={data.meta}
/>

<Page />
