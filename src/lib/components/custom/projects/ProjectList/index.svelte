<script>
  import Container from '$lib/components/ui/Container/index.svelte';

  /**
   * @param posts - list of projects and metadata
   * @type {any[]}
   */
  export let posts;

  /**
   * @param {String} title - title of the section
   */
  export let title = '';

  $: console.log(posts);
</script>

<Container width="md">
  <h2>{title}</h2>
</Container>

<Container width="lg">
  <ul class="posts">
    {#each posts as post}
      <li class="post">
        <a href="{post.slug}" class="title">{post.title}</a>
        <p class="date">{post.date}</p>
        <p class="description">{post.description}</p>
      </li>
    {/each}
  </ul>
</Container>
