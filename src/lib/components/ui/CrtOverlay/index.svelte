<!--
  The CRT faceplate: a fixed stack of pointer-transparent layers over the whole
  page. Layer order is paint order — grain sits closest to the content, the
  bezel on top of everything.

  Refraction lives on four narrow rim strips, never on a full-viewport layer.
  `backdrop-filter` costs by the element's own bounds and ignores any mask, so
  one masked viewport-sized layer still resampled every pixel: 8.2fps against a
  41.8fps baseline. Four 7vmin strips cover about 22% of the area and measured
  at 60fps, indistinguishable from no rim at all.

  A phosphor halation layer (`backdrop-filter: blur(6px)` screened back at 0.1)
  is deliberately absent. It was cheap enough, but being full-viewport it blurs
  and lightens the real page underneath, which erased every soft shadow on the
  site — the navbar badge's `--shadow-3` is a 3px blur at 27% black, so it
  vanished outright. Every other layer here paints over the page instead of
  resampling it.
-->

<!--
  Four maps, one per edge, each bowing its own side outward.

  The displacement has to vary ACROSS the line it is meant to bend, not along
  the axis it pushes. A red ramp running left to right shifts every pixel of a
  column by the same amount, so a vertical card edge stays a perfectly straight
  vertical edge and only text — which has detail in every column — visibly
  smears. So the left and right maps ramp red DOWN the strip: x displacement
  now varies with y, and a vertical edge bows. The top and bottom maps ramp
  green ACROSS, bending horizontal edges the same way.

  Each profile is neutral 128 at both ends and peaks in the middle, so the line
  is pinned at the corners and pushed at its centre — a single clean bow. The
  peak inverts between opposite edges (235 against 21) so both sides bulge away
  from the middle of the screen rather than drifting the same way.
