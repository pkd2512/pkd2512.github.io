<script>
  import Container from '$lib/components/ui/Container/index.svelte';

  export let data;

  const { hed, dek, img } = data.intro;
</script>

<section id="header">
  <Container width="xl snap skip-sm">
    <header>
      <div class="text">
        <h1>{hed}</h1>
        <p>
          {dek}
        </p>
      </div>
      <div class="img">
        <img src="media/{img}" />
      </div>
    </header>
  </Container>
</section>

<style lang="scss">
  @import 'src/lib/styles/mixins/fullHeight';
  @import 'src/lib/styles/mixins/shadows';

  #header {
    background-color: var(--purple-soft);
    // background-image: url('https://www.transparenttextures.com/patterns/groovepaper.png');
    background-blend-mode: difference;
    position: relative;
  }

  header {
    @include fullheight(0.8);

    display: flex;
    align-items: center;
    justify-content: center;

    color: var(--white);
  }

  .img {
    max-width: 600px;
    margin-bottom: -5rem;

    @media (--xl-n-below) {
      position: absolute;
      bottom: -2rem;
      right: 0;
      margin-bottom: 0;
    }
  }

  .text {
    max-width: 38%;
    position: relative;
    z-index: var(--layer-1);

    @media (--xl-n-below) {
      max-width: 80%;
    }
  }

  p {
    color: var(--white-soft);
    font-size: var(--font-size-1);
    @include text-shadow(var(--purple));
  }

  h1 {
    margin: 0;
    @include filter-shadow(var(--purple));
  }
</style>
