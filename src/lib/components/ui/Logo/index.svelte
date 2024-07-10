<script>
  /**
   * @param {String} colour - Fill colour of the logo
   */
  export let colour = 'var(--purple-soft)';

  /**
   * @param {String} size - Dimension as 'px' or 'rem'
   */
  export let size = '2rem';
</script>

<svg
  {...$$restProps}
  id="logo"
  width="{size}"
  height="{size}"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 575 575"
>
  <defs>
    <clipPath id="clippath">
      <rect fill="none" x="0" y="0" width="575" height="575"></rect>
    </clipPath>
  </defs>
  <g style="pointer-events: none;" fill="{colour}" clip-path="url(#clippath)">
    <g>
      <path
        d="M368,480c61.76,0,112-50.24,112-112V208c0-6.83-4.28-12.66-10.31-14.96-.04-.01-.05-.06-.02-.09l10.31-10.3s.02-.02,.02-.04V48.5c0-8.65-6.65-16.11-15.29-16.48-9.17-.4-16.71,6.91-16.71,15.98v121.35s0,.03-.02,.04l-191.98,191.98,112,118.63Z"
      ></path>
      <path
        d="M208,96c-61.76,0-112,50.24-112,112v160c0,6.86,4.32,12.71,10.39,14.99l-10.39,10.38v134.63c0,8.84,7.16,16,16,16s16-7.16,16-16v-121.37l192-192v-6.63c0-61.76-50.24-112-112-112Z"
      ></path>
    </g>
  </g>
</svg>
