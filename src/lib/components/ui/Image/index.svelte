<script>
  export let src;
  export let alt;

  $: console.log(src, alt);
</script>

<img src="{src}" alt="{alt}" loading="lazy" />
