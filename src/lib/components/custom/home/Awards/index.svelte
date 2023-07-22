<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import Marquee from 'svelte-fast-marquee';
  import { assets } from '$app/paths';
  let play = true;
</script>

<Container id="awards" width="fluid">
  <Marquee pauseOnHover="{true}" speed="{50}" play="{play}">
    <a
      target="_blank"
      href="https://snd.org/best-of-design-competitions/snd44-annual-creative-competition-results/"
      ><img
        src="{assets}/media/awards/snd.png"
        alt="Society for News Design Awards"
      /></a
    >
    <a
      target="_blank"
      href="https://www.reutersagency.com/en/about/journalists-of-the-year-awards/"
      ><img
        src="{assets}/media/awards/reuters.jpg"
        alt="Reuters Journalists of the Year Awards"
      /></a
    >
    <a
      target="_blank"
      href="https://winners.webbyawards.com/2021/websites-and-mobile-sites/features-design/technical-achievement/174760/covid-tracker"
      ><img src="{assets}/media/awards/webby.jpg" alt="Webby Awards" /></a
    >
    <a
      target="_blank"
      href="https://www.informationisbeautifulawards.com/showcase"
      ><img
        src="{assets}/media/awards/iib.png"
        alt="Information is Beautiful Awards"
      /></a
    >
    <a
      target="_blank"
      href="https://www.adobeawards.com/the-gallery?y=2018&liveproject=20188973"
      ><img
        src="{assets}/media/awards/adobe.jpg"
        alt="Adobe Design Achievement Awards"
      /></a
    >
  </Marquee>
</Container>

<style lang="scss">
  img {
    height: 75px;
    width: auto;
    margin: var(--space-l-xl);
  }

  :global {
    #awards {
      // background-color: white;
      mix-blend-mode: multiply;
      // box-shadow: var(--shadow-1);
    }
  }
</style>
