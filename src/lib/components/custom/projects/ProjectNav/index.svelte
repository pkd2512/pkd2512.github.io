<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
  import ReferralCard from '$lib/components/ui/ReferralCard/index.svelte';
  import { asset, resolve } from '$app/paths';
  import truncateText from '$utils/truncateText';

  let { adjacent } = $props();

  let arrowLeft = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="none" stroke="none" /><path fill="currentColor" d="m4.431 12.822l13 9A1 1 0 0 0 19 21V3a1 1 0 0 0-1.569-.823l-13 9a1.003 1.003 0 0 0 0 1.645z"/></svg>`;

  let arrowRight = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="none" stroke="none" /><path fill="currentColor" d="M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886z"/></svg>`;
</script>

<Container width="md">
  <section>
    {#if adjacent?.next}
      <h2>Read Next</h2>
      <!-- <LinkButton
        label="Read Next{arrowRight} {truncateText(
          adjacent.next.intro.hed,
          3
        )}"
        solid
        url={resolve('/projects/[slug]', { slug: adjacent.next.slug })}
      /> -->
      <ReferralCard
        target=""
        url={resolve('/projects/[slug]', { slug: adjacent.next.slug })}
        image={asset('/media/share-images/' + adjacent.next.image)}
        title={adjacent.next.intro.hed}
        description={adjacent.next.description}
      />
    {/if}
  </section>
</Container>

<style lang="scss">
  @import 'src/lib/styles/mixins/sectionTitle';
  h2 {
    @include sectionTitle;
  }
  section {
    margin-block-start: var(--space-xl-2xl);
    // display: flex;
    text-align: center;
    // justify-content: center;
    // align-items: center;
    // height: var(--space-2xl);
    // gap: var(--space-xs);
    // position: relative;

    // :global(svg) {
    //   margin-inline: var(--space-3xs);
    // }

    // :global(a) {
    //   width: 100%;
    //   max-width: none !important;
    //   display: inline-flex;
    //   align-items: center;
    //   justify-content: center;
    //   width: var(--xs);

    //   @media (--md-n-above) {
    //     position: absolute;
    //     right: 0;
    //     bottom: 0;
    //   }
    // }
  }
</style>
