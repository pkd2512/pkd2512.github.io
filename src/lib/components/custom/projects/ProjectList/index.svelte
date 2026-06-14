<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import ProjectCard from '$lib/components/custom/projects/ProjectCard/index.svelte';
  import { resolve } from '$app/paths';

  /**
   * @type {{ posts: any[] }}
   */
  let { posts } = $props();
</script>

<Container width="fluid">
  <ul class="posts">
    {#each posts as post}
      <li class="post">
        <a href={resolve('/projects/[slug]', { slug: post.slug })}>
          <ProjectCard info={post} />
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
    gap: calc(var(--grid-gutter) * 0.5);

    // define grid cols
    --cols: 2;

    @media (max-width: 1200px) {
      --cols: 2;
    }

    @media (width <850px) {
      --cols: 1;
    }
  }

  li {
    list-style: none;
    width: calc(
      (100% - (var(--cols) + 1) * (var(--grid-gutter) * 0.5)) / var(--cols)
    );
    flex: auto 0 0;
  }
  a {
    text-decoration: none;
  }
</style>
