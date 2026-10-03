// @ts-nocheck
import { gsap } from 'gsap';

/**
 * Pointer + keyboard gesture handler for PhotoPile.
 * Decoupled from animation — calls back via `onNavigate` and `onDragStart`.
 *
 * @param {{
 *   wrapper: HTMLElement,
 *   getCards: () => HTMLElement[],
 *   getCurrentIndex: () => number,
 *   getIsAnimating: () => boolean,
 *   swipeThreshold: number,
 *   velocityThreshold: number,
 *   dragResistance: number,
 *   onNudgeHide: () => void,
 *   onDragStart: () => void,
 *   onDragMove: (dx: number, dy: number, grabY: number) => void,
 *   onNavigate: (direction: string, vel: {vx: number, vy: number}, releaseState: object) => void,
 *   onSnapBack: () => void,
 * }} opts
 * @returns {{ destroy: () => void }}
 */
export function attachGestures({
  wrapper,
  getCards,
  getCurrentIndex,
  getIsAnimating,
  swipeThreshold,
  velocityThreshold,
  dragResistance,
  onNudgeHide,
  onDragStart,
  onDragMove,
  onNavigate,
  onSnapBack,
}) {
  // ── Velocity tracking (rolling window) ───────────────────────────────────

  let vHistory = [];
  const V_SAMPLES = 6;

  function recordVelocity(dx, dy) {
    vHistory.push({ dx, dy, t: Date.now() });
    if (vHistory.length > V_SAMPLES) vHistory.shift();
  }

  function currentVelocity() {
    if (vHistory.length < 2) return { vx: 0, vy: 0 };
    // Use the last two samples for instantaneous velocity
    const a = vHistory[vHistory.length - 2];
    const b = vHistory[vHistory.length - 1];
    const dt = b.t - a.t || 1;
    return { vx: (b.dx - a.dx) / dt, vy: (b.dy - a.dy) / dt };
  }

  // ── Drag state ────────────────────────────────────────────────────────────

  let dragStart = null;
  let currentDrag = { dx: 0, dy: 0 };
  let grabY = 0.5; // normalised 0–1 vertical grab position within the card

  // ── Pointer handlers ──────────────────────────────────────────────────────

  function onPointerDown(e) {
    onNudgeHide();

    // Compute grabY: where on the card (vertically) the user pressed
    const cards = getCards();
    const card = cards[getCurrentIndex()];
    if (card) {
      const rect = card.getBoundingClientRect();
      grabY = rect.height > 0 ? (e.clientY - rect.top) / rect.height : 0.5;
      grabY = Math.max(0, Math.min(1, grabY));
    } else {
      grabY = 0.5;
    }

    dragStart = { x: e.clientX, y: e.clientY, t: Date.now() };
    currentDrag = { dx: 0, dy: 0 };
    vHistory = [];

    wrapper.setPointerCapture(e.pointerId);

    if (!getIsAnimating()) {
      onDragStart();
    }
  }

  function onPointerMove(e) {
    if (!dragStart || getIsAnimating()) return;

    const dx = (e.clientX - dragStart.x) * dragResistance;
    const dy = (e.clientY - dragStart.y) * dragResistance;
    currentDrag = { dx, dy };
    recordVelocity(dx, dy);
    onDragMove(dx, dy, grabY);
  }

  function onPointerUp(e) {
    if (!dragStart) return;

    const { dx, dy } = currentDrag;
    const dist = Math.hypot(dx, dy);
    const elapsed = Date.now() - dragStart.t;
    const vel = currentVelocity();
    const speed = Math.hypot(vel.vx, vel.vy);

    // Capture the card's current GSAP transform for use as releaseState
    const cards = getCards();
    const card = cards[getCurrentIndex()];
    const releaseState = {
      rotation: card ? (gsap.getProperty(card, 'rotation') ?? 0) : 0,
      x: card ? (gsap.getProperty(card, 'x') ?? 0) : 0,
      y: card ? (gsap.getProperty(card, 'y') ?? 0) : 0,
    };

    dragStart = null;
    wrapper.releasePointerCapture(e.pointerId);

    // Tap: direction determined by which half of the card was clicked
    if (dist < 10 && elapsed < 200) {
      const rect = card?.getBoundingClientRect();
      const tapDir =
        rect && e.clientX - rect.left < rect.width / 2 ? 'left' : 'right';
      onNavigate(tapDir, { vx: tapDir === 'left' ? -0.3 : 0.3, vy: 0 }, {});
      return;
    }

    // Drag swipe — only fire if the swipe meets the threshold
    if (dist > swipeThreshold || speed > velocityThreshold) {
      const direction =
        Math.abs(dx) >= Math.abs(dy)
          ? dx > 0
            ? 'right'
            : 'left'
          : dy > 0
            ? 'down'
            : 'up';
      onNavigate(direction, vel, releaseState);
    } else {
      onSnapBack();
    }
  }

  function onPointerCancel(e) {
    if (dragStart) {
      wrapper.releasePointerCapture(e.pointerId);
      onSnapBack();
    }
    dragStart = null;
  }

  // ── Keyboard handler ──────────────────────────────────────────────────────

  function onKeyDown(e) {
    if (getIsAnimating()) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      onNavigate('left', { vx: -0.3, vy: 0 }, {});
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      onNavigate('right', { vx: 0.3, vy: 0 }, {});
    }
  }

  // ── Bind ──────────────────────────────────────────────────────────────────

  wrapper.setAttribute('tabindex', '0');
  wrapper.addEventListener('pointerdown', onPointerDown);
  wrapper.addEventListener('pointermove', onPointerMove);
  wrapper.addEventListener('pointerup', onPointerUp);
  wrapper.addEventListener('pointercancel', onPointerCancel);
  wrapper.addEventListener('keydown', onKeyDown);

  return {
    destroy() {
      wrapper.removeEventListener('pointerdown', onPointerDown);
      wrapper.removeEventListener('pointermove', onPointerMove);
      wrapper.removeEventListener('pointerup', onPointerUp);
      wrapper.removeEventListener('pointercancel', onPointerCancel);
      wrapper.removeEventListener('keydown', onKeyDown);
    },
  };
}
