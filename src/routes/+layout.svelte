<script>
  import Navbar from '$lib/components/ui/Navbar/index.svelte';
  import Footer from '$lib/components/ui/Footer/index.svelte';
  import Intro from '$lib/components/custom/home/HomeIntro/index.svelte';
  import Analytics from '$lib/components/ui/Analytics/index.svelte';

  import { page } from '$app/stores';
  $: pageId = $page.route.id;

  import '$lib/styles/main.scss';

  export let data;
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
