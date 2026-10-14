<script>
  import MetaTags from '$lib/components/ui/MetaTags/index.svelte';
  import Gallery from '$lib/components/custom/galleries/Gallery/index.svelte';

  let { data } = $props();

  let meta = $derived(data.meta);
  let Page = $derived(data.content);

  // A gallery lists its items in its front matter; one that sources them
  // elsewhere builds its own <Gallery> in the page body. Items marked
  // `published: false` are not final yet and stay off the wall.
  let items = $derived(
    meta.items?.filter((/** @type {{ published?: boolean }} */ i) => i.published !== false)
  );
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

{#if items}
  <Gallery {items} title={meta.intro?.hed} detail={meta.detail} />
{/if}

<Page />

<style lang="scss">
  @use 'src/lib/styles/mixins/screenReaderOnly' as *;

  .sr-only-heading {
    h1, p {
      @include screenReaderOnly;
    }
  }
</style>
