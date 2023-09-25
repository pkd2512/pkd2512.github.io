<script>
  /**
   * @param {Boolean} close Is the menu open
   */
  export let open = true;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  x="0px"
  y="0px"
  width="36"
  height="36"
  viewBox="0 0 48 34.3"
  fill="var(--white-soft)"
  class:open="{open}"
>
  <path
    id="top"
    d="M3.4,0h17.1C22.5,0,24,1.5,24,3.4s-1.5,3.4-3.4,3.4H3.4C1.5,6.9,0,5.3,0,3.4S1.5,0,3.4,0z"
  ></path>
  <path
    id="bottom"
    d="M27.4,27.4h17.1c1.9,0,3.4,1.5,3.4,3.4c0,1.9-1.5,3.4-3.4,3.4H27.4c-1.9,0-3.4-1.5-3.4-3.4C24,29,25.5,27.4,27.4,27.4z"
  ></path>
  <path
    id="mid"
    d="M3.4,13.7h41.1c1.9,0,3.4,1.5,3.4,3.4s-1.5,3.4-3.4,3.4H3.4C1.5,20.6,0,19,0,17.1S1.5,13.7,3.4,13.7z"
  ></path>
</svg>

<style lang="scss">
  svg {
    path {
      stroke: var(--purple-soft);
      stroke-width: 3px;
      transition: transform 0.35s ease;

      &#top {
        transform-origin: 6px 10px;
      }
      &#bottom {
        transform-origin: 44px 26px;
      }
      &#mid {
        transform-origin: center;
      }
    }

    &.open {
      path {
        &#top {
          transform: rotate(40deg);
        }
        &#bottom {
          transform: rotate(40deg);
        }
        &#mid {
          transform: rotate(-40deg);
        }
      }
    }
  }
</style>
