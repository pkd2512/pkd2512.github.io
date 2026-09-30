<script>
  import { onMount } from 'svelte';

  /**
   * A macOS-style overlay scrollbar, so the bar looks the same in every
   * browser instead of Chrome, Firefox and Safari each drawing their own.
   *
   * The native bar is hidden rather than restyled: `::-webkit-scrollbar` is
   * Chrome and Safari only, and Firefox's `scrollbar-width`/`scrollbar-color`
   * can't round a thumb or fade it out, so no amount of CSS gets the three to
   * agree. Only the page's own bar is hidden — inner scrollers keep theirs.
   *
   * This is decorative. Wheel, trackpad, keyboard, space bar and find-on-page
   * all still drive the real scroll, so it carries aria-hidden and nothing
   * here is the only way to reach anything.
   */

  /** Track element, so the thumb is measured against what it actually runs in. */
  let trackEl;

  let thumbH = $state(0);
  let thumbY = $state(0);
  let visible = $state(false);
  let dragging = $state(false);

  /** Short enough to feel like a grab handle, long enough to hit. */
  const MIN_THUMB = 36;
  const IDLE_MS = 900;

  /** @type {ReturnType<typeof setTimeout>} */
  let idleTimer;

  const wake = () => {
    visible = true;
    clearTimeout(idleTimer);
    if (!dragging) idleTimer = setTimeout(() => (visible = false), IDLE_MS);
  };

  /**
   * Cached page geometry. Reading scrollHeight or clientHeight forces the
   * browser to flush layout, and doing that once per animation frame while
   * scrolling cost about 16% of frames over 20ms. None of it changes as the
   * page scrolls, so it is recomputed only on resize and when the document
   * itself changes size.
   */
  let geom = { view: 0, total: 0, trackH: 0, travel: 0, max: 0 };

  const remeasure = () => {
    const doc = document.documentElement;
    const view = doc.clientHeight;
    const total = doc.scrollHeight;
    const trackH = trackEl?.clientHeight ?? view;

    // A page that doesn't scroll gets no bar at all.
    if (total <= view + 1 || trackH <= 0) {
      thumbH = 0;
      geom = { view, total, trackH, travel: 0, max: 0 };
      return;
    }

    thumbH = Math.max(MIN_THUMB, (view / total) * trackH);
    geom = {
      view,
      total,
      trackH,
      travel: trackH - thumbH,
      max: total - view,
    };
    track();
  };

  /** Scroll-frequency work: arithmetic on cached numbers, no layout read. */
  const track = () => {
    if (geom.max <= 0) return;
    thumbY = Math.min(geom.travel, (window.scrollY / geom.max) * geom.travel);
  };

  /** @param {PointerEvent} e */
  const startDrag = (e) => {
    const doc = document.documentElement;
    const { travel, max } = geom;
    if (travel <= 0 || max <= 0) return;

    dragging = true;
    wake();
    const fromY = e.clientY;
    const fromScroll = window.scrollY;
    e.currentTarget.setPointerCapture?.(e.pointerId);

    /** @param {PointerEvent} ev */
    const move = (ev) => {
      const next = fromScroll + ((ev.clientY - fromY) / travel) * max;
      // Straight to scrollTop rather than scrollTo: Lenis eases programmatic
      // scrolls, and easing a drag makes the thumb lag the cursor.
      doc.scrollTop = Math.max(0, Math.min(max, next));
    };

    const end = () => {
      dragging = false;
      wake();
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', end);
      removeEventListener('pointercancel', end);
    };

    addEventListener('pointermove', move);
    addEventListener('pointerup', end);
    addEventListener('pointercancel', end);
    e.preventDefault();
  };

  onMount(() => {
    /** @type {number} */
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(track);
      wake();
    };

    remeasure();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', remeasure);

    // The page grows as images and embeds land, so the thumb has to be resized
    // from the document rather than measured once on mount.
    const ro = new ResizeObserver(() => remeasure());
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', remeasure);
      ro.disconnect();
    };
  });
</script>

<div class="scrollbar" bind:this={trackEl} aria-hidden="true">
  {#if thumbH > 0}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="scrollbar__thumb"
      class:visible={visible || dragging}
      class:dragging
      style="height: {thumbH}px; transform: translateY({thumbY}px)"
      onpointerdown={startDrag}
      role="presentation"
    ></div>
  {/if}
</div>

<style lang="scss">
  // Hide the page's own bar, not every scroller on the page: an inner panel
  // with its own overflow keeps a usable one.
  :global(html) {
    scrollbar-width: none;
  }

  :global(html::-webkit-scrollbar),
  :global(body::-webkit-scrollbar) {
    width: 0;
    height: 0;
    display: none;
  }

  .scrollbar {
    position: fixed;
    top: 4px;
    right: 3px;
    bottom: 4px;
    width: 10px;
    // Above the CRT rim so the bar is never refracted, below the navbars.
    z-index: var(--layer-4);
    pointer-events: none;
  }

  .scrollbar__thumb {
    position: absolute;
    inset-inline: 2px;
    top: 0;
    border-radius: 999px;
    background: rgba(47, 7, 67, 0.32);
    // A hairline of page colour, which is what stops the thumb disappearing
    // against dark photography as it passes over it.
    box-shadow: 0 0 0 1px rgba(250, 250, 250, 0.5);
    opacity: 0;
    transition:
      opacity 0.35s ease,
      background-color 0.2s ease;
    pointer-events: auto;
    cursor: default;
    will-change: transform;
  }

  .scrollbar__thumb.visible {
    opacity: 1;
  }

  .scrollbar__thumb:hover,
  .scrollbar__thumb.dragging {
    background: rgba(47, 7, 67, 0.55);
  }

  // Touch platforms draw their own transient indicator and there is nothing to
  // hover or drag with, so stay out of the way.
  @media (pointer: coarse) {
    .scrollbar {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .scrollbar__thumb {
      transition: none;
    }
  }
</style>
