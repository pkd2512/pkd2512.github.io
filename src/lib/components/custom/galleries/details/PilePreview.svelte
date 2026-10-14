<script>
  import PhotoPile from '$lib/components/ui/PhotoPile/index.svelte';

  /**
   * @type {{ item: { img_url: string, title?: string, alt?: string, pages?: string[] } }}
   */
  let { item } = $props();

  // The cover first, then the pages of the piece.
  let pile = $derived(
    [item.img_url, ...(item.pages ?? [])].map((src, i) => ({
      src: '/media/' + src,
      alt: i === 0 ? (item.alt ?? item.title ?? '') : '',
    }))
  );
</script>

<PhotoPile items={pile} orientation="landscape" />
