<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  let {
    items = [],
    foreground,
  } = $props();

  let wrapper;
  let cards = [];
  let captions = [];

  onMount(() => {
    if (!wrapper || cards.length < 2) return;

    const n = cards.length;

    gsap.set(wrapper, { perspective: 1200 });

    cards.forEach((card, i) => {
      card.style.zIndex = i;
    });

    gsap.set(cards[0], { y: 90, x: 32, rotation: 3.5, scale: 0.75, rotateY: 7 });
    gsap.set(cards[1], { y: 45, x: 16, rotation: -2, scale: 0.86, rotateY: -3 });
    gsap.set(cards[n - 1], {
      y: 0,
      x: 0,
      rotation: 0,
      scale: 1,
      rotateY: 0,
      zIndex: n - 1,
    });

    captions.forEach((c, i) => {
      gsap.set(c, {
        opacity: i === n - 1 ? 1 : 0,
        x: i === n - 1 ? 0 : 16,
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        pin: true,
        start: 'top top',
        end: `+=${n * 100}%`,
        scrub: 1,
        invalidateOnRefresh: true,
      },
      defaults: { ease: 'none' },
    });

    let gap = { t: 0 };

    tl.to(gap, { t: 1 });

    for (let i = n - 1; i > 0; i--) {
      tl.to(cards[i], {
        x: 320,
        y: -120,
        rotation: 14,
        rotateY: 0,
        scale: 0.85,
        opacity: 1,
      });
      tl.to(
        cards[i - 1],
        i === n - 1
          ? { x: 20, y: 32, rotation: -1, scale: 0.95, rotateY: -3, opacity: 1 }
          : { x: 10, y: 16, rotation: -0.5, scale: 1, rotateY: 0, opacity: 1 },
        '<'
      );
      tl.to(captions[i], { opacity: 0, x: -8 }, '<');
      tl.to(captions[i - 1], { opacity: 1, x: 0 }, '<');
      tl.set(cards[i], { zIndex: -1 });
      tl.to(cards[i], {
        x: i === n - 1 ? 32 : 16,
        y: i === n - 1 ? 90 : 45,
        rotation: i === n - 1 ? 3.5 : -2,
        rotateY: i === n - 1 ? 7 : -3,
        scale: i === n - 1 ? 0.75 : 0.86,
        opacity: 1,
      });

      if (i === n - 1) {
        tl.to(gap, { t: 1 });
        tl.to(gap, { t: 1 });
      } else {
        tl.to(gap, { t: 1 });
      }
    }

    tl.to(cards[0], {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1.01,
      rotateY: 0,
      opacity: 1,
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  });
</script>

<div class="photopile" bind:this={wrapper}>
  <div class="pile">
    {#each items as item, i}
      <div
        class="card"
        bind:this={cards[i]}
        style="background-image: url({item.src})"
        role="img"
        aria-label={item.alt || ''}
      >
        {#if foreground}
          {@render foreground(item)}
        {/if}
      </div>
    {/each}
  </div>

  <div class="captions">
    {#each items as item, i}
      <div class="caption" bind:this={captions[i]}>{item.caption}</div>
    {/each}
  </div>
</div>

<style lang="scss">
  .photopile {
    position: relative;
    height: 100lvh;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-l);
  }

  .pile {
    position: relative;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  .card {
    grid-area: 1 / 1;
    width: min(75vw, var(--grid-max-width));
    height: min(75vh, 45rem);
    border-radius: 0.75rem;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.45) 0%,
        transparent 50%
      );
      pointer-events: none;
    }
  }

  .captions {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
    max-width: 16rem;
  }

  .caption {
    background: var(--white);
    padding: var(--space-s-m) var(--space-m-l);
    border-radius: 0.5rem;
    box-shadow: var(--shadow-2);
  }
</style>
