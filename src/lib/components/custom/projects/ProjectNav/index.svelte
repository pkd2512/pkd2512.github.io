<script>
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import truncateText from '$utils/truncateText';

  let arrowLeft = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="none" stroke="none" /><path fill="currentColor" d="m4.431 12.822l13 9A1 1 0 0 0 19 21V3a1 1 0 0 0-1.569-.823l-13 9a1.003 1.003 0 0 0 0 1.645z"/></svg>`;

  let arrowRight = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="none" stroke="none" /><path fill="currentColor" d="M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886z"/></svg>`;
</script>

<section>
  {#if $page.data.adjacent.next}
    <LinkButton
      label="Next up{arrowRight} {truncateText(
        $page.data.adjacent.next.intro.hed,
        5
      )}"
      solid
      url="{base}/projects/{$page.data.adjacent.next.slug}"
    />
  {/if}
</section>

<style lang="scss">
  section {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    height: var(--space-2xl);
    gap: var(--space-xs);

    :global(a) {
      width: 100%;
      max-width: none !important;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
