<script>
  import { browser } from '$app/environment';
  if (browser) {
    // to prevent error window is not defined, because it's SSR
    window.location.href = 'https://medium.com/diarium-da-pacific';
  }
</script>
