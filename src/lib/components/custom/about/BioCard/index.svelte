<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import { assets } from '$app/paths';
  export let hed = '';
  export let dek = '';
</script>

<section>
  <div class="hero"></div>

  <Container width="md" style="margin-top: calc(-2.3 * var(--space-3xl));">
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

  section {
    margin-top: calc(-2 * var(--space-3xl));
  }
  .hero {
    width: auto;
    @include fullheight(0.85);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('/media/pexels-prasanta-kr-dutta-104361.jpg');
  }

  .card {
    display: flex;
    position: relative;
    background-color: var(--white);
    border-radius: 0.25rem;
    max-width: calc(0.8 * var(--lg));
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
    padding: var(--space-xs) var(--space-m);

    h1 {
      @include screenReaderOnly;
    }

    p {
      font-family: var(--font-serif);
    }
  }
</style>
