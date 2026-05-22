<script>
  import { setContext } from 'svelte';
  import MetaTags from '$lib/components/ui/MetaTags/index.svelte';

  let { data } = $props();

  let { title, description, keywords, image } = data.meta;

  setContext('blogFeed', data.blogFeed);
</script>

<MetaTags
  title="{title}"
  description="{description}"
  keywords="{keywords}"
  image="{image}"
  meta="{data.meta}"
/>

<data.content />
