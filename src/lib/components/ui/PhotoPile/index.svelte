<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { asset, resolve } from '$app/paths';

  function resolveSrc(src) {
    if (/^(https?:|data:|\/\/|\/)/.test(src)) return src;
    return asset(src);
  }

  let { items = [], foreground, orientation = 'landscape' } = $props();

  let wrapper;
  let cards = [];
  let captions = [];

  onMount(() => {
    if (!wrapper || cards.length < 2) return;

    const n = cards.length;
    let currentIndex = n - 1;
    let isAnimating = false;

    gsap.set(wrapper, { perspective: 1200 });

    cards.forEach((card, i) => {
      card.style.zIndex = i;
    });

    gsap.set(cards[0], {
      y: 90,
      x: 32,
      rotation: 3.5,
      scale: 0.75,
      rotateY: 7,
    });
    gsap.set(cards[1], {
      y: 45,
      x: 16,
      rotation: -2,
      scale: 0.86,
      rotateY: -3,
    });
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

    function animateTo(fromIdx, toIdx, onDone) {
      const flyOut = {
        x: 320,
        y: -120,
        rotation: 14,
        rotateY: 0,
        scale: 0.85,
        opacity: 1,
        duration: 0.35,
        ease: 'power2.in',
      };
      const flyIn = {
        x: 0,
        y: 0,
        rotation: 0,
        scale: toIdx === 0 ? 1.01 : 1,
        rotateY: 0,
        zIndex: n - 1,
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
      };

      gsap.to(cards[fromIdx], flyOut);
      gsap.to(cards[toIdx], flyIn);
      gsap.to(captions[fromIdx], { opacity: 0, x: -8, duration: 0.25 });
      gsap.to(captions[toIdx], { opacity: 1, x: 0, duration: 0.25 });
      gsap.set(cards[fromIdx], { zIndex: -1 });
      gsap.to(cards[fromIdx], {
        x: 16,
        y: 45,
        rotation: -2,
        rotateY: -3,
        scale: 0.86,
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out',
        delay: 0.35,
        onComplete: onDone,
      });
    }

    function goTo(index) {
      if (isAnimating) return;

      let targetIndex = index;
      if (targetIndex < 0) targetIndex = n - 1;
      else if (targetIndex >= n) targetIndex = 0;

      if (targetIndex === currentIndex) return;

      isAnimating = true;
      const from = currentIndex;
      const to = targetIndex;

      animateTo(from, to, () => {
        currentIndex = to;
        isAnimating = false;
      });
    }

    let start = null;

    function getSwipeDir(dx, dy) {
      return Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? 'right'
          : 'left'
        : dy > 0
          ? 'down'
          : 'up';
    }

    function handlePointerDown(e) {
      if (isAnimating) return;
      start = { x: e.clientX, y: e.clientY, time: Date.now() };
      wrapper.setPointerCapture(e.pointerId);
    }

    function handlePointerUp(e) {
      if (!start) return;

      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      const dist = Math.hypot(dx, dy);
      const elapsed = Date.now() - start.time;

      start = null;

      if (dist < 10 && elapsed < 300) {
        goTo(currentIndex - 1);
        return;
      }

      if (dist < 30) return;

      const dir = getSwipeDir(dx, dy);

      if (dir === 'left' || dir === 'up') {
        goTo(currentIndex - 1);
      } else {
        goTo(currentIndex + 1);
      }
    }

    function handlePointerCancel() {
      start = null;
    }

    wrapper.addEventListener('pointerdown', handlePointerDown);
    wrapper.addEventListener('pointerup', handlePointerUp);
    wrapper.addEventListener('pointercancel', handlePointerCancel);

    return () => {
      wrapper.removeEventListener('pointerdown', handlePointerDown);
      wrapper.removeEventListener('pointerup', handlePointerUp);
      wrapper.removeEventListener('pointercancel', handlePointerCancel);
    };
  });
</script>

<div class="photopile {orientation}" bind:this={wrapper}>
  <div class="pile">
    {#each items as item, i}
      <figure
        class="card"
        bind:this={cards[i]}
        role="img"
        aria-label={item.alt || ''}
      >
        <div class="img" style="background-image: url({resolveSrc(item.src)})">
          {#if foreground}
            {@render foreground(item)}
          {/if}
        </div>
        {#if item.caption}
          <figcaption bind:this={captions[i]}>{item.caption}</figcaption>
        {/if}
      </figure>
    {/each}
  </div>
</div>

<style lang="scss">
  .photopile {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-l);
    touch-action: none;
    width: 100%;
    flex-wrap: wrap;
    margin-block-end: var(--space-l);
  }

  .square .card .img {
    aspect-ratio: var(--ratio-square);
  }
  .landscape .card .img {
    aspect-ratio: var(--ratio-landscape);
  }
  .portrait .card .img {
    aspect-ratio: var(--ratio-portrait);
  }
  .widescreen .card .img {
    aspect-ratio: var(--ratio-widescreen);
  }
  .ultrawide .card .img {
    aspect-ratio: var(--ratio-ultrawide);
  }
  .golden .card .img {
    aspect-ratio: var(--ratio-golden);
  }

  .pile {
    position: relative;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 100%;
    max-width: min(90vw, var(--grid-max-width));
  }

  .card {
    position: relative;
    grid-area: 1 / 1;
    width: 100%;
    user-select: none;
    margin: 0;

    .img {
      width: 100%;
      aspect-ratio: var(--ratio-landscape);
      border-radius: 0.5rem;
      overflow: hidden;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);

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

    figcaption {
      position: absolute;
      top: 0;
      left: calc(100% + var(--grid-gutter));
      max-width: var(--xxs);
      margin: 0;
      padding-inline: 0;
      color: var(--black-soft);
      font-style: italic;
      font-size: var(--font-size-0);
      font-family: var(--font-serif);
      line-height: var(--line-height-medium);
      text-align: start;

      @media (width <= 1024px) {
        top: calc(100% + var(--space-2xs));
        left: 0;
        max-width: 100%;
      }
    }
  }

  .captions,
  .caption {
    display: none;
  }
</style>
