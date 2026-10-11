<script>
  import MetaTags from '$lib/components/ui/MetaTags/index.svelte';

  let { data } = $props();

  let meta = $derived(data.meta);
  let Page = $derived(data.content);
</script>

<MetaTags
  title={meta.title}
  description={meta.description}
  image={meta.image}
  meta={data.meta}
/>

<header class="sr-only-heading">
  <h1>{meta.title}</h1>
  <p>{meta.description}</p>
</header>

<Page />

<style lang="scss">
  @use 'src/lib/styles/mixins/screenReaderOnly' as *;

  .sr-only-heading {
    h1, p {
      @include screenReaderOnly;
    }
  }
</style>