-->
<svg class="crt-defs" width="0" height="0" aria-hidden="true" focusable="false">
  <filter
    id="crt-rim-l"
    x="0%"
    y="0%"
    width="100%"
    height="100%"
    color-interpolation-filters="sRGB"
  >
    <feImage
      href="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cdefs%3E%3ClinearGradient id='f' x1='0' y1='0' x2='1' y2='0'%3E%3Cstop offset='0' stop-color='black'/%3E%3Cstop offset='0.25' stop-color='white'/%3E%3Cstop offset='1' stop-color='black'/%3E%3C/linearGradient%3E%3Cmask id='m'%3E%3Crect width='300' height='300' fill='url(%23f)'/%3E%3C/mask%3E%3ClinearGradient id='p' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='rgb(30,40,128)'/%3E%3Cstop offset='0.5' stop-color='rgb(96,128,128)'/%3E%3Cstop offset='1' stop-color='rgb(30,216,128)'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='300' fill='rgb(128,128,128)'/%3E%3Crect width='300' height='300' fill='url(%23p)' mask='url(%23m)'/%3E%3C/svg%3E"
      result="ramp"
      preserveAspectRatio="none"
    ></feImage>
    <feDisplacementMap
      in="SourceGraphic"
      in2="ramp"
      scale="7"
      xChannelSelector="R"
      yChannelSelector="G"
    ></feDisplacementMap>
  </filter>
  <filter
    id="crt-rim-r"
    x="0%"
    y="0%"
    width="100%"
    height="100%"
    color-interpolation-filters="sRGB"
  >
    <feImage
      href="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cdefs%3E%3ClinearGradient id='f' x1='1' y1='0' x2='0' y2='0'%3E%3Cstop offset='0' stop-color='black'/%3E%3Cstop offset='0.25' stop-color='white'/%3E%3Cstop offset='1' stop-color='black'/%3E%3C/linearGradient%3E%3Cmask id='m'%3E%3Crect width='300' height='300' fill='url(%23f)'/%3E%3C/mask%3E%3ClinearGradient id='p' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='rgb(226,40,128)'/%3E%3Cstop offset='0.5' stop-color='rgb(160,128,128)'/%3E%3Cstop offset='1' stop-color='rgb(226,216,128)'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='300' fill='rgb(128,128,128)'/%3E%3Crect width='300' height='300' fill='url(%23p)' mask='url(%23m)'/%3E%3C/svg%3E"
      result="ramp"
      preserveAspectRatio="none"
    ></feImage>
    <feDisplacementMap
      in="SourceGraphic"
      in2="ramp"
      scale="7"
      xChannelSelector="R"
      yChannelSelector="G"
    ></feDisplacementMap>
  </filter>
  <filter
    id="crt-rim-t"
    x="0%"
    y="0%"
    width="100%"
    height="100%"
    color-interpolation-filters="sRGB"
  >
    <feImage
      href="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cdefs%3E%3ClinearGradient id='f' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='black'/%3E%3Cstop offset='0.25' stop-color='white'/%3E%3Cstop offset='1' stop-color='black'/%3E%3C/linearGradient%3E%3Cmask id='m'%3E%3Crect width='300' height='300' fill='url(%23f)'/%3E%3C/mask%3E%3ClinearGradient id='p' x1='0' y1='0' x2='1' y2='0'%3E%3Cstop offset='0' stop-color='rgb(40,30,128)'/%3E%3Cstop offset='0.5' stop-color='rgb(128,96,128)'/%3E%3Cstop offset='1' stop-color='rgb(216,30,128)'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='300' fill='rgb(128,128,128)'/%3E%3Crect width='300' height='300' fill='url(%23p)' mask='url(%23m)'/%3E%3C/svg%3E"
      result="ramp"
      preserveAspectRatio="none"
    ></feImage>
    <feDisplacementMap
      in="SourceGraphic"
      in2="ramp"
      scale="7"
      xChannelSelector="R"
      yChannelSelector="G"
    ></feDisplacementMap>
  </filter>
  <filter
    id="crt-rim-bt"
    x="0%"
    y="0%"
    width="100%"
    height="100%"
    color-interpolation-filters="sRGB"
  >
    <feImage
      href="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cdefs%3E%3ClinearGradient id='f' x1='0' y1='1' x2='0' y2='0'%3E%3Cstop offset='0' stop-color='black'/%3E%3Cstop offset='0.25' stop-color='white'/%3E%3Cstop offset='1' stop-color='black'/%3E%3C/linearGradient%3E%3Cmask id='m'%3E%3Crect width='300' height='300' fill='url(%23f)'/%3E%3C/mask%3E%3ClinearGradient id='p' x1='0' y1='0' x2='1' y2='0'%3E%3Cstop offset='0' stop-color='rgb(40,226,128)'/%3E%3Cstop offset='0.5' stop-color='rgb(128,160,128)'/%3E%3Cstop offset='1' stop-color='rgb(216,226,128)'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='300' fill='rgb(128,128,128)'/%3E%3Crect width='300' height='300' fill='url(%23p)' mask='url(%23m)'/%3E%3C/svg%3E"
      result="ramp"
      preserveAspectRatio="none"
    ></feImage>
    <feDisplacementMap
      in="SourceGraphic"
      in2="ramp"
      scale="7"
      xChannelSelector="R"
      yChannelSelector="G"
    ></feDisplacementMap>
  </filter>
</svg>

<div class="crt-rim crt-rim-t" aria-hidden="true"></div>
<div class="crt-rim crt-rim-b" aria-hidden="true"></div>
<div class="crt-rim crt-rim-l" aria-hidden="true"></div>
<div class="crt-rim crt-rim-r" aria-hidden="true"></div>
<div class="crt-grain" aria-hidden="true"></div>
<div class="crt-scan" aria-hidden="true"></div>
<!-- <div class="crt-grid" aria-hidden="true"></div> -->
<div class="crt-fringe" aria-hidden="true"></div>
<div class="crt-vignette" aria-hidden="true"></div>
<!-- <div class="crt-sheen" aria-hidden="true"></div> -->
<div class="crt-bezel" aria-hidden="true"></div>

