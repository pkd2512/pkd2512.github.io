<script>
  let { videoId, title = 'YouTube video' } = $props();

  let loaded = $state(false);
</script>

{#if loaded}
  <iframe
    loading="lazy"
    width="100%"
    style="aspect-ratio: var(--ratio-widescreen)"
    src="https://www.youtube-nocookie.com/embed/{videoId}?controls=1&autoplay=1&rel=1&modestbranding=1&playsinline=1"
    {title}
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
{:else}
  <button
    onclick={() => (loaded = true)}
    class="facade"
    aria-label="Play {title}"
  >
    <img
      src="https://i.ytimg.com/vi/{videoId}/maxresdefault.jpg"
      alt=""
      loading="lazy"
      style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;"
      onerror={(e) => {
        e.target.src = `https://i.ytimg.com/vi/{videoId}/hqdefault.jpg`;
      }}
    />
    <div
      style="position: relative; z-index: 1; width: 68px; height: 48px; background: rgba(0,0,0,0.7); border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: transform 0.2s;"
    >
      <svg viewBox="0 0 68 48" width="68" height="48" style="display: block;">
        <path
          d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
          fill="#FF0000"
        ></path>
        <path d="M45,24L27,14v20L45,24z" fill="#fff"></path>
      </svg>
    </div>
  </button>
{/if}

<style>
  button {
    aspect-ratio: var(--ratio-widescreen);
    width: 100%;
    border: none;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem !important;
    overflow: hidden;
    max-width: none;
    border: none !important;
    background-color: transparent;
  }
</style>
