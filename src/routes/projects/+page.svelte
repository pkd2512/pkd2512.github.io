<script>
  // @ts-nocheck

  import Container from '$lib/components/ui/Container/index.svelte';
  import MetaTags from '$lib/components/ui/MetaTags/index.svelte';

  export let data;

  $: contents = data?.contents.filter((d) => d.type === 'project');
</script>

<MetaTags title="Prasanta Kumar Dutta | Projects" />
<h1>Projects</h1>

<!-- Posts -->
<section>
  <ul class="posts">
    {#each contents as post}
      <li class="post">
        <a href="{post.slug}" class="title">{post.title}</a>
        <p class="date">{post.date}</p>
        <p class="description">{post.description}</p>
      </li>
    {/each}
  </ul>
</section>