<style lang="scss">
  .crt-grain,
  .crt-scan,
  .crt-grid,
  .crt-fringe,
  .crt-vignette,
  .crt-sheen,
  .crt-bezel {
    position: fixed;
    inset: 0;
    z-index: var(--layer-important);
    pointer-events: none;
  }

  .crt-defs {
    position: fixed;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  // One knob for how far the glass reaches, shared by the strips and by the
  // fringe that has to line up with them.
  :global(html) {
    --crt-rim: 6vmin;
  }

  // The scrollbar is the one thing that sits outside the screen. Left at the
  // system default it is a bright column beyond the bezel, which undoes the
  // illusion more than any amount of refraction repairs it.
  :global(html) {
    scrollbar-width: thin;
    scrollbar-color: rgba(65, 41, 90, 0.45) transparent;
  }

  // The glass edge. Each strip bends its own axis outward and fades inward, so
  // the middle of the page is never resampled. Sized by the element, not by a
  // mask — see the note at the top of the file.
  // Below the navbars on purpose. `backdrop-filter` only sees what paints
  // beneath it, so sitting under the sticky header (z 5) and the mobile one
  // (--layer-important) keeps them crisp. Pinned chrome sits in the rim
  // permanently, and a blur that never moves reads as a rendering fault rather
  // than as glass — only the content sliding past should bend.
  .crt-rim {
    position: fixed;
    z-index: var(--layer-4);
    pointer-events: none;
  }

  // A four-stop falloff rather than a straight ramp: the linear one put half
  // its blur in the outer third and ended abruptly.
  .crt-rim-t,
  .crt-rim-b {
    left: 0;
    right: 0;
    height: var(--crt-rim);
  }

  // Inset by the other pair's thickness so the four strips tile instead of
  // overlapping. They used to share a 54x54 square at each corner, and two
  // stacked backdrop-filters means the second filters the first's output — the
  // displacements compounded and the blur ran twice, which is why the corners
  // looked muddier than the edges.
  .crt-rim-l,
  .crt-rim-r {
    top: var(--crt-rim);
    bottom: var(--crt-rim);
    width: var(--crt-rim);
  }

  .crt-rim-t {
    top: 0;
    backdrop-filter: url(#crt-rim-t) blur(0.9px) saturate(1.06);
    -webkit-backdrop-filter: url(#crt-rim-t) blur(0.9px) saturate(1.06);
    mask-image: linear-gradient(
      to bottom,
      #000 0%,
      rgba(0, 0, 0, 0.62) 32%,
      rgba(0, 0, 0, 0.22) 64%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      #000 0%,
      rgba(0, 0, 0, 0.62) 32%,
      rgba(0, 0, 0, 0.22) 64%,
      transparent 100%
    );
  }

  .crt-rim-b {
    bottom: 0;
    backdrop-filter: url(#crt-rim-bt) blur(0.9px) saturate(1.06);
    -webkit-backdrop-filter: url(#crt-rim-bt) blur(0.9px) saturate(1.06);
    mask-image: linear-gradient(
      to top,
      #000 0%,
      rgba(0, 0, 0, 0.62) 32%,
      rgba(0, 0, 0, 0.22) 64%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to top,
      #000 0%,
      rgba(0, 0, 0, 0.62) 32%,
      rgba(0, 0, 0, 0.22) 64%,
      transparent 100%
    );
  }

  .crt-rim-l {
    left: 0;
    backdrop-filter: url(#crt-rim-l) blur(0.9px) saturate(1.06);
    -webkit-backdrop-filter: url(#crt-rim-l) blur(0.9px) saturate(1.06);
    mask-image: linear-gradient(
      to right,
      #000 0%,
      rgba(0, 0, 0, 0.62) 32%,
      rgba(0, 0, 0, 0.22) 64%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      #000 0%,
      rgba(0, 0, 0, 0.62) 32%,
      rgba(0, 0, 0, 0.22) 64%,
      transparent 100%
    );
  }

  .crt-rim-r {
    right: 0;
    backdrop-filter: url(#crt-rim-r) blur(0.9px) saturate(1.06);
    -webkit-backdrop-filter: url(#crt-rim-r) blur(0.9px) saturate(1.06);
    mask-image: linear-gradient(
      to left,
      #000 0%,
      rgba(0, 0, 0, 0.62) 32%,
      rgba(0, 0, 0, 0.22) 64%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to left,
      #000 0%,
      rgba(0, 0, 0, 0.62) 32%,
      rgba(0, 0, 0, 0.22) 64%,
      transparent 100%
    );
  }

  // The tile is measured, not eyeballed. Raw feTurbulence also writes a random
  // alpha channel, so the plain version was half transparent (mean alpha 127 of
  // 255) and its luma only varied by a standard deviation of 11 — smooth cloud,
  // not static, which is why it read as nothing at all however fast it stepped.
  // feColorMatrix flattens it to opaque greyscale; feComponentTransfer stretches
  // the contrast 4x about the midpoint, giving stdDev 55.6 at mean luma 122 with
  // 3.5% clipping. `color-interpolation-filters: sRGB` matters: the default is
  // linearRGB, where that slope and intercept land somewhere else entirely.
  // Roughly 10x more visible per unit opacity, hence 0.06 -> 0.03.
  .crt-grain {
    inset: -12%;
    opacity: 0.05;
    mix-blend-mode: hard-light;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n' color-interpolation-filters='sRGB'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 0 1'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='4' intercept='-1.5'/%3E%3CfeFuncG type='linear' slope='4' intercept='-1.5'/%3E%3CfeFuncB type='linear' slope='4' intercept='-1.5'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
    // Ten offsets held flat across 0.45s: ~24 distinct frames a second, which
    // is what makes it read as static. Fewer keyframes over a longer duration
    // reads as an occasional twitch instead.
    animation: crt-grain 0.45s steps(1) infinite;
  }

  @keyframes crt-grain {
    0% {
      transform: translate(0, 0);
    }
    10% {
      transform: translate(-6%, -3%);
    }
    20% {
      transform: translate(4%, -6%);
    }
    30% {
      transform: translate(-8%, 5%);
    }
    40% {
      transform: translate(7%, 2%);
    }
    50% {
      transform: translate(-3%, -7%);
    }
    60% {
      transform: translate(6%, 6%);
    }
    70% {
      transform: translate(-7%, -2%);
    }
    80% {
      transform: translate(2%, 7%);
    }
    90% {
      transform: translate(-4%, -5%);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  // The raster. This is what actually reads as a screen: horizontal only, and
  // fine. The dot lattice below is isotropic and coarse, which is decorative
  // by nature however it is tuned — a CRT looks like a CRT because the line
  // structure runs one way and sits near the limit of resolution.
  //
  // 4px period against roughly 2px grain features and a ~20px lattice, so the
  // three textures occupy separate frequencies. Matching them is what turned
  // the first version of this component to mush.
  .crt-scan {
    background: repeating-linear-gradient(
      to bottom,
      rgba(47, 7, 67, 0.05) 0 1px,
      transparent 1px 4px
    );
    mix-blend-mode: multiply;
  }

  // A diamond lattice: two identical dot layers, the second offset by half a
  // cell in both axes. That staggers alternate rows, so every dot's nearest
  // neighbours sit diagonally rather than square-on and joining them traces
  // rotated squares instead of an upright grid.
  //
  // The cell is two baselines, which puts a dot every --grid-baseline (11px
  // here) down each column once the offset layer is counted — the same step
  // GridOverlay draws its own baseline at. Note that is half the body font
  // size, not half its leading, so the lattice is a rhythm rather than a
  // typographic baseline.
  //
  // The lattice starts at the content edge of the centred container rather
  // than at the viewport edge, so it still registers with the layout — but the
  // cell does not divide the column track, so this trades exact column
  // alignment for even spacing. Absolute lengths only: a percentage would
  // resolve against background-position's own odd reference box.
  .crt-grid {
    --crt-origin: calc(
      max(0px, (100vw - var(--grid-max-width)) / 2) + var(--grid-margin)
    );
    --crt-cell: calc(var(--grid-baseline) * 2);
    --crt-half: var(--grid-baseline);

    background-image:
      radial-gradient(rgba(47, 7, 67, 0.13) 0.8px, transparent 1.4px),
      radial-gradient(rgba(47, 7, 67, 0.13) 0.8px, transparent 1.4px);
    background-size:
      var(--crt-cell) var(--crt-cell),
      var(--crt-cell) var(--crt-cell);
    background-position:
      var(--crt-origin) 0,
      calc(var(--crt-origin) + var(--crt-half)) var(--crt-half);
    mix-blend-mode: multiply;
  }

  // Dispersion belongs exactly where the bend is. This used to be a viewport
  // radial running 58-88%, while the refraction only happens in the outer
  // --crt-rim (about 3.7% of the width at 1440) — so the colour split sat
  // nowhere near the displacement causing it. Four edge gradients instead,
  // pinned to the same distance, cool one way and warm the other because a
  // prism throws the ends of the spectrum in opposite directions.
  .crt-fringe {
    background:
      linear-gradient(
        to right,
        rgba(70, 130, 255, 0.16),
        transparent var(--crt-rim)
      ),
      linear-gradient(
        to left,
        rgba(255, 120, 60, 0.16),
        transparent var(--crt-rim)
      ),
      linear-gradient(
        to bottom,
        rgba(70, 130, 255, 0.13),
        transparent var(--crt-rim)
      ),
      linear-gradient(
        to top,
        rgba(255, 120, 60, 0.13),
        transparent var(--crt-rim)
      );
    mix-blend-mode: overlay;
  }

  // Held to the last tenth of the screen. A wide radial wash starting near the
  // middle is the thing that reads as cheap — real tube falloff is confined to
  // the edge, and the bezel's inset shadows below already cover that ground, so
  // this only has to finish the corners off.
  .crt-vignette {
    background: radial-gradient(
      ellipse at center,
      transparent 70%,
      rgba(47, 7, 67, 0.05) 92%,
      rgba(47, 7, 67, 0.11) 100%
    );
    mix-blend-mode: multiply;
  }

  .crt-sheen {
    background: linear-gradient(
      112deg,
      transparent 22%,
      rgba(255, 255, 255, 0.3) 37%,
      rgba(255, 255, 255, 0.04) 45%,
      transparent 58%
    );
    mix-blend-mode: screen;
    opacity: 0.2;
  }

  // The rounded screen. The spread shadow paints everything outside the
  // rounded rectangle, which is off-viewport except at the four corners, so
  // the corners read as a bezel. The two inset shadows are the tube itself
  // falling away at the edges — the thing that makes it read as a monitor
  // rather than a rounded rectangle. They are sized in vmin, not px: a fixed
  // blur radius swallows a small window and vanishes on a large one.
  .crt-bezel {
    border-radius: 24px;
    box-shadow:
      0 0 0 120px #17121c,
      inset 0 0 0 1px rgba(255, 255, 255, 0.28),
      inset 0 0 3vmin rgba(23, 18, 28, 0.3),
      inset 0 0 10vmin rgba(47, 7, 67, 0.14);
  }

  @media (prefers-reduced-motion: reduce) {
    .crt-grain {
      animation: none;
    }
  }

  // Phones keep the tube — grain, vignette and bezel — but drop the fine
  // texture a high-density screen would only alias.
  // Taper rather than switch off. The rim is free, so a half-width desktop
  // window keeping a thinner one beats the hard cliff from full effect to none.
  @media (max-width: 900px) {
    :global(html) {
      --crt-rim: 4.5vmin;
    }
  }

  // Phones used to lose the rim and the fringe too, which left only grain,
  // vignette and bezel: on a small screen that reads as no glass edge at all.
  // Both are back, with the strip wider than the 900px taper (4.5vmin is under
  // 18px on a phone). The fringe keeps its desktop strength: turned up, it read
  // as a blue edge and a red one rather than as glass. Only the scanlines and
  // lattice, the fine textures a dense screen would alias, stay off.
  @media (max-width: 480px) {
    :global(html) {
      --crt-rim: 8vmin;
    }

    .crt-scan,
    .crt-grid,
    .crt-sheen {
      display: none;
    }

    .crt-bezel {
      border-radius: 24px;
    }
  }

  // iOS (Safari and every other iOS browser, which all run WebKit) cannot use
  // an SVG filter inside backdrop-filter, so the rim would only be dead weight
  // there. The colour fringe, vignette and bezel carry the edge on their own.
  @supports (-webkit-touch-callout: none) {
    .crt-rim {
      display: none;
    }
  }
</style>
