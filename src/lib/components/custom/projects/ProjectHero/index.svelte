<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import ParallaxHero from '$lib/components/ui/ParallaxHero/index.svelte';
  import { page } from '$app/stores';

  const { quote, img } = $page.data.meta.intro;
</script>

<Container width="fluid">
  <div class="anno">
    <aside>
      {@html quote}
    </aside>
  </div>
</Container>
<ParallaxHero parallax vPos="center" img="{img}" />

<style lang="scss">
  .anno {
    box-shadow: var(--shadow-2);
    max-width: 100%;
    position: relative;

    aside {
      text-wrap: balance;
      position: absolute;
      top: 0;
      left: 0;
      width: -webkit-fill-available;
      padding: var(--space-s) var(--space-l);
      color: var(--purple);
      text-align: center;
      font-family: var(--font-display);
      margin-bottom: 0;
      backdrop-filter: blur(5px);
      background-color: rgba($color: #fafafa, $alpha: 0.75);

      @media (--sm-n-below) {
        padding: var(--space-s) var(--space-s);
        font-size: var(--font-size--1);
        text-align: left;
      }
    }
  }
</style>
