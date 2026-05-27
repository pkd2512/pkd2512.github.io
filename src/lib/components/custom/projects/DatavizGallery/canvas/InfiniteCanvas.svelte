<script>
  import { onMount } from 'svelte';
  import { layoutMasonry, wrap } from './infiniteCanvas.js';
  import gsap from 'gsap';
  import { Draggable } from 'gsap/Draggable';
  import { InertiaPlugin } from 'gsap/InertiaPlugin';

  gsap.registerPlugin(Draggable, InertiaPlugin);

  /**
   * @type {{
   *   items: Array<{url:string, ref_url?:string, title?:string, w:number, h:number}>,
   *   title?: string,
   *   originRect: DOMRect | null,
   *   onclose: () => void
   * }}
   */
  let { items = [], title = '', originRect = null, onclose } = $props();

  const TILE_W = 280;
  const GAP = 30;
  const WORLD_W = 2500;

  let heights = $derived(
    items.map((item) =>
      item.w && item.h ? Math.round((TILE_W * item.h) / item.w) : 200
    )
  );

  let layout = $derived(
    layoutMasonry(items, heights, TILE_W, GAP, 'canvas:' + title)
  );

  let maxExtent = $derived(
    Math.max(...layout.map((t) => t.y0 + t.h + GAP), 1200)
  );

  /** @type {HTMLDivElement | undefined} */
  let stageEl;
  /** @type {HTMLDivElement | undefined} */
  let overlayEl;
  /** @type {HTMLDivElement | undefined} */
  let ghostEl;

  let ready = $state(false);

  gsap.ticker.lagSmoothing(0);

  const wrapW = WORLD_W + TILE_W;

  function applyWrap() {
    if (!stageEl) return;
    const sx = Number(gsap.getProperty(stageEl, 'x'));
    const sy = Number(gsap.getProperty(stageEl, 'y'));
    const tiles = /** @type {NodeListOf<HTMLElement>} */ (
      stageEl.querySelectorAll('[data-tile]')
    );
    const wrapH = maxExtent + 400;
    for (const t of tiles) {
      const x0 = parseFloat(t.getAttribute('data-x0') || '0');
      const y0 = parseFloat(t.getAttribute('data-y0') || '0');
      const rot = t.getAttribute('data-rot') || '0';
      const tx = wrap(x0 + sx, wrapW);
      const ty = wrap(y0 + sy, wrapH);
      t.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
    }
  }

  $effect(() => {
    if (layout.length && stageEl) {
      applyWrap();
    }
  });

  onMount(() => {
    ready = true;

    if (ghostEl && originRect) {
      gsap.fromTo(
        ghostEl,
        {
          x: originRect.x,
          y: originRect.y,
          width: originRect.width,
          height: originRect.height,
          opacity: 1,
        },
        {
          x: 0,
          y: 0,
          width: '100vw',
          height: '100vh',
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
          onComplete: () => {
            gsap.to(ghostEl, {
              opacity: 0,
              duration: 0.15,
              onComplete: () => {
                ghostEl.style.display = 'none';
              },
            });
          },
        }
      );
    }

    applyWrap();

    const draggable = Draggable.create(stageEl, {
      type: 'x,y',
      inertia: true,
      edgeResistance: 0,
      onDrag: applyWrap,
      onThrowUpdate: applyWrap,
      onClick: function (/** @type {MouseEvent} */ e) {
        const tile = /** @type {HTMLElement} */ (e.target).closest(
          '[data-tile]'
        );
        if (!tile) return;
        const refUrl = /** @type {string} */ (
          tile.getAttribute('data-ref-url')
        );
        const url = /** @type {string} */ (tile.getAttribute('data-url'));
        const href = refUrl || url;
        if (href) window.open(href, '_blank', 'noopener');
      },
    })[0];

    function onWheel(e) {
      if (!stageEl) return;
      e.preventDefault();
      gsap.to(stageEl, {
        x: `+=${-e.deltaX}`,
        y: `+=${-e.deltaY}`,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: 'auto',
        onUpdate: applyWrap,
      });
    }
    overlayEl.addEventListener('wheel', onWheel, { passive: false });

    document.body.style.overflow = 'hidden';
    overlayEl.focus();

    return () => {
      draggable.kill();
      overlayEl.removeEventListener('wheel', onWheel);
      gsap.killTweensOf(stageEl);
      gsap.killTweensOf(ghostEl);
      document.body.style.overflow = '';
    };
  });

  function handleKeydown(e) {
    const STEP = 60;
    switch (e.key) {
      case 'Escape':
        close();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        gsap.to(stageEl, {
          x: `+=${STEP}`,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
          onUpdate: applyWrap,
        });
        break;
      case 'ArrowRight':
        e.preventDefault();
        gsap.to(stageEl, {
          x: `+=-${STEP}`,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
          onUpdate: applyWrap,
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        gsap.to(stageEl, {
          y: `+=${STEP}`,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
          onUpdate: applyWrap,
        });
        break;
      case 'ArrowDown':
        e.preventDefault();
        gsap.to(stageEl, {
          y: `+=-${STEP}`,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
          onUpdate: applyWrap,
        });
        break;
    }
  }

  let closing = false;

  function close() {
    if (closing) return;
    closing = true;

    if (ghostEl && originRect) {
      ghostEl.style.display = '';
      gsap.set(ghostEl, { opacity: 1 });
      gsap.fromTo(
        ghostEl,
        {
          x: 0,
          y: 0,
          width: '100vw',
          height: '100vh',
        },
        {
          x: originRect.x,
          y: originRect.y,
          width: originRect.width,
          height: originRect.height,
          duration: 0.35,
          ease: 'power3.in',
          onComplete: () => {
            onclose?.();
          },
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
    <button class="close-btn" onclick={close} aria-label="Close gallery">
      &times;
    </button>

    <h2 class="canvas-title">{title}</h2>

    <div class="stage" bind:this={stageEl}>
      {#each layout as item, i}
        <div
          class="tile"
          data-tile
          data-x0={item.x0}
          data-y0={item.y0}
          data-rot={item.rot}
          data-url={item.url}
          data-ref-url={item.ref_url}
          style="width: {item.w}px; height: {item.h}px;"
        >
          <img
            src={item.url}
            alt={item.title}
            loading="lazy"
            decoding="async"
          />
          <span class="tile-title">{item.title}</span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
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
    width: 100vw;
    height: 100vh;
    will-change: transform;
    user-select: none;
    cursor: grab;
    touch-action: none;

    &:active {
      cursor: grabbing;
    }
  }

  .tile {
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: box-shadow 0.15s;
    will-change: transform;

    img {
      width: 100%;
      height: 100%;
      display: block;
      pointer-events: none;
    }

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);

      .tile-title {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  .tile-title {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.35rem 0.5rem;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
    color: #fff;
    font-size: 0.75rem;
    font-family: var(--font-sans, sans-serif);
    line-height: 1.2;
    opacity: 0;
    transform: translateY(8px);
    transition:
      opacity 0.2s,
      transform 0.2s;
    pointer-events: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
