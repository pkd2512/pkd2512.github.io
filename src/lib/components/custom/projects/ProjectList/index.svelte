<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import ProjectCard from '$lib/components/custom/projects/ProjectCard/index.svelte';
  import { base } from '$app/paths';

  /**
   * @param posts - list of projects and metadata
   * @type {any[]}
   */
  export let posts;

  /**
   * @type {Number}
   */
  let windowWidth;
</script>

<Container width="fluid">
  <ul class="posts">
    {#each posts as post}
      <li class="post">
        <a href="{base}/projects/{post.slug}">
          <ProjectCard info="{post}" />
        </a>
      </li>
    {/each}
  </ul>
</Container>

<style lang="scss">
  ul {
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-inline: auto;
    margin-block-end: var(--space-s);

    // define grid cols
    --cols: 3;

    @media (max-width: 1200px) {
      --cols: 2;
    }

    @media (width <850px) {
      --cols: 1;
    }
  }

  li {
    list-style: none;
    width: calc(100% / var(--cols));
    flex: auto 0 0;
  }
  a {
    text-decoration: none;
  }
</style>
