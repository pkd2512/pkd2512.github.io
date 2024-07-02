<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import Marquee from 'svelte-fast-marquee';
  import { assets } from '$app/paths';
  let play = true;

  /**
   * @type {number}
   */
  let windowWidth;
</script>

<svelte:window bind:innerWidth="{windowWidth}" />

<section id="awards">
  <Container width="fluid">
    <Marquee
      pauseOnHover="{true}"
      speed="{windowWidth <= 480 ? 25 : 45}"
      play="{play}"
    >
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
      <a target="_blank" href="https://lapressclub.org/naej/"
        ><img
          src="{assets}/media/awards/la-pc.jpg"
          alt="Los Angeles Press Club’s National Entertainment Journalism Awards"
        /></a
      >
      <a
        target="_blank"
        href="https://opcofamerica.org/Awardarchive/the-whitman-bassow-award-2023/"
        ><img
          src="{assets}/media/awards/whitman.jpg"
          alt="18 The Whitman Bassow Award 2023"
        /></a
      >
      <a target="_blank" href="https://www.youtube.com/watch?v=z2eIfTX-6Jw"
        ><img
          src="{assets}/media/awards/fcc.jpg"
          alt="Kalinga FCC Awards for excellence in Journalism"
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
</section>

<style lang="scss">
  img {
    height: 75px;
    width: auto;
    margin: var(--space-l-xl);
  }

  a {
    filter: grayscale(0.9);

    &:hover {
      filter: none;
    }
  }

  #awards {
    mix-blend-mode: multiply;
    margin-bottom: var(--space-xl-2xl);

    :global(.marquee) {
      justify-content: space-around;
    }
  }
</style>
