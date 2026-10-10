// @ts-nocheck
/**
 * Pure GSAP animation helpers for PhotoPile.
 * No Svelte dependencies — fully testable in isolation.
 */
import { gsap } from 'gsap';

export function createPileAnimator({
  cards,
  captions,
  stackPositions,
  n,
  exitX,
  exitY,
  exitRotation,
}) {
  // ── Depth → position ─────────────────────────────────────────────────────
  //
  // Interpolates smoothly across all three stack positions for any number of
  // cards. depth=0 is the top card, depth=n-1 is the deepest buried card.
  // Cards beyond index 2 in the stack all map toward the "bottom" position.

  function positionForDepth(depth) {
    if (depth <= 0) return stackPositions[2]; // top

    const top = stackPositions[2];
    const mid = stackPositions[1];
    const bottom = stackPositions[0];

    // Normalise depth to a 0–1 range where 1 = fully buried
    // Use (n - 1) as the max depth so the last card is exactly at bottom
    const maxDepth = Math.max(n - 1, 1);
    const t = Math.min(depth / maxDepth, 1); // 0 = just below top, 1 = fully buried

    // Interpolate: for t ≤ 0.5 blend top→mid, for t > 0.5 blend mid→bottom
    let x, y, rotation, scale, rotateY;
    if (t <= 0.5) {
      const s = t / 0.5; // 0–1
      x = top.x + (mid.x - top.x) * s;
      y = top.y + (mid.y - top.y) * s;
      rotation = top.rotation + (mid.rotation - top.rotation) * s;
      scale = top.scale + (mid.scale - top.scale) * s;
      rotateY = top.rotateY + (mid.rotateY - top.rotateY) * s;
    } else {
      const s = (t - 0.5) / 0.5; // 0–1
      x = mid.x + (bottom.x - mid.x) * s;
      y = mid.y + (bottom.y - mid.y) * s;
      rotation = mid.rotation + (bottom.rotation - mid.rotation) * s;
      scale = mid.scale + (bottom.scale - mid.scale) * s;
      rotateY = mid.rotateY + (bottom.rotateY - mid.rotateY) * s;
    }

    return { x, y, rotation, scale, rotateY };
  }

  // ── Z-index sync ──────────────────────────────────────────────────────────

  function refreshZIndices(currentIndex) {
    cards.forEach((card, i) => {
      card.style.zIndex = n - ((currentIndex - i + n) % n);
    });
  }

  // ── Initial layout ────────────────────────────────────────────────────────

  // Seeded pseudo-random per-instance so re-renders are stable but two
  // separate PhotoPile instances on the same page look different.
  const seed = Math.random() * 1000;
  function jitter(range, cardIndex) {
    // Deterministic per card within this instance
    const t = Math.sin(seed + cardIndex * 5) * 0.5 + 0.5; // 0–1
    return (t - 0.5) * 2 * range; // -range … +range
  }

  function initPositions(currentIndex) {
    refreshZIndices(currentIndex);
    cards.forEach((card, i) => {
      const depth = (currentIndex - i + n) % n;
      const pos = positionForDepth(depth);

      // Don't jitter the top card — only the buried ones
      const isTop = depth === 0;
      gsap.set(card, {
        x: pos.x + (isTop ? 0 : jitter(10, i)),
        y: pos.y + (isTop ? 0 : jitter(1, i - 2)),
        rotation: pos.rotation + (isTop ? 0 : jitter(3, i)),
        scale: pos.scale,
        rotateY: pos.rotateY + (isTop ? 0 : jitter(1, i)),
      });
    });
    captions.forEach((c, i) => {
      gsap.set(c, {
        opacity: i === currentIndex ? 1 : 0,
        x: i === currentIndex ? 0 : 16,
      });
    });
  }

  // ── Card exit: momentum-driven ────────────────────────────────────────────
  //
  // vel is the pointer velocity at release (px/ms).
  // The card continues in that direction, decelerating like a thrown object.
  // releaseRotation is the rotation at the moment of release.

  function flyCardOut(fromIdx, direction, vel, onDone, releaseState = {}) {
    const card = cards[fromIdx];

    // Always kill any in-flight caption animation and hide it immediately.
    // This covers the case where liftCard was never called (queued swipe)
    // so the caption hasn't been hidden yet.
    if (captions[fromIdx]) {
      gsap.killTweensOf(captions[fromIdx]);
      gsap.set(captions[fromIdx], { opacity: 0 });
    }

    const speed = Math.hypot(vel.vx, vel.vy);

    // Duration: fast throws are shorter (snappy), slow drags are longer (floaty)
    // Clamp between 0.22s and 0.55s
    const dur = Math.max(0.22, Math.min(0.55, 0.38 / (1 + speed * 3)));

    // Exit distance = base + momentum bonus (proportional to speed)
    const momentum = Math.min(speed * 120, 150); // cap the bonus
    const baseX = exitX + momentum;
    const baseY = exitY + momentum * 0.5;

    const tx =
      direction === 'right'
        ? baseX
        : direction === 'left'
          ? -baseX
          : vel.vx * baseX;

    const ty =
      direction === 'down'
        ? baseY
        : direction === 'up'
          ? -baseY
          : -baseY * 0.35 + vel.vy * baseY;

    // Exit rotation continues the in-hand rotation and overshoots slightly
    const currentRot = releaseState.rotation ?? 0;
    const spinBoost = vel.vx * 8; // extra spin from throw velocity
    const tr =
      direction === 'right'
        ? Math.max(currentRot + spinBoost, exitRotation)
        : direction === 'left'
          ? Math.min(currentRot + spinBoost, -exitRotation)
          : currentRot + spinBoost;

    // Use power4.out: fast initial movement that quickly decelerates (like throwing)
    gsap.to(card, {
      x: tx,
      y: ty,
      rotation: tr,
      scale: 0.82,
      duration: dur,
      ease: 'power4.out',
      onComplete: () => {
        card.style.zIndex = 0;
        // Settle into bottom-of-pile position with a brief delay so the
        // viewer perceives the card "landing" behind the others
        gsap.to(card, {
          ...stackPositions[0],
          duration: 0.35,
          ease: 'power2.inOut',
          onComplete: onDone,
        });
      },
    });
  }

  // ── Promote remaining cards ───────────────────────────────────────────────

  function promoteStack(newTopIdx, currentIndex) {
    const dur = 0.38;

    cards.forEach((card, i) => {
      if (i === currentIndex) return;
      const newDepth = (newTopIdx - i + n) % n;
      gsap.to(card, {
        ...positionForDepth(newDepth),
        duration: dur,
        ease: 'back.out(1)',
      });
      gsap.delayedCall(dur * 0.25, () => {
        card.style.zIndex = n - newDepth;
      });
    });

    if (captions[newTopIdx]) {
      gsap.to(captions[newTopIdx], {
        opacity: 1,
        x: 0,
        duration: dur,
        delay: 0.08,
        ease: 'power2.out',
      });
    }
  }

  // ── Snap top card back with spring ────────────────────────────────────────

  function snapBackToTop(currentIndex) {
    const card = cards[currentIndex];
    const pos = stackPositions[2];

    // Overshoot the rest position slightly then settle — feels like a rubber band
    gsap.to(card, {
      ...pos,
      rotateX: 0,
      duration: 0.55,
      ease: 'elastic.out(0.9, 0.45)',
    });

    const img = card.querySelector('.img');
    if (img)
      gsap.to(img, {
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        duration: 0.3,
      });

    // Restore caption once card settles back
    if (captions[currentIndex])
      gsap.to(captions[currentIndex], {
        opacity: 1,
        x: 0,
        duration: 0.25,
        delay: 0.3,
      });
  }

  // ── Reset next card in stack ──────────────────────────────────────────────

  function resetNextCard(currentIndex) {
    const nextIdx = (currentIndex - 1 + n) % n;
    gsap.to(cards[nextIdx], {
      ...positionForDepth(1),
      duration: 0.35,
      ease: 'power2.out',
    });
  }

  // ── Live drag ─────────────────────────────────────────────────────────────
  //
  // grabY: normalised (0–1) vertical position of pointer within the card.
  // Grabbing near the top gives more rotation (like holding a card at its edge).

  function applyDrag(
    currentIndex,
    dx,
    dy,
    { rotationFactor, maxRotation, swipeThreshold },
    grabY = 0.5
  ) {
    const card = cards[currentIndex];
    const dist = Math.hypot(dx, dy);

    // Rotation pivot: grabbing top half (grabY < 0.5) magnifies rotation,
    // grabbing bottom half reduces it — mirrors real-world card physics
    const pivotScale = 1 + (0.5 - grabY) * 1.2; // 1.6 at top, 0.4 at bottom
    const rotation = Math.max(
      -maxRotation,
      Math.min(maxRotation, dx * rotationFactor * pivotScale)
    );

    // Slight scale variation — only shrink a tiny bit at extreme distances
    const scale = Math.max(0.95, 1.02 - dist * 0.00015);

    gsap.set(card, {
      x: dx,
      y: dy,
      rotation,
      scale,
      rotateY: dx * 0.015,
      rotateX: -dy * 0.008,
    });

    // Shadow grows with lift
    const img = card.querySelector('.img');
    if (img) {
      gsap.set(img, {
        boxShadow: `0 ${22 + dist * 0.12}px ${35 + dist * 0.25}px rgba(0,0,0,${Math.min(0.38, 0.22 + dist * 0.0006)})`,
      });
    }

    // Peek: card below rises toward its "ready" position as drag progresses
    const nextIdx = (currentIndex - 1 + n) % n;
    const nextCard = cards[nextIdx];
    const p = Math.min(1, dist / swipeThreshold);
    const from = positionForDepth(1);
    const to = stackPositions[2];

    gsap.set(nextCard, {
      x: from.x + (to.x - from.x) * p * 0.4,
      y: from.y + (to.y - from.y) * p * 0.4,
      scale: from.scale + (to.scale - from.scale) * p * 0.4,
      rotation: from.rotation + (to.rotation - from.rotation) * p * 0.4,
    });
  }

  // ── Lift on press ─────────────────────────────────────────────────────────

  function liftCard(currentIndex) {
    const card = cards[currentIndex];
    gsap.to(card, { scale: 1.025, duration: 0.12, ease: 'power2.out' });

    const img = card.querySelector('.img');
    if (img)
      gsap.to(img, {
        boxShadow: '0 28px 70px rgba(0,0,0,0.22)',
        duration: 0.12,
      });

    // Hide caption while card is in-hand
    if (captions[currentIndex])
      gsap.to(captions[currentIndex], { opacity: 0, x: 8, duration: 0.1 });
  }

  // ── Lower after tap/cancel ────────────────────────────────────────────────

  function lowerCard(currentIndex) {
    const card = cards[currentIndex];
    gsap.to(card, { scale: 1, duration: 0.12 });

    const img = card.querySelector('.img');
    if (img)
      gsap.to(img, {
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        duration: 0.12,
      });

    // Caption restored by promoteStack / snapBackToTop after navigation
  }

  return {
    positionForDepth,
    refreshZIndices,
    initPositions,
    flyCardOut,
    promoteStack,
    snapBackToTop,
    resetNextCard,
    applyDrag,
    liftCard,
    lowerCard,
  };
}
