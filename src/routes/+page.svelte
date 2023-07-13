<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import MetaTags from '$lib/components/ui/MetaTags/index.svelte';
  import { assets } from '$app/paths';
</script>

<MetaTags />

<Container>
  <img src="{assets}/media/tree.jpg" alt="" />
</Container>

<div id="blog"></div>
<div id="about"></div>
<div id="contact"></div>
