<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import { page } from '$app/stores';

  const { hed, dek, img } = $page.data.meta.intro;
</script>

<section id="hero">
  <Container width="xl">
    <header>
      <div class="text">
        <h1>{@html hed}</h1>
        <p>
          {@html dek}
        </p>
      </div>
      <div class="img" style="background-image:url(/media/{img})"></div>
    </header>
  </Container>
</section>

<style lang="scss">
  @import 'src/lib/styles/mixins/fullHeight';
  @import 'src/lib/styles/mixins/shadows';

  #hero {
    background-color: var(--purple-soft);
    position: relative;
    z-index: var(--layer-5);
  }

  header {
    @include fullheight(0.8);

    @media (max-width: 600px) {
      @include fullheight(0.65);
    }

    display: flex;
    align-items: center;
    justify-content: center;

    color: var(--white);
  }

  .img {
    width: 100%;
    max-width: 600px;
    margin-bottom: -4.5rem;
    aspect-ratio: var(--ratio-square);
    background-repeat: no-repeat;
    background-size: contain;
    border-bottom-right-radius: 20%;

    @media (--xl-n-below) {
      position: absolute;
      bottom: 0;
      right: 0;
      margin-bottom: 0;
    }
  }

  .text {
    max-width: calc(0.8 * var(--md));
    position: relative;
    z-index: var(--layer-1);

    @media (--xl-n-below) {
      max-width: calc(var(--lg) - 2 * var(--space-xl));
    }

    @media (--lg-n-below) {
      max-width: calc(1.15 * var(--md));
    }
  }

  p {
    font-family: var(--font-sans);
    color: var(--white-soft);
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-light);
    @include text-shadow(var(--purple));
    max-width: var(--md);
  }

  h1 {
    color: var(--white-soft);
    margin-inline: auto;
    margin-block: var(--space-l);
    @include filter-shadow(var(--purple));
  }
</style>
