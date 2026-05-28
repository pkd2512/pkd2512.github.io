<script>
  import { onMount } from 'svelte';
  import {
    tileStyle,
    masonryContainerStyle,
    makePerm,
    calcMasonryWidth,
  } from './infiniteCanvas.js';

  const PADDING = 150;

  /**
   * Shared gsap reference. Populated by the dynamic import inside
   * `onMount`, then re-used by handlers that fire after mount (keydown,
   * close). Keeps us from leaking onto `window.gsap`.
   * @type {any}
   */
  let gsap;

  /**
   * @type {{
   *   items: Array<{url:string, ref_url?:string, title?:string, aspect:number}>,
   *   title?: string,
   *   originRect: DOMRect | null,
   *   onclose: () => void
   * }}
   */
  let { items = [], title = '', originRect = null, onclose } = $props();

  // Snapshot originRect into plain numbers so a layout shift in the
  // page beneath us can't invalidate the live DOMRect mid-tween.
  // `$derived` keeps the snapshot in sync if the parent ever swaps the
  // rect (e.g. opening a different group without unmounting us).
  let initialRect = $derived(
    originRect
      ? {
          x: originRect.x,
          y: originRect.y,
          width: originRect.width,
          height: originRect.height,
        }
      : null
  );

  let perm = $derived(makePerm(title));

  /**
   * Thumbnail widths available on disk (see `scripts/generate-thumbnails.js`).
   * Order doesn't matter — the browser picks based on `sizes` × DPR.
   */
  const THUMB_WIDTHS = [300, 600];

  /**
   * Build the URL for a thumbnail at a specific width. CSV `url` values
   * follow the canonical layout `<dir>/images/<slug>.<ext>`; thumbs
   * live alongside the `images/` folder at `<dir>/thumbs_<w>/<slug>.<ext>`.
   * So we just swap the `/images/` segment for the matching `/thumbs_<w>/`.
   *
   * Falls back to the previous behaviour (insert `/thumbs_<w>/` before
   * the filename) for legacy CSV rows that still point at flat folders.
   * @param {string} url
   * @param {number} w
   */
  function thumbAt(url, w) {
    if (!url) return '';
    if (url.includes('/images/')) {
      return '/media/' + url.replace('/images/', `/thumbs_${w}/`);
    }
    const i = url.lastIndexOf('/');
    return (
      '/media/' + url.slice(0, i) + '/thumbs_' + w + '/' + url.slice(i + 1)
    );
  }

  /**
   * Single-size fallback URL — used when `srcset` isn't honoured.
   * @param {string} url
   */
  function tileUrl(url) {
    return thumbAt(url, 600);
  }

  /**
   * Click-through URL when an entry has no `ref_url`. Opens the
   * full-resolution source image so users can see detail beyond the
   * thumbnail.
   * @param {string} url
   */
  function fullUrl(url) {
    return url ? '/media/' + url : '';
  }

  // `sizes` describes how wide each <img> renders. Tiles are pinned to
  // FRAME_W (500px) regardless of viewport — the gallery doesn't reflow
  // — so a single value is honest. On 1× the browser picks 600w; on 2×
  // a slight upscale from 600w to 1000 physical px is fine for thumbs.
  const TILE_SIZES = '500px';

  // Precompute the per-tile data (style string + thumbnail URLs) once
  // per `items`/`title`/`perm` change, so the `{#each}` block doesn't
  // rebuild strings on every reactive tick.
  let tiles = $derived(
    items.map((it, i) => ({
      item: it,
      style: tileStyle(it, title, i, perm),
      thumb: tileUrl(it.url),
      srcset: THUMB_WIDTHS.map((w) => `${thumbAt(it.url, w)} ${w}w`).join(', '),
      href: it.ref_url || fullUrl(it.url),
      alt: it.title || '',
      key: it.url + '#' + i,
    }))
  );

  /** @type {HTMLDivElement | undefined} */
  let stageEl;
  /** @type {HTMLDivElement | undefined} */
  let overlayEl;
  /** @type {HTMLDivElement | undefined} */
  let ghostEl;

  let contentWidth = $state(2500);

  /** @type {{minX:number,maxX:number,minY:number,maxY:number}} */
  let _bounds = {
    minX: -Infinity,
    maxX: Infinity,
    minY: -Infinity,
    maxY: Infinity,
  };

  let ready = $state(false);

  onMount(() => {
    contentWidth = calcMasonryWidth(items.length);

    /** @type {any} */ let Draggable;
    /** @type {any} */ let InertiaPlugin;
    /** @type {any} */ let draggable;
    /** @type {any} */ let xTo;
    /** @type {any} */ let yTo;

    // Bounds-clamped target the wheel handler accumulates into.
    let tx = 0;
    let ty = 0;

    /** @type {ResizeObserver | null} */
    let resizeObs = null;
    /** @type {IntersectionObserver | null} */
    let imgObs = null;
    let cancelled = false;

    /** @param {WheelEvent} e */
    function onWheel(e) {
      if (!stageEl || !xTo) return;
      e.preventDefault();
      // Normalise wheel delta across browsers / input devices:
      //   deltaMode 0 → pixels (trackpad)
      //   deltaMode 1 → lines (Windows mouse wheel)
      //   deltaMode 2 → pages (some legacy)
      const mult =
        e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      tx = Math.max(_bounds.minX, Math.min(_bounds.maxX, tx - e.deltaX * mult));
      ty = Math.max(_bounds.minY, Math.min(_bounds.maxY, ty - e.deltaY * mult));
      xTo(tx);
      yTo(ty);
    }

    function recomputeBounds() {
      if (!stageEl) return;
      const masonryInner = /** @type {HTMLElement | null} */ (
        stageEl.querySelector('.masonry-inner')
      );
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cw = contentWidth;
      const ch = masonryInner ? masonryInner.scrollHeight : vh;
      const maxX = PADDING;
      const minX = -(cw - vw) - PADDING;
      const maxY = PADDING;
      const minY = -(ch - vh) - PADDING;
      _bounds = {
        minX: Math.min(minX, maxX),
        maxX: Math.max(minX, maxX),
        minY: Math.min(minY, maxY),
        maxY: Math.max(minY, maxY),
      };
      // Re-clamp the current target so it doesn't sit outside new bounds.
      tx = Math.max(_bounds.minX, Math.min(_bounds.maxX, tx));
      ty = Math.max(_bounds.minY, Math.min(_bounds.maxY, ty));
      if (draggable) draggable.applyBounds(_bounds);
    }

    (async () => {
      // Dynamic-import gsap + plugins so the gallery JS only ships to
      // users who actually open it. Also keeps SSR free of gsap's ESM
      // pitfalls (its package.json doesn't declare `type: module`).
      const [gsapMod, dragMod, inertiaMod] = await Promise.all([
        import('gsap'),
        import('gsap/Draggable'),
        import('gsap/InertiaPlugin'),
      ]);
      if (cancelled) return;

      gsap = gsapMod.default || gsapMod;
      Draggable = dragMod.Draggable || dragMod.default;
      InertiaPlugin = inertiaMod.InertiaPlugin || inertiaMod.default;
      gsap.registerPlugin(Draggable, InertiaPlugin);

      ready = true;

      // Entrance ghost zoom (snapshot rect, autoAlpha for visibility).
      if (ghostEl && initialRect) {
        gsap.fromTo(
          ghostEl,
          {
            x: initialRect.x,
            y: initialRect.y,
            width: initialRect.width,
            height: initialRect.height,
            autoAlpha: 1,
          },
          {
            x: 0,
            y: 0,
            width: '100vw',
            height: '100vh',
            duration: 0.4,
            ease: 'power3.out',
            onComplete: () => {
              gsap.to(ghostEl, { autoAlpha: 0, duration: 0.15 });
            },
          }
        );
      }

      draggable = Draggable.create(stageEl, {
        type: 'x,y',
        inertia: true,
        edgeResistance: 0,
        onDragStart() {
          stageEl?.classList.add('is-dragging');
        },
        onDragEnd() {
          stageEl?.classList.remove('is-dragging');
          // Keep our wheel target in sync with where inertia leaves us.
          tx = Number(gsap.getProperty(stageEl, 'x'));
          ty = Number(gsap.getProperty(stageEl, 'y'));
        },
        onThrowComplete() {
          tx = Number(gsap.getProperty(stageEl, 'x'));
          ty = Number(gsap.getProperty(stageEl, 'y'));
        },
        onClick(/** @type {MouseEvent} */ e) {
          const tile = /** @type {HTMLElement} */ (e.target).closest('.tile');
          if (!tile) return;
          const href = tile.getAttribute('href');
          if (href) window.open(href, '_blank', 'noopener');
        },
      })[0];

      xTo = gsap.quickTo(stageEl, 'x', {
        duration: 0.4,
        ease: 'power3.out',
      });
      yTo = gsap.quickTo(stageEl, 'y', {
        duration: 0.4,
        ease: 'power3.out',
      });

      // Compute bounds after the next frame so masonry has laid out.
      requestAnimationFrame(() => {
        if (cancelled) return;
        recomputeBounds();
      });

      // Recompute on resize / orientation change. ResizeObserver fires
      // for the overlay itself, which is `position: fixed; inset: 0`.
      if (typeof ResizeObserver !== 'undefined' && overlayEl) {
        resizeObs = new ResizeObserver(() => recomputeBounds());
        resizeObs.observe(overlayEl);
      }

      // Image deferral. Tile DOM nodes are cheap; the <img> payload is
      // expensive. We attach `data-src` / `data-srcset` initially and
      // only swap them onto the real attributes when the tile
      // intersects (with a generous root margin so panning doesn't
      // reveal blank tiles).
      //
      // Note: set `srcset` *before* `src`. Otherwise the browser kicks
      // off a fallback request from `src` and then has to reconsider
      // once `srcset` shows up — double load on slow connections.
      if (typeof IntersectionObserver !== 'undefined') {
        imgObs = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (!e.isIntersecting) continue;
              const img = /** @type {HTMLImageElement} */ (e.target);
              const ss = img.dataset.srcset;
              const src = img.dataset.src;
              if (ss && !img.srcset) img.srcset = ss;
              if (src && !img.src) img.src = src;
              imgObs?.unobserve(img);
            }
          },
          { root: null, rootMargin: '200% 200%', threshold: 0 }
        );
        // Observe whatever images exist on the next frame (after Svelte
        // has rendered the `{#each}`).
        requestAnimationFrame(() => {
          if (cancelled || !stageEl) return;
          stageEl
            .querySelectorAll('img[data-src]')
            .forEach((/** @type {Element} */ img) => imgObs?.observe(img));
        });
      }

      // Wheel + keyboard nav.
      overlayEl?.addEventListener('wheel', onWheel, { passive: false });
      document.body.style.overflow = 'hidden';
      overlayEl?.focus();
    })();

    return () => {
      cancelled = true;
      try {
        draggable?.kill();
      } catch (_) {
        // ignore
      }
      overlayEl?.removeEventListener('wheel', onWheel);
      resizeObs?.disconnect();
      imgObs?.disconnect();
      if (gsap && stageEl) gsap.killTweensOf(stageEl);
      if (gsap && ghostEl) gsap.killTweensOf(ghostEl);
      document.body.style.overflow = '';
    };
  });

  /** @param {KeyboardEvent} e */
  function handleKeydown(e) {
    if (e.key === 'Escape') {
      close();
      return;
    }
    // Arrow keys only do anything once gsap has finished loading.
    if (!gsap || !stageEl) return;

    const STEP = 60;
    const curX = Number(gsap.getProperty(stageEl, 'x'));
    const curY = Number(gsap.getProperty(stageEl, 'y'));
    let nx = curX;
    let ny = curY;

    switch (e.key) {
      case 'ArrowLeft':
        nx = Math.max(_bounds.minX, curX + STEP);
        break;
      case 'ArrowRight':
        nx = Math.min(_bounds.maxX, curX - STEP);
        break;
      case 'ArrowUp':
        ny = Math.max(_bounds.minY, curY + STEP);
        break;
      case 'ArrowDown':
        ny = Math.min(_bounds.maxY, curY - STEP);
        break;
      default:
        return;
    }
    e.preventDefault();
    gsap.to(stageEl, {
      x: nx,
      y: ny,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  let closing = false;
  function close() {
    if (closing) return;
    closing = true;
    if (gsap && ghostEl && initialRect) {
      // Cancel any in-flight ghost tween before starting the close tween
      // — otherwise an interrupted entrance can race with the exit.
      gsap.killTweensOf(ghostEl);
      gsap.set(ghostEl, { autoAlpha: 1 });
      gsap.fromTo(
        ghostEl,
        { x: 0, y: 0, width: '100vw', height: '100vh' },
        {
          x: initialRect.x,
          y: initialRect.y,
          width: initialRect.width,
          height: initialRect.height,
          duration: 0.35,
          ease: 'power3.in',
          onComplete: () => onclose?.(),
        }
      );
    } else {
      onclose?.();
    }
  }
</script>

<div
  class="infinite-canvas-overlay"
  bind:this={overlayEl}
  role="dialog"
  aria-modal="true"
  aria-label={title ? `Gallery: ${title}` : 'Image gallery'}
  tabindex="-1"
  onkeydown={handleKeydown}
>
  <div class="ghost" bind:this={ghostEl}></div>

  <div class="canvas-content" class:ready>
    <button class="close-btn" onclick={close} aria-label="Close gallery"
      >&times;</button
    >
    <h2 class="canvas-title">{title}</h2>

    <div class="stage" bind:this={stageEl}>
      <div class="masonry-inner" style={masonryContainerStyle(contentWidth)}>
        {#each tiles as t (t.key)}
          <a
            class="tile"
            style={t.style}
            href={t.href}
            target="_blank"
            rel="noopener"
            draggable="false"
            aria-label={t.alt}
          >
            <span class="tile-inner">
              <img
                data-src={t.thumb}
                data-srcset={t.srcset}
                sizes={TILE_SIZES}
                alt={t.alt}
                decoding="async"
                loading="lazy"
                fetchpriority="low"
                draggable="false"
              />
            </span>
          </a>
        {/each}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  // FRAME_W / GAP / PRECISION are module constants; expose them once
  // via custom properties on the root of the overlay so per-tile inline
  // styles don't need to repeat them.
  .infinite-canvas-overlay {
    --frame-width: 500px;
    --gap: 100px;
    --precision: 100;
    --row-h: 5px; // = frame-width / precision

    position: fixed;
    inset: 0;
    z-index: 1000;
    background: var(--white-soft);
    overflow: hidden;
    outline: none;
  }

  .ghost {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background: var(--purple-soft);
    pointer-events: none;
    border-radius: 4px;
    opacity: 0;
    visibility: hidden;
  }

  .canvas-content {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.3s ease;

    &.ready {
      opacity: 1;
    }
  }

  .close-btn {
    position: fixed;
    top: var(--space-sm, 0.75rem);
    right: var(--space-sm, 0.75rem);
    z-index: 20;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    transition: background 0.15s;
    padding: 0;
    margin: 0;

    &:hover {
      background: var(--purple-soft);
    }
  }

  .canvas-title {
    position: fixed;
    top: var(--space-sm, 0.75rem);
    left: var(--space-sm, 0.75rem);
    z-index: 20;
    color: var(--white);
    font-size: var(--font-size-1, 1rem);
    font-weight: var(--font-weight-medium, 500);
    margin: 0;
    text-transform: capitalize;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  }

  .stage {
    position: absolute;
    top: 0;
    left: 0;
    will-change: transform;
    user-select: none;
    cursor: grab;
    touch-action: none;

    &:active {
      cursor: grabbing;
    }

    // `is-dragging` is toggled imperatively from JS (Draggable
    // callbacks), so Svelte's CSS scoper doesn't see it in markup —
    // hence `:global` to keep the selectors from being stripped.
    &:global(.is-dragging) {
      cursor: grabbing;
    }

    // Disable hover shadow transitions while actively dragging so the
    // compositor doesn't repaint shadows under a moving transform.
    &:global(.is-dragging) .tile-inner {
      transition: none;
    }
  }

  .masonry-inner {
    grid-auto-rows: var(--row-h);
    overflow: visible;
  }

  .tile {
    --w: 1;
    --h: 1;
    aspect-ratio: var(--w) / var(--h);
    width: 100%;
    grid-row: span var(--span);
    align-self: start;
    text-decoration: none;
    color: inherit;
    display: block;

    // content-visibility skips rendering work for tiles offscreen; the
    // intrinsic size keeps the masonry grid from collapsing while the
    // tile is "hidden".
    content-visibility: auto;
    contain-intrinsic-size: var(--frame-width) var(--frame-width);

    .tile-inner {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      inset: calc(var(--gap, 0) / 2);
      overflow: hidden;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      transition: box-shadow 0.15s;
      cursor: zoom-in;
      outline: 3px solid var(--purple-soft);
      background-color: #fff;
      &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
      }
    }

    img {
      width: 100%;
      height: auto;
      padding: 2.5%;
      box-sizing: border-box;
      object-fit: contain;
      display: block;
      pointer-events: none;
    }
  }
</style>
