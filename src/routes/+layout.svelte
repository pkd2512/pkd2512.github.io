<script>
  import Navbar from '$lib/components/ui/Navbar/index.svelte';
  import Footer from '$lib/components/ui/Footer/index.svelte';
  import Intro from '$lib/components/custom/home/HomeIntro/index.svelte';
  import Analytics from '$lib/components/ui/Analytics/index.svelte';
  import ProjectHero from '$lib/components/custom/projects/ProjectHero/index.svelte';
  import { page } from '$app/stores';
  $: pageId = $page.route.id;

  import '$lib/styles/main.scss';

  export let data;
  const { img } = $page.data.meta.intro;
  $: console.log($page);
</script>

<Analytics />

{#if pageId && pageId === '/'}
  <Intro />
{/if}

{#if pageId && pageId === '/projects/[slug]'}
  <ProjectHero />
{/if}

<Navbar />

<main>
  <article>
    <slot />
  </article>
</main>

<Footer />

<style>
  article {
    margin-top: calc(-1.5 * var(--space-3xl));
  }
</style>
