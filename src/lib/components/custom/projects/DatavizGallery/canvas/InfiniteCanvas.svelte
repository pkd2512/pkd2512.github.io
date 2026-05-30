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
   *   items: Array<{img_url:string, ref_url?:string, title?:string, aspect:number}>,
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
      thumb: tileUrl(it.img_url),
      srcset: THUMB_WIDTHS.map((w) => `${thumbAt(it.img_url, w)} ${w}w`).join(
        ', '
      ),
      href: it.ref_url || fullUrl(it.img_url),
      alt: it.title || '',
      key: it.img_url + '#' + i,
    }))
  );

  /** @type {HTMLDivElement | undefined} */
  let stageEl;
  /** @type {HTMLDivElement | undefined} */
  let overlayEl;
  /** @type {HTMLDivElement | undefined} */
  let ghostEl;
  /** @type {HTMLDivElement | undefined} */
  let zoomEl;
  /** @type {HTMLImageElement | undefined} */
  let zoomImgEl;

  let contentWidth = $state(2500);

  /**
   * Index of the currently zoomed tile, or -1 if none. Reactive so the
   * markup can show the caption + blur the stage.
   */
  let zoomedIndex = $state(-1);
  let zoomedItem = $derived(zoomedIndex >= 0 ? tiles[zoomedIndex] : null);

  /** Reference to the Draggable instance so zoom/close can pause it. */
  /** @type {any} */
  let _draggable = null;

  /**
   * Stage transform snapshot taken at the moment we entered zoom — so
   * close() can return to exactly where the user was panning.
   * @type {{ x: number, y: number } | null}
   */
  let _preZoom = null;

  /** Scale factor used when zooming a tile into focus. */
  const ZOOM_SCALE = 2.4;

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

    // Manual click-vs-drag tracking. gsap Draggable's onClick is
    // unreliable in some browsers (the synthetic click never fires if
    // there's even a 1-2px pointer movement between down and up), so
    // we track pointer position ourselves and call openZoom when the
    // gesture qualifies as a click.
    /** @type {{x:number,y:number}|null} */
    let _downAt = null;
    const CLICK_THRESHOLD = 6;
    /** @param {PointerEvent} e */
    function onPointerDown(e) {
      _downAt = { x: e.clientX, y: e.clientY };
    }
    /** @param {PointerEvent} e */
    function onPointerUp(e) {
      const start = _downAt;
      _downAt = null;
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (Math.hypot(dx, dy) > CLICK_THRESHOLD) return;
      if (zoomedIndex >= 0) {
        closeZoom();
        return;
      }
      const tile = /** @type {HTMLElement | null} */ (
        /** @type {HTMLElement} */ (e.target).closest('.tile')
      );
      if (!tile) return;
      const idxAttr = /** @type {HTMLElement} */ (tile).dataset.index;
      const idx = idxAttr != null ? Number(idxAttr) : NaN;
      if (Number.isNaN(idx)) return;
      openZoom(idx);
    }

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
        // Note: tile clicks are handled by the pointerdown/up
        // listeners attached below — Draggable's own onClick is
        // unreliable for synthetic clicks.
      })[0];
      _draggable = draggable;

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
      // Pointer-based click detection (more reliable than Draggable.onClick).
      stageEl?.addEventListener('pointerdown', onPointerDown);
      stageEl?.addEventListener('pointerup', onPointerUp);
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
      stageEl?.removeEventListener('pointerdown', onPointerDown);
      stageEl?.removeEventListener('pointerup', onPointerUp);
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
      if (zoomedIndex >= 0) {
        closeZoom();
      } else {
        close();
      }
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

  /**
   * Swap a tile's <img> from its thumbnail to the full-resolution
   * source (or back). The original thumb attributes are stashed onto
   * the element's dataset so close-zoom can restore them.
   * @param {HTMLImageElement | null | undefined} img
   * @param {boolean} toFull
   * @param {string} fullSrc
   */
  function swapTileImage(img, toFull, fullSrc) {
    if (!img) return;
    if (toFull) {
      if (img.dataset.thumbCached) return;
      img.dataset.thumbCached = '1';
      img.dataset.thumbSrc = img.currentSrc || img.src || '';
      img.dataset.thumbSrcset = img.srcset || '';
      img.removeAttribute('srcset');
      img.src = fullSrc;
    } else {
      if (!img.dataset.thumbCached) return;
      const src = img.dataset.thumbSrc || '';
      const ss = img.dataset.thumbSrcset || '';
      // srcset must be set before src so the browser doesn't kick off
      // a redundant request from the bare src.
      if (ss) img.srcset = ss;
      else img.removeAttribute('srcset');
      if (src) img.src = src;
      delete img.dataset.thumbCached;
      delete img.dataset.thumbSrc;
      delete img.dataset.thumbSrcset;
    }
  }

  /**
   * Open the zoom for the tile at `idx`. Instead of cloning the tile
   * into a separate layer, we *transform the whole stage* — translate
   * it so the tile sits at viewport centre, then scale up via a 3D
   * transform so the whole grid feels "closer". Non-focused tiles
   * get blurred via CSS for depth.
   * @param {number} idx
   */
  function openZoom(idx) {
    if (!gsap || !stageEl) return;
    if (idx < 0 || idx >= tiles.length) return;
    if (zoomedIndex === idx) return;

    const tileEl = /** @type {HTMLElement | null} */ (
      stageEl.querySelector(`.tile[data-index="${idx}"] .tile-inner`)
    );
    if (!tileEl) return;
    const rect = tileEl.getBoundingClientRect();

    // Current stage transform (Draggable + wheel keep these in sync).
    const curX = Number(gsap.getProperty(stageEl, 'x')) || 0;
    const curY = Number(gsap.getProperty(stageEl, 'y')) || 0;

    // Tile centre in stage-local (un-transformed) coordinates.
    // (We never enter openZoom while already zoomed, so curScale = 1.)
    const localX = rect.x + rect.width / 2 - curX;
    const localY = rect.y + rect.height / 2 - curY;

    // Target translate so that, after scaling around (0,0), the tile
    // centre lands at viewport centre.
    const S = ZOOM_SCALE;
    const tx = window.innerWidth / 2 - S * localX;
    const ty = window.innerHeight / 2 - S * localY;

    // Remember where we came from so close() can put us back exactly.
    _preZoom = { x: curX, y: curY };

    // Pause panning. Draggable continually re-applies its own transform
    // to the element, which fights any scale/translate tween we issue.
    // `disable()` alone isn't enough — kill any active inertia/throw
    // tweens it spawned, too.
    try {
      _draggable?.disable();
      _draggable?.endDrag?.();
    } catch (_) {
      /* ignore */
    }

    zoomedIndex = idx;

    // Swap the focused tile's <img> to the full-resolution source so
    // the zoomed-in view actually shows extra detail.
    const img = /** @type {HTMLImageElement | null} */ (
      tileEl.querySelector('img')
    );
    swapTileImage(img, true, fullUrl(tiles[idx].item.url));

    // Kill ALL active tweens on the stage (including the quickTo
    // helpers fed by the wheel handler), and lock in the current
    // transform with `set` so the upcoming `to` has a known starting
    // point with the right transformOrigin.
    gsap.killTweensOf(stageEl);
    gsap.set(stageEl, { transformOrigin: '0 0' });
    gsap.to(stageEl, {
      x: tx,
      y: ty,
      scale: S,
      duration: 0.6,
      ease: 'power3.out',
      force3D: true,
      overwrite: true,
      onStart: () => {
        // eslint-disable-next-line no-console
        console.log('[gallery] tween start', { tx, ty, S });
      },
      onUpdate: function () {
        // eslint-disable-next-line no-console
        console.log(
          '[gallery] tween tick',
          gsap.getProperty(stageEl, 'x'),
          gsap.getProperty(stageEl, 'y'),
          gsap.getProperty(stageEl, 'scale')
        );
      },
    });
  }

  /**
   * Close the zoom: tween scale back to 1 and translate back to the
   * pre-zoom position, restore the thumb image, re-enable panning.
   */
  function closeZoom() {
    if (!gsap || !stageEl) return;
    if (zoomedIndex < 0) return;
    const idx = zoomedIndex;
    const target = _preZoom || { x: 0, y: 0 };

    // Restore the thumb on the focused tile up-front so the shrinking
    // tween shows the right image immediately.
    const tileEl = /** @type {HTMLElement | null} */ (
      stageEl.querySelector(`.tile[data-index="${idx}"] .tile-inner`)
    );
    const img = /** @type {HTMLImageElement | null} */ (
      tileEl?.querySelector('img')
    );
    swapTileImage(img, false, '');

    zoomedIndex = -1;
    _preZoom = null;

    gsap.killTweensOf(stageEl);
    gsap.to(stageEl, {
      x: target.x,
      y: target.y,
      scale: 1,
      duration: 0.5,
      ease: 'power3.inOut',
      transformOrigin: '0 0',
      force3D: true,
      onComplete: () => {
        try {
          _draggable?.enable();
        } catch (_) {
          /* ignore */
        }
      },
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

    <div
      class="stage"
      bind:this={stageEl}
      class:is-zoomed={zoomedIndex >= 0}
      onclick={zoomedIndex >= 0 ? closeZoom : undefined}
      role={zoomedIndex >= 0 ? 'button' : undefined}
      tabindex={zoomedIndex >= 0 ? 0 : undefined}
      aria-label={zoomedIndex >= 0 ? 'Close zoomed image' : undefined}
    >
      <div class="masonry-inner" style={masonryContainerStyle(contentWidth)}>
        {#each tiles as t, i (t.key)}
          <div
            class="tile"
            class:is-focused={zoomedIndex === i}
            style={t.style}
            aria-label={t.alt}
            data-index={i}
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
          </div>
        {/each}
      </div>
    </div>

    <!-- Caption + optional reference link. Lives outside the stage so
         it doesn't get scaled along with the grid. -->
    {#if zoomedItem && zoomedItem.alt}
      <div class="zoom-caption" aria-live="polite">
        {#if zoomedItem.item.ref_url}
          <a
            href={zoomedItem.item.ref_url}
            target="_blank"
            rel="noopener"
            onclick={(e) => e.stopPropagation()}
          >
            {zoomedItem.alt}
          </a>
        {:else}
          <span>{zoomedItem.alt}</span>
        {/if}
      </div>
    {/if}
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
    // Establish a 3D context so the scale tween benefits from
    // hardware compositing.
    transform-style: preserve-3d;
    backface-visibility: hidden;

    &.is-zoomed {
      cursor: zoom-out;
    }

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

  // Bottom caption shown while a tile is zoomed. Sits *outside* the
  // transformed stage so its position doesn't get scaled along with
  // the grid.
  .zoom-caption {
    position: fixed;
    left: 50%;
    bottom: var(--space-sm, 1rem);
    transform: translateX(-50%);
    z-index: 25;
    padding: var(--space-2xs, 0.5rem) var(--space-md, 1.5rem);
    max-width: min(90vw, 720px);
    background: rgba(0, 0, 0, 0.7);
    color: var(--white, #fff);
    font-size: var(--font-size-0, 1rem);
    text-align: center;
    border-radius: 999px;
    backdrop-filter: blur(6px);
    pointer-events: auto;

    a {
      color: inherit;
      text-decoration: underline;

      &:hover {
        color: var(--purple-soft);
      }
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
    cursor: zoom-in;

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
      transition:
        box-shadow 0.15s,
        filter 0.45s ease,
        opacity 0.45s ease;
      cursor: zoom-in;
      outline: 3px solid var(--purple-soft);
      background-color: #fff;
      &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
      }
    }

    // While the stage is zoomed, lift the focused tile above the
    // others (each tile has random jitter z-index between 6-14 from
    // tileStyle) and beef up its shadow for a "popping" feel.
    &.is-focused {
      z-index: 100 !important;
    }
    &.is-focused .tile-inner {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
      cursor: zoom-out;
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
