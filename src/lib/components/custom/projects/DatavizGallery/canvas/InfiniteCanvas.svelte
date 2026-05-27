<script>
  import { onMount } from 'svelte';
  import {
    FRAME_W,
    GAP,
    PRECISION,
    WORLD_W,
    tileStyle,
    masonryContainerStyle,
    makePerm,
  } from './infiniteCanvas.js';
  import gsap from 'gsap';
  import { Draggable } from 'gsap/Draggable';
  import { InertiaPlugin } from 'gsap/InertiaPlugin';

  gsap.registerPlugin(Draggable, InertiaPlugin);

  /**
   * @type {{
   *   items: Array<{url:string, ref_url?:string, title?:string, aspect:number}>,
   *   title?: string,
   *   originRect: DOMRect | null,
   *   onclose: () => void
   * }}
   */
  let { items = [], title = '', originRect = null, onclose } = $props();

  let perm = $derived(makePerm(title));

  /** @type {HTMLDivElement | undefined} */
  let stageEl;
  /** @type {HTMLDivElement | undefined} */
  let overlayEl;
  /** @type {HTMLDivElement | undefined} */
  let ghostEl;

  let ready = $state(false);

  gsap.ticker.lagSmoothing(0);

  function tileUrl(url) {
    if (!url) return '';
    const i = url.lastIndexOf('/');
    return '/media/' + url.slice(0, i) + '/thumbs_600/' + url.slice(i + 1);
  }

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

    const draggable = Draggable.create(stageEl, {
      type: 'x,y',
      inertia: true,
      edgeResistance: 0,
      onClick: function (/** @type {MouseEvent} */ e) {
        const tile = /** @type {HTMLElement} */ (e.target).closest('.tile');
        if (!tile) return;
        const refUrl = tile.getAttribute('data-ref-url');
        const url = tile.getAttribute('data-url');
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
        });
        break;
      case 'ArrowRight':
        e.preventDefault();
        gsap.to(stageEl, {
          x: `+=-${STEP}`,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        gsap.to(stageEl, {
          y: `+=${STEP}`,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        break;
      case 'ArrowDown':
        e.preventDefault();
        gsap.to(stageEl, {
          y: `+=-${STEP}`,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
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
        { x: 0, y: 0, width: '100vw', height: '100vh' },
        {
          x: originRect.x,
          y: originRect.y,
          width: originRect.width,
          height: originRect.height,
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
      style="--frame-width: {FRAME_W}px; --gap: {GAP}px; --precision: {PRECISION};"
    >
      <div class="masonry-inner" style={masonryContainerStyle()}>
        {#each items as item, i}
          <div
            class="tile"
            style={tileStyle(item, title, i, perm)}
            data-url={tileUrl(item.url)}
            data-ref-url={item.ref_url || ''}
          >
            <div class="tile-inner">
              <img
                src={tileUrl(item.url)}
                alt={item.title}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        {/each}
      </div>
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
    will-change: transform;
    user-select: none;
    cursor: grab;
    touch-action: none;

    &:active {
      cursor: grabbing;
    }
  }

  .masonry-inner {
    display: grid;
    clip-path: margin-box;
    margin: calc(-1 * var(--gap, 0) / 2);
    grid-template-columns: repeat(auto-fill, minmax(var(--frame-width), 1fr));
    width: 2500px;
  }

  .tile {
    --w: 1;
    --h: 1;
    aspect-ratio: var(--w) / var(--h);
    width: 100%;
    height: 100%;
    position: relative;
    grid-row: span calc(var(--h) / var(--w) * var(--precision, 10));

    .tile-inner {
      position: absolute;
      inset: calc(var(--gap, 0) / 2);
      overflow: hidden;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      transition: box-shadow 0.15s;
      cursor: zoom-in;
      padding: var(--space-3xs);
      &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
      }
    }

    img {
      width: 100%;
      height: 100%;
      display: block;
      pointer-events: none;
    }
  }
</style>
