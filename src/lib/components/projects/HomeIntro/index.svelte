<script>
  import Container from '$lib/components/ui/Container/index.svelte';

  export let data;

  const { hed, dek, media } = data.intro;
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
  }

  header {
    @include fullheight(0.8);

    display: flex;
    align-items: center;

    color: var(--white);
  }

  .text {
    max-width: 60%;
  }

  p {
    color: var(--white-soft);
    @include text-shadow(var(--purple));
  }

  h1 {
    margin: 0;
    @include filter-shadow(var(--purple));
  }
</style>
