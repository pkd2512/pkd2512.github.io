<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import ProjectCard from '$lib/components/custom/projects/ProjectCard/index.svelte';
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

<Container width="lg">
  <h2>{title}</h2>
</Container>

<Container>
  <div class="wrapper" style="">
    <ul class="posts">
      {#each posts as post}
        <li class="post">
          <a href="{post.slug}">
            <ProjectCard info="{post}" />
          </a>
        </li>
      {/each}
    </ul>
  </div>
</Container>

<style lang="scss">
  .wrapper {
    // define grid cols
    --cols: 3;
    --gap: var(--space-s);
    @media (--xl-only) {
      --cols: 4;
    }
    @media (--lg-n-below) {
      --cols: 3;
    }
    @media (--sm-only) {
      --cols: 2;
    }
  }
  .wrapper {
    margin-inline: auto;
    margin-bottom: var(--space-xl);
    max-width: calc(
      var(--cols) * var(--card-width) + (var(--cols) - 1) * var(--gap)
    );
  }
  ul {
    padding: 0;
    display: grid;
    grid-gap: var(--gap);
    grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  }
  li {
    list-style: none;
  }
  a {
    text-decoration: none;
  }
</style>
