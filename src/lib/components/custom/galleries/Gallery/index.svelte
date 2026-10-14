<script>
  import InfiniteCanvas from '../canvas/InfiniteCanvas.svelte';
  import details from '../details/index.js';

  /**
   * @type {{
   *   items: Array<Record<string, any>>,
   *   title?: string,
   *   detail?: string
   * }}
   */
  let { items, title = '', detail = 'image' } = $props();

  // How a tile opens: a name from details/index.js, or the wall's own zoom.
  let Detail = $derived(details[detail]);
</script>

<!--
  Any list of images on one pannable wall, in the page flow. An item needs
  img_url (under /media/) and aspect; title, client, category, ref_url and
  alt are optional, and so is thumbs: false for images with no thumbs_<w>
  folders. What a tile opens into is picked by `detail`.
-->
<InfiniteCanvas {items} {title} {Detail} embedded />
