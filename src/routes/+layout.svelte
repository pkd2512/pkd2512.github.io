<script>
  import Navbar from '$lib/components/ui/Navbar/index.svelte';
  import Footer from '$lib/components/ui/Footer/index.svelte';
  import Intro from '$lib/components/projects/HomeIntro/index.svelte';
  import Analytics from '$lib/components/ui/Analytics/index.svelte';

  import { page } from '$app/stores';
  $: pageId = $page.route.id;

  import '$lib/styles/main.scss';
</script>

<Analytics />

{#if pageId === '/'}
  <Intro />
{/if}

<Navbar />

<main>
  <article>
    <slot />
  </article>
</main>

<Footer />
