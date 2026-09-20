<script>
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import {
    tileStyle,
    masonryContainerStyle,
    makePerm,
    calcMasonryWidth,
    frameMetrics,
  } from './infiniteCanvas.js';
  import { mediaUrl, thumbUrl } from '../data/mediaUrl.js';

  const PADDING = 150;

  /** Stage zoom limits, shared by pinch, ctrl-wheel and click-to-focus. */
  const MIN_SCALE = 0.2;
  const MAX_SCALE = 6;

  /** Fraction of the viewport a focused item is scaled to fill. */
  const FOCUS_FIT = 0.82;

  /** On-screen height (px) of the caption band under a focused card. */
  const CAPTION_H = 76;

  /**
   * Shared gsap reference. Populated by the dynamic import inside
   * `onMount`, then re-used by handlers that fire after mount (keydown,
   * close). Keeps us from leaking onto `window.gsap`.
   * @type {any}
   */
  let gsap;

  /**
   * @type {{
   *   items: Array<{
   *     img_url: string, ref_url?: string, title?: string, alt?: string,
   *     client?: string, graphic_type?: string, category?: string,
   *     aspect: number
   *   }>,
   *   title?: string,
   *   originRect: DOMRect | null,
   *   reveal?: {polygon: [number, number][], x: number, y: number, scale: number, anchor: [number, number]} | null,
   *   portalEl?: HTMLElement | null,
   *   onclose: () => void
   * }}
   */
  let {
    items = [],
    title = '',
    originRect = null,
    reveal = null,
    portalEl = null,
    onclose,
  } = $props();

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

  /** Tile geometry, recomputed whenever the viewport changes width. */
  let metrics = $state(frameMetrics(1200));
  let contentWidth = $state(2500);

  // `sizes` tracks the frame width so the browser can pick 300w on a
  // phone instead of always pulling the 600w file.
  let tileSizes = $derived(`${metrics.frameW}px`);

  // Precompute the per-tile data (style string + thumbnail URLs) once
  // per `items`/`title`/`perm`/`metrics` change, so the `{#each}` block
  // doesn't rebuild strings on every reactive tick.
  let tiles = $derived(
    items.map((it, i) => ({
      item: it,
      style: tileStyle(it, title, i, perm, metrics.frameW, metrics.gap),
      small: thumbUrl(it.img_url, 300),
      srcset: THUMB_WIDTHS.map((w) => `${thumbUrl(it.img_url, w)} ${w}w`).join(
        ', '
      ),
      full: mediaUrl(it.img_url),
      label: it.title || '',
      key: it.img_url + '#' + i,
    }))
  );

  /** @type {HTMLDivElement | undefined} */
  let stageEl;
  /** @type {HTMLDivElement | undefined} */
  let overlayEl;
  /** @type {HTMLDivElement | undefined} */
  let ghostEl;

  /** Index of the tile currently in focus, or -1 while browsing the wall. */
  let zoomedIndex = $state(-1);

  /** Reference to the Draggable instance so focus/close can pause it. */
  /** @type {any} */
  let _draggable = null;

  /**
   * Stage transform captured the moment we zoomed in, so leaving focus
   * returns the reader to exactly the spot on the wall they came from.
   * @type {{ x: number, y: number, scale: number } | null}
   */
  let _preZoom = null;

  /** @type {{minX:number,maxX:number,minY:number,maxY:number}} */
  let _bounds = {
    minX: -Infinity,
    maxX: Infinity,
    minY: -Infinity,
    maxY: Infinity,
  };

  let ready = $state(false);

  /**
   * Captions and links sit inside the scaled stage, so they'd balloon
   * along with the artwork. This counter-scale keeps them at a constant
   * on-screen size; it's tweened alongside every stage scale change.
   * @param {number} scale
   */
  function setInverseScale(scale) {
    stageEl?.style.setProperty('--inv', String(1 / scale));
  }

  // ----- Window reveal ------------------------------------------------
  // Opened from a chart cell, the gallery starts clipped to that cell's
  // outline over an identical render of the wall, then the outline grows
  // until it covers the screen. Closing runs it backwards.

  const REVEAL_MS = 800;
  const CONCEAL_MS = 550;

  /** Current growth of the outline (1 = the cell itself). */
  let maskScale = 1;
  let maskRaf = 0;
  let revealDone = false;

  /**
   * Vertex average. Voronoi cells are convex, so it's always inside.
   * @param {[number, number][]} poly
   * @returns {[number, number]}
   */
  function polyCentre(poly) {
    let x = 0;
    let y = 0;
    for (const p of poly) {
      x += p[0];
      y += p[1];
    }
    return [x / poly.length, y / poly.length];
  }

  /**
   * How far the outline must grow about `c` to cover the viewport: each
   * viewport corner must fall inside, so find where the ray from `c` to
   * that corner crosses the outline.
   * @param {[number, number][]} poly
   * @param {[number, number]} c
   */
  function coverScale(poly, c) {
    const W = window.innerWidth;
    const H = window.innerHeight;
    let k = 1;
    for (const [px, py] of [
      [0, 0],
      [W, 0],
      [W, H],
      [0, H],
    ]) {
      const dx = px - c[0];
      const dy = py - c[1];
      let hit = Infinity;
      for (let i = 0; i < poly.length; i++) {
        const [ax, ay] = poly[i];
        const [bx, by] = poly[(i + 1) % poly.length];
        const ex = bx - ax;
        const ey = by - ay;
        const den = dx * ey - dy * ex;
        if (Math.abs(den) < 1e-9) continue;
        const qx = ax - c[0];
        const qy = ay - c[1];
        const t = (qx * ey - qy * ex) / den;
        const u = (qx * dy - qy * dx) / den;
        if (t > 0 && u >= 0 && u <= 1 && t < hit) hit = t;
      }
      if (hit < Infinity) k = Math.max(k, 1 / hit);
    }
    return k * 1.05;
  }

  /**
   * @param {[number, number][]} poly
   * @param {[number, number]} c
   * @param {number} k
   */
  function clipAt(poly, c, k) {
    return (
      'polygon(' +
      poly
        .map(
          ([x, y]) =>
            `${(c[0] + (x - c[0]) * k).toFixed(1)}px ${(c[1] + (y - c[1]) * k).toFixed(1)}px`
        )
        .join(', ') +
      ')'
    );
  }

  /** @type {any} */
  let windowTween = null;

  /** The point the portal zooms toward: where the reader clicked. */
  function portalCentre() {
    return reveal?.anchor ?? polyCentre(reveal?.polygon ?? []);
  }

  /**
   * Scale the cell outline by `k` about `c` — and the chart page with it,
   * so the whole page flies toward the reader and the clicked cell's own
   * border stays exactly on the mask edge.
   * @param {[number, number][]} poly
   * @param {[number, number]} c
   * @param {number} k
   */
  function applyWindow(poly, c, k) {
    if (overlayEl) overlayEl.style.clipPath = clipAt(poly, c, k);
    if (portalEl) portalEl.style.transform = k === 1 ? '' : `scale(${k})`;
  }

  /**
   * Pin the page's zoom origin to the portal centre and promote it to its
   * own layer for the flight (a stretched bitmap is fine while it rushes past).
   * @param {boolean} on
   */
  function preparePortal(on) {
    if (!portalEl) return;
    if (on) {
      const c = portalCentre();
      portalEl.style.transform = '';
      const r = portalEl.getBoundingClientRect();
      portalEl.style.transformOrigin = `${c[0] - r.left}px ${c[1] - r.top}px`;
      portalEl.style.willChange = 'transform';
    } else {
      portalEl.style.willChange = '';
    }
  }

  /**
   * Grow/shrink the outline to `maskTo` and, if given, move the camera to
   * `stageTo` — driven by one tween so the two can never drift apart, even
   * when frames drop (gsap slows its clock on a hitch; a wall-clock rAF
   * loop doesn't). Falls back to a mask-only rAF loop before gsap loads.
   * @param {number} maskTo
   * @param {{x: number, y: number, scale: number} | null} stageTo
   * @param {number} ms
   * @param {() => void} [done]
   */
  function tweenWindow(maskTo, stageTo, ms, done) {
    cancelAnimationFrame(maskRaf);
    windowTween?.kill();
    if (!reveal || !overlayEl) return done?.();
    if (!gsap || !stageEl) return animateMask(maskTo, ms, done);
    const poly = reveal.polygon;
    const c = portalCentre();
    const m0 = maskScale;
    const x0 = Number(gsap.getProperty(stageEl, 'x')) || 0;
    const y0 = Number(gsap.getProperty(stageEl, 'y')) || 0;
    const k0 = Number(gsap.getProperty(stageEl, 'scale')) || 1;
    gsap.killTweensOf(stageEl);
    // Frame widths hang off --inv; changing it re-rasterises every card, so
    // hold it at the chart's value for the flight and settle it at the end.
    if (stageTo) setInverseScale(reveal.scale);
    const p = { t: 0 };
    windowTween = gsap.to(p, {
      t: 1,
      duration: ms / 1000,
      ease: 'power2.inOut',
      onUpdate: () => {
        maskScale = m0 + (maskTo - m0) * p.t;
        applyWindow(poly, c, maskScale);
        if (!stageTo) return;
        // x, y and scale all move linearly in t, which keeps the anchor
        // point fixed on screen throughout the zoom.
        const k = k0 + (stageTo.scale - k0) * p.t;
        gsap.set(stageEl, {
          x: x0 + (stageTo.x - x0) * p.t,
          y: y0 + (stageTo.y - y0) * p.t,
          scale: k,
          force3D: true,
        });
      },
      onComplete: () => {
        if (stageTo) setInverseScale(stageTo.scale);
        done?.();
      },
    });
  }

  /**
   * Tween the outline's growth to `to` on a wall-clock rAF loop.
   * @param {number} to
   * @param {number} ms
   * @param {() => void} [done]
   */
  function animateMask(to, ms, done) {
    cancelAnimationFrame(maskRaf);
    if (!reveal || !overlayEl) return done?.();
    const poly = reveal.polygon;
    const c = portalCentre();
    const from = maskScale;
    const t0 = performance.now();
    /** @param {number} now */
    const step = (now) => {
      const t = Math.min(1, (now - t0) / ms);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      maskScale = from + (to - from) * e;
      applyWindow(poly, c, maskScale);
      if (t < 1) maskRaf = requestAnimationFrame(step);
      else done?.();
    };
    maskRaf = requestAnimationFrame(step);
  }

  /**
   * Resolve once the images under the outline have decoded — they're cached
   * from the chart's windows — or after `ms`, whichever comes first.
   * @param {[number, number][]} poly
   * @param {number} ms
   */
  function imagesUnder(poly, ms) {
    const xs = poly.map((p) => p[0]);
    const ys = poly.map((p) => p[1]);
    const l = Math.min(...xs);
    const r = Math.max(...xs);
    const t = Math.min(...ys);
    const b = Math.max(...ys);
    const imgs = [...(stageEl?.querySelectorAll('img') || [])].filter((img) => {
      const box = img.getBoundingClientRect();
      return box.right > l && box.left < r && box.bottom > t && box.top < b;
    });
    return Promise.race([
      Promise.all(imgs.map((img) => img.decode().catch(() => {}))),
      new Promise((res) => setTimeout(res, ms)),
    ]);
  }

  onMount(() => {
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

    function applyMetrics() {
      const next = frameMetrics(window.innerWidth);
      if (next.frameW !== metrics.frameW) metrics = next;
      contentWidth = calcMasonryWidth(items.length, next.frameW, next.gap);
    }
    applyMetrics();

    // Lock page scroll, padding for the scrollbar that disappears — the
    // chart underneath must not shift while the gallery sits over it.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    /** Starts upgrading tiles to their full srcset; set up once gsap loads. */
    let observeImages = () => {};

    /** Settles once gsap + Draggable are set up (in the async block below). */
    /** @type {() => void} */
    let gsapReady = () => {};
    const gsapLoaded = new Promise((res) => (gsapReady = () => res(undefined)));

    if (reveal && stageEl && overlayEl) {
      const from = reveal;
      tx = from.x;
      ty = from.y;
      stageEl.style.transform = `translate(${from.x}px, ${from.y}px) scale(${from.scale})`;
      setInverseScale(from.scale);
      const c = portalCentre();
      overlayEl.style.clipPath = clipAt(from.polygon, c, 1);
      // Hold the first frame until the cards under the window are ready,
      // or the reveal would open on blank frames.
      overlayEl.style.visibility = 'hidden';
      Promise.all([imagesUnder(from.polygon, 200), gsapLoaded]).then(() => {
        if (cancelled || !overlayEl || !stageEl) return;
        overlayEl.style.visibility = '';
        // While the window opens, zoom the wall to full size about the
        // anchor, so the cards under the pointer stay under it and grow.
        const [ax, ay] = from.anchor;
        const lx = (ax - from.x) / from.scale;
        const ly = (ay - from.y) / from.scale;
        try {
          _draggable?.disable();
        } catch (_) {
          /* ignore */
        }
        preparePortal(true);
        tweenWindow(
          coverScale(from.polygon, c),
          { x: ax - lx, y: ay - ly, scale: 1 },
          REVEAL_MS,
          () => {
            revealDone = true;
            if (overlayEl) overlayEl.style.clipPath = '';
            preparePortal(false);
            // Only now fetch sharper images: mid-flight loads and decodes
            // compete with the animation.
            observeImages();
            tx = Number(gsap.getProperty(stageEl, 'x')) || 0;
            ty = Number(gsap.getProperty(stageEl, 'y')) || 0;
            recomputeBounds();
            try {
              _draggable?.enable();
            } catch (_) {
              /* ignore */
            }
          }
        );
      });
    }

    /** Current stage scale, read back off the live gsap transform. */
    function stageScale() {
      return gsap ? Number(gsap.getProperty(stageEl, 'scale')) || 1 : 1;
    }

    // Manual click-vs-drag tracking. gsap Draggable's onClick is
    // unreliable in some browsers (the synthetic click never fires if
    // there's even a 1-2px pointer movement between down and up), so
    // we track pointer position ourselves and decide here.
    /** @type {{x:number,y:number}|null} */
    let _downAt = null;
    const CLICK_THRESHOLD = 6;

    /** Live pointers on the stage, for pinch detection. */
    /** @type {Map<number, {x:number, y:number}>} */
    const pointers = new Map();
    /** @type {{dist:number, scale:number, x:number, y:number} | null} */
    let _pinch = null;

    /** @param {PointerEvent} e */
    function onPointerDown(e) {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) startPinch();
      _downAt = { x: e.clientX, y: e.clientY };
    }

    /** @param {PointerEvent} e */
    function onPointerMove(e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (_pinch && pointers.size >= 2) movePinch();
    }

    /** @param {PointerEvent} e */
    function onPointerUp(e) {
      const wasPinching = !!_pinch;
      pointers.delete(e.pointerId);
      if (wasPinching && pointers.size < 2) endPinch();

      const start = _downAt;
      _downAt = null;
      if (!start || wasPinching) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (Math.hypot(dx, dy) > CLICK_THRESHOLD) return;

      const target = /** @type {HTMLElement} */ (e.target);
      // The source link is a real anchor — let the browser open it
      // instead of treating the tap as a zoom gesture.
      if (target.closest('a')) return;

      const tile = /** @type {HTMLElement | null} */ (target.closest('.tile'));
      if (!tile) {
        // Tapping empty wall while focused steps back out.
        if (zoomedIndex >= 0) closeZoom();
        return;
      }
      const idx = Number(tile.dataset.index);
      if (Number.isNaN(idx)) return;
      if (zoomedIndex === idx) closeZoom();
      else openZoom(idx);
    }

    // The stage only spans the cards, so clicks on the empty backdrop
    // around a zoomed card never reach its pointer handlers.
    /** @param {MouseEvent} e */
    function onOverlayClick(e) {
      if (zoomedIndex < 0 || !stageEl) return;
      const target = /** @type {HTMLElement} */ (e.target);
      if (stageEl.contains(target) || target.closest('button, a')) return;
      closeZoom();
    }

    /** Midpoint + separation of the two live pointers. */
    function pinchGeometry() {
      const [a, b] = [...pointers.values()];
      return {
        dist: Math.hypot(b.x - a.x, b.y - a.y) || 1,
        mx: (a.x + b.x) / 2,
        my: (a.y + b.y) / 2,
      };
    }

    function startPinch() {
      if (!gsap || !stageEl) return;
      const { dist } = pinchGeometry();
      // Draggable keeps writing its own x/y while a finger is down, which
      // fights the transform we're about to compute — park it for the
      // duration of the gesture.
      try {
        _draggable?.disable();
      } catch (_) {
        /* ignore */
      }
      gsap.killTweensOf(stageEl);
      _pinch = {
        dist,
        scale: stageScale(),
        x: Number(gsap.getProperty(stageEl, 'x')) || 0,
        y: Number(gsap.getProperty(stageEl, 'y')) || 0,
      };
    }

    function movePinch() {
      if (!_pinch || !gsap || !stageEl) return;
      const { dist, mx, my } = pinchGeometry();
      const scale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, (_pinch.scale * dist) / _pinch.dist)
      );
      // With transform-origin at 0 0, the stage-local point under the
      // fingers is (screen - pos) / scale. Solve for the position that
      // keeps that same local point under the (possibly moved) midpoint.
      const localX = (mx - _pinch.x) / _pinch.scale;
      const localY = (my - _pinch.y) / _pinch.scale;
      gsap.set(stageEl, {
        scale,
        x: mx - scale * localX,
        y: my - scale * localY,
      });
      setInverseScale(scale);
    }

    function endPinch() {
      _pinch = null;
      if (!gsap || !stageEl) return;
      tx = Number(gsap.getProperty(stageEl, 'x')) || 0;
      ty = Number(gsap.getProperty(stageEl, 'y')) || 0;
      recomputeBounds();
      try {
        _draggable?.enable();
      } catch (_) {
        /* ignore */
      }
    }

    /** @param {WheelEvent} e */
    function onWheel(e) {
      if (!stageEl || !xTo) return;
      e.preventDefault();

      // Trackpad pinch and ctrl+wheel arrive as a wheel event with
      // ctrlKey set — treat those as zoom rather than pan.
      if (e.ctrlKey && gsap) {
        const cur = stageScale();
        const scale = Math.max(
          MIN_SCALE,
          Math.min(MAX_SCALE, cur * (1 - e.deltaY * 0.01))
        );
        const px = Number(gsap.getProperty(stageEl, 'x')) || 0;
        const py = Number(gsap.getProperty(stageEl, 'y')) || 0;
        const localX = (e.clientX - px) / cur;
        const localY = (e.clientY - py) / cur;
        gsap.killTweensOf(stageEl);
        tx = e.clientX - scale * localX;
        ty = e.clientY - scale * localY;
        gsap.set(stageEl, { scale, x: tx, y: ty });
        setInverseScale(scale);
        recomputeBounds();
        return;
      }

      // Scrolling away from a focused item releases it, so the reader
      // never gets stuck zoomed in.
      if (zoomedIndex >= 0) {
        closeZoom();
        return;
      }

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
      const k = stageScale();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cw = contentWidth * k;
      const ch = (masonryInner ? masonryInner.scrollHeight : vh) * k;
      const maxX = PADDING;
      const minX = -(cw - vw) - PADDING;
      const maxY = PADDING;
      const minY = -(ch - vh) - PADDING;
      // Always admit where the wall is now (e.g. where the chart's window
      // placed it) — applyBounds would otherwise yank it into range.
      const px = gsap ? Number(gsap.getProperty(stageEl, 'x')) || 0 : tx;
      const py = gsap ? Number(gsap.getProperty(stageEl, 'y')) || 0 : ty;
      _bounds = {
        minX: Math.min(minX, maxX, px),
        maxX: Math.max(minX, maxX, px),
        minY: Math.min(minY, maxY, py),
        maxY: Math.max(minY, maxY, py),
      };
      // Re-clamp the current target so it doesn't sit outside new bounds.
      tx = Math.max(_bounds.minX, Math.min(_bounds.maxX, tx));
      ty = Math.max(_bounds.minY, Math.min(_bounds.maxY, ty));
      if (draggable) draggable.applyBounds(_bounds);
    }

    // Expose the pieces the zoom helpers below need. They live outside
    // onMount so the template and keyboard handler can call them.
    _ctx = {
      stageScale,
      recomputeBounds,
      syncPan: () => {
        tx = Number(gsap.getProperty(stageEl, 'x')) || 0;
        ty = Number(gsap.getProperty(stageEl, 'y')) || 0;
      },
    };

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
      setInverseScale(reveal?.scale ?? 1);

      // Entrance ghost zoom (snapshot rect, autoAlpha for visibility).
      if (ghostEl && initialRect && !reveal) {
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
        // Draggable raises the target's z-index on every press by default,
        // which soon lifts the whole wall over the back pill.
        zIndexBoost: false,
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
      gsapReady();

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
        resizeObs = new ResizeObserver(() => {
          applyMetrics();
          recomputeBounds();
        });
        resizeObs.observe(overlayEl);
      }

      // Tiles start on the small 300w thumb (already cached by the chart's
      // windows) and only take on the full `srcset` once near the
      // viewport (generous root margin so panning doesn't catch them).
      if (typeof IntersectionObserver !== 'undefined') {
        imgObs = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (!e.isIntersecting) continue;
              const img = /** @type {HTMLImageElement} */ (e.target);
              const ss = img.dataset.srcset;
              if (ss && !img.srcset) img.srcset = ss;
              imgObs?.unobserve(img);
            }
          },
          { root: null, rootMargin: '200% 200%', threshold: 0 }
        );
        observeImages = () => {
          if (cancelled || !stageEl) return;
          stageEl
            .querySelectorAll('img[data-srcset]')
            .forEach((/** @type {Element} */ img) => imgObs?.observe(img));
        };
        // Opening from the chart, wait until the reveal has landed.
        if (!reveal) requestAnimationFrame(observeImages);
      }

      // Wheel + pointer input.
      overlayEl?.addEventListener('wheel', onWheel, { passive: false });
      overlayEl?.addEventListener('click', onOverlayClick);
      stageEl?.addEventListener('pointerdown', onPointerDown);
      stageEl?.addEventListener('pointermove', onPointerMove);
      stageEl?.addEventListener('pointerup', onPointerUp);
      stageEl?.addEventListener('pointercancel', onPointerUp);
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
      overlayEl?.removeEventListener('click', onOverlayClick);
      stageEl?.removeEventListener('pointerdown', onPointerDown);
      stageEl?.removeEventListener('pointermove', onPointerMove);
      stageEl?.removeEventListener('pointerup', onPointerUp);
      stageEl?.removeEventListener('pointercancel', onPointerUp);
      resizeObs?.disconnect();
      imgObs?.disconnect();
      if (gsap && stageEl) gsap.killTweensOf(stageEl);
      if (gsap && ghostEl) gsap.killTweensOf(ghostEl);
      cancelAnimationFrame(maskRaf);
      windowTween?.kill();
      if (portalEl) {
        portalEl.style.transform = '';
        portalEl.style.transformOrigin = '';
        portalEl.style.willChange = '';
      }
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  });

  /**
   * Handles owned by `onMount` that the zoom helpers need.
   * @type {{stageScale: () => number, recomputeBounds: () => void, syncPan: () => void} | null}
   */
  let _ctx = null;

  /**
   * Swap a tile's <img> from its thumbnail to the full-resolution
   * source (or back). The original thumb attributes are stashed onto
   * the element's dataset so leaving focus can restore them.
   * @param {HTMLImageElement | null | undefined} img
   * @param {boolean} toFull
   * @param {string} fullSrc
   */
  function swapTileImage(img, toFull, fullSrc) {
    if (!img) return;
    if (toFull) {
      if (img.dataset.thumbCached || !fullSrc) return;
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
   * Walk the reader up to one item: pan and scale the wall so the tile
   * sits centred and near-full-height, then load the full-resolution
   * file in place of its thumbnail. Nothing is lifted out of the grid —
   * the surrounding wall stays put and simply falls back behind.
   * @param {number} idx
   */
  function openZoom(idx) {
    if (!gsap || !stageEl || !_ctx) return;
    if (idx < 0 || idx >= tiles.length) return;

    const tileEl = /** @type {HTMLElement | null} */ (
      stageEl.querySelector(`.tile[data-index="${idx}"] .tile-inner`)
    );
    if (!tileEl) return;
    const rect = tileEl.getBoundingClientRect();

    const curX = Number(gsap.getProperty(stageEl, 'x')) || 0;
    const curY = Number(gsap.getProperty(stageEl, 'y')) || 0;
    const curScale = _ctx.stageScale();

    // Only remember the wall position on the way *in* — stepping between
    // items while focused must not overwrite it.
    if (zoomedIndex < 0 && !_preZoom)
      _preZoom = { x: curX, y: curY, scale: curScale };

    // How much closer we need to get for the item to fill FOCUS_FIT of
    // the viewport. rect is already in screen pixels at curScale, so the
    // ratio is relative to where we're standing now.
    // The caption band unfolds below the card at a fixed on-screen height,
    // so reserve it before fitting the image.
    const fit = Math.min(
      (window.innerWidth * FOCUS_FIT) / rect.width,
      (window.innerHeight * FOCUS_FIT - CAPTION_H) / rect.height
    );
    const S = Math.max(MIN_SCALE, Math.min(MAX_SCALE, curScale * fit));

    // Tile centre in stage-local (untransformed) coordinates, then the
    // translation that lands card + band centred once scaled.
    const localX = (rect.x + rect.width / 2 - curX) / curScale;
    const localY = (rect.y + rect.height / 2 - curY) / curScale;
    const nx = window.innerWidth / 2 - S * localX;
    const ny = window.innerHeight / 2 - S * localY - CAPTION_H / 2;

    // Pause panning: Draggable continually re-applies its own transform,
    // which fights the tween. `disable()` alone isn't enough — kill any
    // inertia it already spawned, too.
    try {
      _draggable?.disable();
      _draggable?.endDrag?.();
    } catch (_) {
      /* ignore */
    }

    const prev = zoomedIndex;
    stageEl.style.setProperty('--inv-end', String(1 / S));
    zoomedIndex = idx;

    if (prev >= 0 && prev !== idx) restoreThumb(prev);
    swapTileImage(
      /** @type {HTMLImageElement | null} */ (tileEl.querySelector('img')),
      true,
      tiles[idx].full
    );

    gsap.killTweensOf(stageEl);
    // --inv drives frame widths; set it for the closer end of the move and
    // leave it alone mid-flight — updating it per frame re-rasterises every
    // card. Frames read slightly thin while zooming, never bold.
    setInverseScale(Math.max(curScale, S));
    gsap.to(stageEl, {
      x: nx,
      y: ny,
      scale: S,
      duration: 0.7,
      ease: 'power3.inOut',
      force3D: true,
      overwrite: true,
      onComplete: () => setInverseScale(S),
    });
  }

  /**
   * Put a tile's thumbnail back in place of the full-resolution file.
   * @param {number} idx
   */
  function restoreThumb(idx) {
    const el = stageEl?.querySelector(
      `.tile[data-index="${idx}"] .tile-inner img`
    );
    swapTileImage(/** @type {HTMLImageElement | null} */ (el), false, '');
  }

  /** Step back to the wall, returning to the exact spot we left. */
  function closeZoom() {
    if (!gsap || !stageEl || zoomedIndex < 0) return;
    const target = _preZoom || { x: 0, y: 0, scale: 1 };
    restoreThumb(zoomedIndex);
    zoomedIndex = -1;
    // Kept until we've actually arrived: a card clicked mid-return must go
    // back to the wall, not to wherever the camera happened to be.
    gsap.killTweensOf(stageEl);
    gsap.to(stageEl, {
      x: target.x,
      y: target.y,
      scale: target.scale,
      duration: 0.6,
      ease: 'power3.inOut',
      force3D: true,
      onComplete: () => {
        _preZoom = null;
        setInverseScale(target.scale);
        _ctx?.syncPan();
        _ctx?.recomputeBounds();
        try {
          _draggable?.enable();
        } catch (_) {
          /* ignore */
        }
      },
    });
  }

  /** Move focus to the neighbouring item without stepping back first. */
  /** @param {number} dir */
  function stepZoom(dir) {
    if (zoomedIndex < 0) return;
    openZoom((zoomedIndex + dir + tiles.length) % tiles.length);
  }

  /** @param {KeyboardEvent} e */
  function handleKeydown(e) {
    if (e.key === 'Escape') {
      if (zoomedIndex >= 0) closeZoom();
      else close();
      return;
    }

    if (zoomedIndex >= 0) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        stepZoom(e.key === 'ArrowRight' ? 1 : -1);
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

  let closing = false;
  function close() {
    if (closing) return;
    closing = true;
    if (reveal && overlayEl && stageEl) {
      // Put the wall back where the window shows it while the outline
      // shrinks, so the chart underneath takes over without a cut.
      if (zoomedIndex >= 0) {
        restoreThumb(zoomedIndex);
        zoomedIndex = -1;
      }
      try {
        _draggable?.disable();
      } catch (_) {
        /* ignore */
      }
      if (revealDone) {
        maskScale = coverScale(reveal.polygon, portalCentre());
      }
      if (portalEl) portalEl.style.willChange = 'transform';
      tweenWindow(
        1,
        { x: reveal.x, y: reveal.y, scale: reveal.scale },
        CONCEAL_MS,
        () => onclose?.()
      );
      return;
    }
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
  style="--frame-width: {metrics.frameW}px; --gap: {metrics.gap}px; --row-h: {metrics.frameW /
    100}px; --cap-h: {CAPTION_H}px;"
>
  <div class="ghost" bind:this={ghostEl}></div>

  <div class="canvas-content" class:ready={ready || !!reveal}>
    <button class="back-pill" onclick={close}>
      <span aria-hidden="true">&larr;</span> Topics
      {#if title}<span class="back-sep" aria-hidden="true">&middot;</span>
        <span class="back-topic">{title}</span>{/if}
    </button>

    <div class="stage" bind:this={stageEl} class:is-zoomed={zoomedIndex >= 0}>
      <div
        class="masonry-inner"
        style={masonryContainerStyle(contentWidth, metrics.frameW, metrics.gap)}
      >
        {#each tiles as t, i (t.key)}
          <div
            class="tile"
            class:is-focused={zoomedIndex === i}
            style={t.style}
            data-index={i}
          >
            <!-- Pointer input is handled by the stage-level drag-vs-click
                 listeners; this button exists so the wall is reachable by
                 keyboard too. -->
            <button
              class="tile-inner"
              type="button"
              aria-label={t.label}
              onkeydown={(e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                e.preventDefault();
                if (zoomedIndex === i) closeZoom();
                else openZoom(i);
              }}
            >
              <img
                src={t.small}
                data-srcset={t.srcset}
                sizes={tileSizes}
                alt={t.label}
                decoding="async"
                fetchpriority="low"
                draggable="false"
              />

              <span class="tile-caption">
                <span class="tile-title">{t.label}</span>
                {#if t.item.client}
                  <span class="tile-client">{t.item.client}</span>
                {/if}
              </span>
            </button>
            <!-- Sibling, not child: an <a> inside a <button> is invalid and
                 Firefox won't follow it. -->
            {#if t.item.ref_url}
              <a
                class="tile-link"
                href={t.item.ref_url}
                target="_blank"
                rel="noopener"
                aria-label="Open source for {t.label}"
              >
                <Icon icon="iconamoon:link-external-duotone" />
              </a>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  // Registered so it can transition, and so the image can read the band's
  // live height mid-animation.
  @property --band {
    syntax: '<length>';
    inherits: true;
    initial-value: 0px;
  }

  .infinite-canvas-overlay {
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

  .back-pill {
    position: fixed;
    top: var(--space-sm, 0.75rem);
    left: var(--space-sm, 0.75rem);
    z-index: 20;
    display: inline-flex;
    align-items: baseline;
    gap: 0.4em;
    margin: 0;
    padding: 0.45em 0.9em 0.45em 0.75em;
    font-family: var(--font-sans);
    font-size: 0.875rem;
    line-height: 1.2;
    letter-spacing: normal;
    text-transform: none;
    color: var(--white, #fff);
    background: rgba(20, 12, 30, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    backdrop-filter: blur(6px);
    cursor: pointer;
    transition: background 0.15s;

    &:hover,
    &:focus-visible {
      background: var(--purple-soft);
    }
  }

  .back-sep {
    opacity: 0.55;
  }

  .back-topic {
    text-transform: capitalize;
    opacity: 0.85;
  }

  .stage {
    --inv: 1;
    position: absolute;
    top: 0;
    left: 0;
    will-change: transform;
    user-select: none;
    cursor: grab;
    touch-action: none;
    // Pinch/wheel/focus zoom all scale about the origin — the anchoring
    // maths assumes this corner, not the default centre.
    transform-origin: 0 0;

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

  .masonry-inner {
    grid-auto-rows: var(--row-h);
    overflow: visible;
  }

  .tile {
    --w: 1;
    --h: 1;
    --card: #f1ede1;
    // Caption band + type hold a constant on-screen size at any zoom.
    // Sized from the zoom we're heading to, not the live one — a value that
    // changes every frame keeps restarting the band's CSS transition.
    --footer-h: calc(var(--cap-h) * var(--inv-end, 1));
    --cap-fs: calc(15px * var(--inv-end, 1));
    --unfold: 0.55s cubic-bezier(0.65, 0, 0.35, 1);
    aspect-ratio: var(--w) / var(--h);
    width: 100%;
    grid-row: span var(--span);
    align-self: start;
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
      flex-direction: column;
      --band: 0px;
      inset: calc(var(--gap, 0) / 2);
      bottom: calc(var(--gap, 0) / 2 - var(--band));
      overflow: hidden;
      border: none;
      padding: 0;
      font: inherit;
      text-align: left;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      // These timings apply on the way *back* to the wall: fold the band away
      // quickly so it doesn't hang over neighbours while the camera pulls out.
      transition:
        --band 0.2s ease-in,
        background-color 0.2s,
        box-shadow 0.2s,
        opacity 0.5s ease,
        filter 0.5s ease;
      cursor: zoom-in;
      // Constant on-screen width at any zoom level.
      // On-screen frame width follows the zoom: 1px at the 0.25x overview,
      // 3px from full size up. Same formula in WallPreview and InfiniteCanvas
      // so the gallery takes over from the chart without a jump.
      --ow: clamp(1px, (1px / var(--inv, 1) - 0.25px) * 2.667 + 1px, 3px);
      outline: calc(var(--ow) * var(--inv, 1)) solid var(--purple-soft);
      background-color: #fff;

      &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
      }

      &:focus-visible {
        outline-color: var(--white, #fff);
        outline-width: calc(4px * var(--inv, 1));
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
      }
    }

    // Always exactly the original frame, however far the band has unfolded,
    // so it covers the caption tucked beneath it.
    img {
      flex: none;
      position: relative;
      z-index: 1;
      width: 100%;
      height: calc(100% - var(--band));
      background-color: inherit;
      padding: 2.5%;
      box-sizing: border-box;
      object-fit: contain;
      display: block;
      pointer-events: none;
    }

    // Lift the item being read above its neighbours; the per-tile jitter
    // z-index sits in the 6-14 range.
    &.is-focused {
      z-index: 100 !important; // beat the inline jitter z-index
      cursor: zoom-out;
      // `auto` implies paint containment, which would clip the unfolded band.
      content-visibility: visible;
    }

    // On focus the card turns to cream stock and unfolds its caption band
    // downward — the grid cell keeps its size, so nothing else reflows.
    &.is-focused .tile-inner {
      cursor: zoom-out;
      --band: var(--footer-h);
      background-color: var(--card);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.45);
      transition:
        --band var(--unfold),
        background-color var(--unfold),
        box-shadow 0.2s,
        opacity 0.5s ease,
        filter 0.5s ease;
    }
  }

  // Everything the reader isn't looking at recedes.
  .stage.is-zoomed .tile:not(.is-focused) .tile-inner {
    opacity: 0.35;
    filter: blur(2px);
  }

  // ----- Postcard caption -------------------------------------------

  .tile-caption {
    position: absolute;
    left: 2.5%;
    right: 2.5%;
    bottom: 0;
    height: var(--footer-h);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.2em;
    padding-right: 1.8em; // clear the link icon
    box-sizing: border-box;
    border-top: calc(1px * var(--inv, 1)) solid rgba(0, 0, 0, 0.12);
    font-size: var(--cap-fs);
    text-transform: none;
    letter-spacing: normal;
    min-width: 0;
    // Pinned to the card's bottom edge beneath the image: as the card grows
    // the caption slides out from under the frame.
    z-index: 0;
    background-color: var(--card);
  }

  .tile-title {
    font-family: var(--font-sans);
    font-weight: var(--font-weight-bold);
    line-height: 1.25;
    color: var(--black-soft);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tile-client {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 0.9em;
    color: var(--gray);
    text-transform: capitalize;
  }

  // Same icon and nudge as the blog referral cards.
  .tile-link {
    position: absolute;
    z-index: 1;
    top: calc(100% - var(--gap) / 2 + 0.6em);
    right: calc(var(--gap) / 2 + var(--frame-width) * 0.03);
    font-size: var(--cap-fs);
    line-height: 0;
    color: var(--black-soft);
    opacity: 0;
    pointer-events: none;
    transition:
      transform 0.35s ease,
      color 0.2s,
      opacity 0.3s ease;

    :global(svg) {
      width: 1.35em;
      height: 1.35em;
    }

    &:hover,
    &:focus-visible {
      color: var(--purple);
      transform: translate(0.15em, -0.15em);
    }
  }

  .tile.is-focused .tile-link {
    opacity: 1;
    pointer-events: auto;
    transition-delay: 0s, 0s, 0.3s;
  }

  @media (prefers-reduced-motion: reduce) {
    .tile .tile-inner,
    .tile-caption,
    .tile-link {
      transition: none;
    }
  }
</style>
