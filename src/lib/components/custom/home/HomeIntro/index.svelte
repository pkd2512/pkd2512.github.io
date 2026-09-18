<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
  import { page } from '$app/state';
  import { asset } from '$app/paths';

  let intro = $derived(page.data.meta.intro);
</script>

<svelte:head>
  <link
    rel="preload"
    href={asset('/media/' + intro.img)}
    as="image"
    fetchpriority="high"
  />
</svelte:head>

<section id="hero">
  <Container width="fluid">
    <header>
      <div class="text">
        <h1>{@html intro.hed}</h1>
        <p class="dek">
          {@html intro.dek}
        </p>
        <div class="cta">
          <LinkButton
            label="Book a consultation"
            target=""
            url="https://topmate.io/prasanta_kumar_dutta"
            solid={true}
          />
        </div>
      </div>
      <div
        class="img"
        style={'background-image:url(' + asset('/media/' + intro.img) + ')'}
      ></div>
    </header>
  </Container>
</section>

<style lang="scss">
  @use 'src/lib/styles/mixins/fullHeight' as *;
  @use 'src/lib/styles/mixins/shadows' as *;

  #hero {
    background-color: var(--purple-soft);
    position: relative;
    z-index: var(--layer-2);
  }

  header {
    @include fullheight(0.8);

    @media (max-width: 600px) {
      @include fullheight(0.65);
    }

    display: flex;
    align-items: center;
    justify-content: center;
    padding-inline: var(--grid-gutter);
    color: var(--white);

    .img {
      width: 100%;
      max-height: 75svh;
      margin-bottom: -4.5rem;
      aspect-ratio: var(--ratio-square);
      background-repeat: no-repeat;
      background-size: contain;
      background-position: top right;
      border-bottom-right-radius: 20%;
      pointer-events: none;

      // @media (--xl-n-below) {
      position: absolute;
      bottom: 0;
      right: 0;
      margin-bottom: 0;
      // }
    }

    .text {
      // max-width: var(--grid-max-width);
      position: relative;
      z-index: var(--layer-1);

      @media (--xl-n-below) {
        // max-width: calc(var(--lg) - 2 * var(--space-xl));
      }

      @media (--lg-n-below) {
        // max-width: calc(1.15 * var(--md));
      }
    }

    .dek {
      font-family: var(--font-sans);
      color: var(--white-soft);
      font-size: var(--font-size-1);
      font-weight: var(--font-weight-light);
      @include text-shadow(var(--purple));
      max-width: var(--md);
      line-height: var(--line-height-medium);
      margin-block-end: var(--space-l);
    }

    .cta {
      text-align: left;
      max-width: var(--md);
    }

    :global(a) {
      background-color: var(--white) !important;
      color: var(--purple) !important;
      font-weight: bold;

      &:hover {
        background-color: var(--purple-soft) !important;
        color: var(--white) !important;
        border: none !important;
        border-left: 0.25rem solid var(--white) !important;
      }
    }

    h1 {
      color: var(--white-soft);
      text-wrap: balance;
      margin-inline: auto;
      margin-block: var(--space-l);
      @include filter-shadow(var(--purple));
    }
  }
</style>
