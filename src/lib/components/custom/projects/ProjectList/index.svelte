<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import ProjectCard from '$lib/components/custom/projects/ProjectCard/index.svelte';
  import { base } from '$app/paths';

  /**
   * @param posts - list of projects and metadata
   * @type {any[]}
   */
  export let posts;
</script>

<Container width="fluid">
  <!-- <div class="wrapper" style=""> -->
  <ul class="posts">
    {#each posts as post}
      <li class="post">
        <a href="{base}/projects/{post.slug}">
          <ProjectCard info="{post}" />
        </a>
      </li>
    {/each}
  </ul>
  <!-- </div> -->
</Container>

<style lang="scss">
  ul {
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    margin-inline: auto;
    margin-block-end: var(--space-s);

    // define grid cols
    --cols: 3;

    @media (max-width: 1280px) {
      --cols: 2;
    }

    @media (--lg-n-below) {
      --cols: 2;
    }
    @media (480px<= width <850px) {
      --cols: 1;
    }
    @media (--sm-n-below) {
      --cols: 1;
    }
  }
  li {
    list-style: none;
    width: calc(100% / var(--cols));
  }
  a {
    text-decoration: none;
  }
</style>
