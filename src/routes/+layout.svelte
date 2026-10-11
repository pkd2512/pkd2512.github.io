<script>
  import Navbar from '$lib/components/ui/Navbar/index.svelte';
  import Footer from '$lib/components/ui/Footer/index.svelte';
  import Intro from '$lib/components/custom/home/HomeIntro/index.svelte';
  import Analytics from '$lib/components/ui/Analytics/index.svelte';
  import ProjectHero from '$lib/components/custom/projects/ProjectHero/index.svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { afterNavigate } from '$app/navigation';
  import GridOverlay from '$lib/components/ui/GridOverlay/index.svelte';
  import CrtOverlay from '$lib/components/ui/CrtOverlay/index.svelte';
  import ScrollBar from '$lib/components/ui/ScrollBar/index.svelte';
  import { figureCaptionObserver } from '$lib/actions/figureCaptionObserver';

  // Lenis's own rules — chiefly overriding the global `scroll-behavior:
  // smooth`, which would otherwise fight its easing on anchor jumps.
  import 'lenis/dist/lenis.css';
  import '$lib/styles/main.scss';

  let { data, children } = $props();

  let pageId = $derived(page.route.id);

  /**
   * Smooth scrolling. Lenis eases the real scroll position toward where the
   * wheel asked for, so motion carries on and decays after the wheel stops —
   * native scroll just jumps a fixed distance per notch.
   * @type {import('lenis').default | undefined}
   */
  let lenis;

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Lenis only smooths wheel and trackpad input; touch is left native
    // (syncTouch: false). On a device with no mouse or trackpad at all (phones,
    // iOS and Android alike) it would smooth nothing while still running a
    // frame loop for the life of the page. A tablet with a trackpad attached
    // reports a fine pointer and keeps it.
    if (!window.matchMedia('(any-pointer: fine)').matches) return;

    let cancelled = false;
    // Imported here rather than at the top so it never runs during SSR.
    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        lerp: 0.1,
        // Touch keeps the platform's own momentum, which already feels right.
        syncTouch: false,
        anchors: true,
        autoRaf: true,
      });
    });

    return () => {
      cancelled = true;
      lenis?.destroy();
      lenis = undefined;
    };
  });

  afterNavigate(() => {
    // The new page is a different length, and SvelteKit has already jumped to
    // its top — Lenis is still holding the old page's measurements and target.
    lenis?.resize();
    lenis?.scrollTo(window.scrollY, { immediate: true });
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
  <article use:figureCaptionObserver>
    {@render children()}
  </article>
</main>

<Footer />

<CrtOverlay />
<ScrollBar />

<style>
  /* The site sets `scroll-behavior: smooth` globally; while Lenis is driving,
     that would smooth programmatic scrolls a second time, fighting its easing. */
  :global(html.lenis) {
    scroll-behavior: auto;
  }

  /* PhotoPile cards fly out sideways past the viewport edge. Left alone that
     widens the page, and mobile browsers zoom out to fit it. `clip` (unlike
     `hidden`) makes no scroll container, so the sticky nav is unaffected. */
  main {
    overflow-x: clip;
  }

  article {
    margin-top: calc(-1.5 * var(--space-3xl));
  }

  /* Anything marked by the `visibility` action while off screen pauses its CSS
     animations: marquees, swipe nudges, the contact bounce. */
  :global([data-offscreen]),
  :global([data-offscreen] *) {
    animation-play-state: paused !important;
  }
</style>
