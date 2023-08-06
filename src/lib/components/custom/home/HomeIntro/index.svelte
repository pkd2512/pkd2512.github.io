<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import { page } from '$app/stores';

  const { hed, dek, img } = $page.data.meta.intro;
</script>

<section id="header">
  <Container width="xl snap skip-sm">
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

  #header {
    background-color: var(--purple-soft);
    position: relative;
    z-index: var(--layer-5);
  }

  header {
    @include fullheight(0.8);

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
    max-width: 38%;
    position: relative;
    z-index: var(--layer-1);

    @media (--xl-n-below) {
      max-width: 75%;
    }
    @media (--sm-n-below) {
      max-width: 90%;
    }
  }

  p {
    color: var(--white-soft);
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-light);
    @include text-shadow(var(--purple));
  }

  h1 {
    color: var(--white-soft);
    margin: 0;
    @include filter-shadow(var(--purple));
  }
</style>
