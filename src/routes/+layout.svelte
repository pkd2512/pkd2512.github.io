<script>
  import Navbar from '$lib/components/ui/Navbar/index.svelte';
  import Footer from '$lib/components/ui/Footer/index.svelte';
  import Intro from '$lib/components/custom/home/HomeIntro/index.svelte';
  import Analytics from '$lib/components/ui/Analytics/index.svelte';
  import ProjectHero from '$lib/components/custom/projects/ProjectHero/index.svelte';
  import { page } from '$app/state';
  import { afterNavigate } from '$app/navigation';
  import GridOverlay from '$lib/components/ui/GridOverlay/index.svelte';
  import CrtOverlay from '$lib/components/ui/CrtOverlay/index.svelte';
  import { registerPageview } from '$utils/googleAnalytics';

  import '$lib/styles/main.scss';

  let { data, children } = $props();

  let pageId = $derived(page.route.id);

  afterNavigate(() => {
    registerPageview();
    // requestAnimationFrame(() => {
    //   window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    // });
  });
</script>

<Analytics />

<GridOverlay />

{#if pageId && (pageId === '/' || pageId === '/colophone')}
  <Intro />
{/if}

{#if pageId && pageId === '/projects/[slug]'}
  <ProjectHero meta={page.data?.meta} />
{/if}

<Navbar />

<main>
  <article>
    {@render children()}
  </article>
</main>

<Footer />

<CrtOverlay />

<style>
  article {
    margin-top: calc(-1.5 * var(--space-3xl));
  }
</style>
