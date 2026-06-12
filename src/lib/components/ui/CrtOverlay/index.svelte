<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  let canvas;
  let gl;
  let program;
  let animId;
  let observer;
  let ok = $state(false);

  const vert = `#version 300 es
    in vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const frag = `#version 300 es
    precision highp float;
    uniform float u_time;
    uniform vec2 u_resolution;
    out vec4 fragColor;

    float hash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1031, 0.1031));
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    void main() {
      vec2 gc = floor(gl_FragCoord.xy / 2.0);
      float t = floor(u_time * 24.0);
      float g = hash(gc + t * 137.0);
      float n = (g - 0.5) * 0.035 + 0.5;
      vec3 c = vec3(n);
      c.r *= 1.015;
      c.b *= 0.985;
      fragColor = vec4(c, 1.0);
    }
  `;

  function init() {
    try {
      gl = canvas.getContext('webgl2', { alpha: false });
      if (!gl) return;

      const vs = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vs, vert);
      gl.compileShader(vs);
      if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) return;

      const fs = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fs, frag);
      gl.compileShader(fs);
      if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) return;

      program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

      gl.useProgram(program);

      const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

      const loc = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      gl.uRes = gl.getUniformLocation(program, 'u_resolution');
      gl.uTime = gl.getUniformLocation(program, 'u_time');

      gl.clearColor(0.5, 0.5, 0.5, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      resize();
      ok = true;
      loop();
    } catch {
      // WebGL not available
    }
  }

  function resize() {
    if (!gl || !canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(gl.uRes, canvas.width, canvas.height);
  }

  function loop() {
    if (!gl) return;
    try {
      gl.uniform1f(gl.uTime, performance.now() / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    } catch {
      // recover
    }
    animId = requestAnimationFrame(loop);
  }

  function hasGoodCapacity() {
    const cores = navigator.hardwareConcurrency;
    if (cores && cores < 4) return false;
    const mem = navigator.deviceMemory;
    if (mem && mem < 4) return false;
    const probe = document.createElement('canvas');
    const ctx = probe.getContext('webgl2');
    if (!ctx) return false;
    ctx.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  }

  function handleVisibility() {
    if (document.hidden) {
      if (animId) cancelAnimationFrame(animId);
    } else if (ok) {
      loop();
    }
  }

  onMount(() => {
    if (!browser) return;
    if (hasGoodCapacity()) init();

    observer = new ResizeObserver(() => resize());
    observer.observe(document.body);

    addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibility);
  });

  onDestroy(() => {
    if (!browser) return;
    cancelAnimationFrame(animId);
    observer?.disconnect();
    removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', handleVisibility);
    const ext = gl?.getExtension('WEBGL_lose_context');
    ext?.loseContext();
  });
</script>

<canvas bind:this={canvas} class="crt-noise" class:ok aria-hidden="true"
></canvas>
<div class="crt-noise-fallback" aria-hidden="true"></div>
<!-- <div class="crt-focal-plane" aria-hidden="true"></div> -->
<div class="crt-vignette" aria-hidden="true"></div>
<div class="crt-scanlines" aria-hidden="true"></div>
<div class="crt-glass" aria-hidden="true"></div>

<style lang="scss">
  .crt-noise,
  .crt-noise-fallback,
  .crt-focal-plane,
  .crt-vignette,
  .crt-scanlines,
  .crt-glass {
    position: fixed;
    inset: 0;
    z-index: var(--layer-important);
    pointer-events: none;
    // display: none;
  }

  .crt-noise {
    display: none;
    mix-blend-mode: hard-light;

    &.ok {
      display: block;
    }
  }

  .crt-noise-fallback {
    opacity: 0.025;
    mix-blend-mode: hard-light;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 256px 256px;
  }

  .crt-noise.ok ~ .crt-noise-fallback {
    display: none;
  }

  .crt-focal-plane {
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    mask-image: linear-gradient(
      to bottom,
      black 0px,
      black 100px,
      transparent 200px,
      transparent calc(100% - 200px),
      black calc(100% - 100px),
      black 100%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      black 0px,
      black 100px,
      transparent 200px,
      transparent calc(100% - 200px),
      black calc(100% - 100px),
      black 100%
    );
  }

  .crt-vignette {
    background: radial-gradient(
      ellipse at center,
      transparent 60%,
      rgba(0, 0, 0, 0.04) 85%,
      rgba(0, 0, 0, 0.08) 95%,
      rgba(0, 0, 0, 0.1) 100%
    );
    mix-blend-mode: multiply;
  }

  .crt-scanlines {
    background:
      repeating-linear-gradient(
        to bottom,
        transparent 0px,
        transparent 2px,
        rgba(47, 7, 67, 0.018) 2px,
        rgba(47, 7, 67, 0.018) 4px
      ),
      repeating-linear-gradient(
        to left,
        transparent 0px,
        transparent 2px,
        rgba(47, 7, 67, 0.018) 2px,
        rgba(47, 7, 67, 0.018) 4px
      );
    mix-blend-mode: color-burn;
  }

  .crt-glass {
    background:
      radial-gradient(
        ellipse at 50% 50%,
        transparent 50%,
        rgba(80, 120, 200, 0.015) 75%,
        rgba(80, 120, 200, 0.03) 88%,
        transparent 100%
      ),
      conic-gradient(
        from 0deg at 50% 50%,
        transparent 0deg,
        rgba(255, 255, 255, 0.008) 45deg,
        transparent 90deg,
        rgba(255, 255, 255, 0.008) 135deg,
        transparent 180deg,
        rgba(255, 255, 255, 0.008) 225deg,
        transparent 270deg,
        rgba(255, 255, 255, 0.008) 315deg,
        transparent 360deg
      );
    mix-blend-mode: overlay;
  }

  @media (prefers-reduced-motion: reduce) {
    .crt-noise,
    .crt-noise-fallback {
      display: none !important;
    }
  }

  @media (max-width: 640px) {
    .crt-glass,
    .crt-scanlines,
    .crt-noise-fallback {
      display: none !important;
    }
  }
</style>
