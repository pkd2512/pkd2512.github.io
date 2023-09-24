<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import ParallaxHero from '$lib/components/ui/ParallaxHero/index.svelte';
  import { assets } from '$app/paths';

  /**
   * @param {String} hed
   * Title of the card
   */
  export let hed = '';

  /**
   * @param {String} dek
   * Card description
   */
  export let dek = '';
</script>

<section>
  <ParallaxHero img="/media/hero-about.jpg" />

  <Container width="lg" style="margin-top: calc(-2.3 * var(--space-3xl));">
    <div class="card">
      <div class="img">
        <img src="{assets}/media/Prasanta_KrDutta.jpg" alt="" />
      </div>
      <div class="body">
        <h1>{hed}</h1>
        <p>{@html dek}</p>
      </div>
    </div>
  </Container>
</section>

<style lang="scss">
  @import 'src/lib/styles/mixins/screenReaderOnly';
  @import 'src/lib/styles/mixins/fullHeight';

  .card {
    display: flex;
    position: relative;
    background-color: var(--white);
    border-radius: 0.25rem;
    max-width: calc(0.9 * var(--lg));
    margin-inline: auto;
    margin-block: var(--space-xl);
    box-shadow: var(--shadow-3);
  }

  .img {
    width: 45%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: var(--purple);
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;

    img {
      object-fit: cover;
      min-height: 100%;

      mix-blend-mode: lighten;
      filter: saturate(0.75);
    }
  }

  .body {
    width: 55%;
    padding: var(--space-s) var(--space-l);
    display: flex;
    align-items: center;

    h1 {
      @include screenReaderOnly;
    }

    p {
      font-family: var(--font-serif);
      margin-block: 0;
    }
  }
</style>
