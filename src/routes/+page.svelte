<script>
  import { setContext } from 'svelte';
  import MetaTags from '$lib/components/ui/MetaTags/index.svelte';

  let { data } = $props();

  let meta = data.meta;
  let blogFeed = data.blogFeed;
  setContext('blogFeed', blogFeed);
</script>

<MetaTags
  title={meta.title}
  description={meta.description}
  keywords={meta.keywords}
  image={meta.image}
  meta={data.meta}
/>

<data.content />
