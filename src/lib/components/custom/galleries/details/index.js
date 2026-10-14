import PilePreview from './PilePreview.svelte';

// What a tile opens into, by the name a gallery gives as `detail`. A name that
// maps to nothing falls back to the wall's own zoom, which just enlarges the
// tile's image. Every component here receives the tapped `item`.
// To add one: write the component and list it here.
/** @type {Record<string, import('svelte').Component<any> | undefined>} */
export default {
  image: undefined,
  pile: PilePreview,
};
