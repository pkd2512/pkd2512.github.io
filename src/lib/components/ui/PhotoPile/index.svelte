<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { asset } from '$app/paths';
  import Icon from '@iconify/svelte';
  import { createPileAnimator } from './pile-animation.js';
  import { attachGestures } from './pile-gestures.js';

  // ─── Helpers ───────────────────────────────────────────────────────────────

  function resolveSrc(src) {
    if (/^(https?:|data:|\/\/|\/)/.test(src)) return src;
    return asset(src);
  }

  // ─── Props ─────────────────────────────────────────────────────────────────

  let {
    items = [],
    foreground,
    orientation = 'landscape',

    // Exit travel (px)
    exitX = 300,
    exitY = 150,
    exitRotation = 12,

    // Drag feel
    swipeThreshold = 75,
    velocityThreshold = 0.5,
    rotationFactor = 0.08,
    maxRotation = 25,
    dragResistance = 0.85,

    // Stack offsets [bottom, middle, top]
    stackPositions = [
      { y: 28, x: 20, rotation: 3.5, scale: 0.82, rotateY: 5 },
      { y: 14, x: 10, rotation: -2, scale: 0.91, rotateY: -2 },
      { y: 0, x: 0, rotation: 0, scale: 1, rotateY: 0 },
    ],
  } = $props();

  // ─── Refs ──────────────────────────────────────────────────────────────────

  let wrapper;
  let cards = [];
  let captions = [];
  let showNudge = $state(true);

  // ─── Mount: wire animation + gestures ─────────────────────────────────────

  onMount(() => {
    if (!wrapper || cards.length < 2) return;

    const n = cards.length;
    let currentIndex = n - 1;
    let isAnimating = false;
    let pendingAction = null;

    gsap.set(wrapper, { perspective: 1200 });

    // ── Animator ─────────────────────────────────────────────────────────

    const anim = createPileAnimator({
      cards,
      captions,
      stackPositions,
      n,
      exitX,
      exitY,
      exitRotation,
    });

    anim.initPositions(currentIndex);

    // ── Navigate ──────────────────────────────────────────────────────────

    function navigate(direction, vel = { vx: 0, vy: 0 }, releaseState = {}) {
      if (isAnimating) {
        pendingAction = { direction, vel };
        return;
      }
      isAnimating = true;
      pendingAction = null;

      const fromIdx = currentIndex;
      const toIdx = (currentIndex - 1 + n) % n;

      anim.promoteStack(toIdx, currentIndex);

      anim.flyCardOut(
        fromIdx,
        direction,
        vel,
        () => {
          currentIndex = toIdx;
          anim.refreshZIndices(currentIndex);
          isAnimating = false;

          if (pendingAction) {
            const next = pendingAction;
            pendingAction = null;
            navigate(next.direction, next.vel);
          }
        },
        releaseState
      );
    }

    // ── Gestures ─────────────────────────────────────────────────────────

    const gestures = attachGestures({
      wrapper,
      getCards: () => cards,
      getCurrentIndex: () => currentIndex,
      getIsAnimating: () => isAnimating,
      swipeThreshold,
      velocityThreshold,
      dragResistance,

      onNudgeHide: () => {
        showNudge = false;
      },
      onDragStart: () => {
        anim.liftCard(currentIndex);
      },

      onDragMove: (dx, dy, grabY) => {
        anim.applyDrag(
          currentIndex,
          dx,
          dy,
          {
            rotationFactor,
            maxRotation,
            swipeThreshold,
          },
          grabY
        );
      },

      onNavigate: (direction, vel, releaseState) => {
        anim.lowerCard(currentIndex);
        navigate(direction, vel, releaseState);
      },

      onSnapBack: () => {
        anim.snapBackToTop(currentIndex);
        anim.resetNextCard(currentIndex);
      },
    });

    return () => gestures.destroy();
  });
</script>

<!-- ─── Template ─────────────────────────────────────────────────────────── -->

<div class="photopile {orientation}" bind:this={wrapper}>
  <div class="pile" class:has-captions={items.some((item) => item.caption)}>
    {#if showNudge}
      <div class="nudge" aria-hidden="true">
        <Icon icon="iwwa:swipe" width="36" height="36" style="color: white" />
      </div>
    {/if}

    {#each items.reverse() as item, i}
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

<!-- ─── Styles ───────────────────────────────────────────────────────────── -->

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
    cursor: grab;
    outline: none;

    &:active {
      cursor: grabbing;
    }

    &:focus-visible {
      outline: 2px solid var(--black-soft, #333);
      outline-offset: 4px;
      border-radius: 0.5rem;
    }
  }

  // ── Aspect-ratio variants ────────────────────────────────────────────────
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

  // ── Pile container ───────────────────────────────────────────────────────
  .pile {
    position: relative;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 100%;
    max-width: min(90vw, var(--grid-max-width));
    overflow: visible;

    // Only add space for the below-image caption when captions are present
    &.has-captions {
      padding-bottom: 3rem;

      @media (width >= 1400px) {
        padding-bottom: 0; // caption is beside the image at wide viewport
      }
    }
  }

  // ── Card ─────────────────────────────────────────────────────────────────
  .card {
    position: relative;
    grid-area: 1 / 1;
    width: 100%;
    margin: 0;
    user-select: none;
    will-change: transform;

    .img {
      width: 100%;
      aspect-ratio: var(--ratio-landscape);
      border-radius: 0.5rem;
      overflow: hidden;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      will-change: box-shadow;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0.15) 0%,
          transparent 50%
        );
        pointer-events: none;
      }
    }

    figcaption {
      position: absolute;
      padding-inline: 0;
      color: var(--black-soft);
      font-style: italic;
      font-size: var(--font-size-0);
      font-family: var(--font-serif);
      line-height: var(--line-height-medium);
      text-align: start;
      pointer-events: none;
      // Paint above all buried cards and their shadows
      z-index: 9998;

      // Mobile: below the image
      top: calc(100% + var(--space-2xs));
      left: 0;
      width: 100%;
      max-width: 100%;

      // Wide: alongside the image to the right
      @media (width >= 1400px) {
        top: 0;
        left: calc(100% + var(--grid-gutter));
        width: var(--xxs);
        max-width: var(--xxs);
        // No padding-bottom reservation needed here — caption is beside the image
        z-index: auto;
      }
    }
  }

  // ── Swipe nudge ───────────────────────────────────────────────────────────
  .nudge {
    grid-area: 1 / 1;
    position: relative;
    align-self: end;
    justify-self: end;
    z-index: 9999;
    background-color: var(--purple-soft, rgba(120, 80, 200, 0.85));
    padding: 0.8rem 1rem;
    margin-bottom: var(--space-m, 1.5rem);
    margin-right: var(--space-m, 1.5rem);
    border-radius: 50px;
    pointer-events: none;
    animation: swipe-nudge 1.5s cubic-bezier(0.86, 0, 0.07, 1) infinite forwards;
  }

  @keyframes swipe-nudge {
    0% {
      opacity: 0;
      transform: translateX(-1rem);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .captions,
  .caption {
    display: none;
  }
</style>
