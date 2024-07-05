---
title: Winter air pollution in North India | Prasanta Kumar Dutta

description: Investigating the causes behind the air quality crisis in northern India every winter and its extent, using data collected from air quality monitors, satellite imagery from NASA and photographic evidence.

keywords: Data Journalist, Graphics Journalist, Reuters Graphics Journalist, Data Visualisation Developer, Data Visualization Developer, Narrative Cartographer, User Interface Designer, User Experience Designer, Communication Designer, Data Storyteller, Information Designer, Graphic Designer, Art Director, User-centered design, UX, UI, Data Artist, Web Designer, Web Developer, Front-end Web Developer, Photographer, Traveller, Creative writer, Electronics and Communication Engineer, National Institute of Design, National Institute of Technology Durgapur, Prasanta, PrasantaKrDutta, Prasanta Kumar Dutta, Prasanta KrDutta, pkddapacific, pkd.dapacific, pkd_da_pacific, daPacific.

image: delhi-winter-pollution.jpg
type: project
date: '2018-10-16'
published: true

categories:
  - Reuters
  - Data Visuallisation
  - Infographics


links: 
  - type: project
    url: https://www.reuters.com/graphics/INDIA-POLLUTION/010080SY1KE/
    label: 📔 View Project
    target: _blank

  - type: doc
    url: projects/delhi-winter-pollution/
    label: 🗒️ Read more


intro:
  hed: Winter air pollution in north India

  dek: "Each year, from late October, a thick blanket of smog settles over vast swathes of northern India, including the capital, New Delhi, pushing air pollution levels off the charts. 

  <br>
  I worked on this three-part series as a part of my Master's graduation project that looks at the causes, severity and extent of the systemic problem using data collected from air quality monitors, satellite imagery from NASA and photographic evidence."

  img: projects/delhi-winter-pollution/hero.jpg

  duration: 10 weeks

  client: Reuters

  quote: “North Indian cities, including Delhi, top a list of places with the worst air in the world” — WHO
---

<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
  import ProjectNav from '$lib/components/custom/projects/ProjectNav/index.svelte';
</script>

<style lang='scss'>
  @import 'src/lib/styles/mixins/index';

  .embed-responsive {
    @include iframeResponsive;
  }

  .brief-cards {
    display: flex;
    gap: var(--space-xs);
    font-family: var(--font-serif);
    color: var(--black-soft);
    line-height:  var(--line-height-medium);
    font-style: italic;
    text-wrap: pretty;

    .card {
      background-color: var(--gray-soft);
      padding: var(--space-s);
      width: calc(100%/3);
      border-radius: 0.25rem;
    }
  }

</style>

<Container width="md">

## Creative brief

Delhi’s deteriorating air quality in the cold season was not a new phenomenon and had already been widely reported on. However, we wanted to investigate the nuances through the lens of data and explore storytelling ideas for explaining them to the mass audience, as a means of creating awareness before the upcoming cold season by developing interactive visuals for the same.

</Container>

<Container width="lg">
  <figure class="brief-cards">
    <div class="card">
      01
      <br>
      <b>Investigate the conjecture</b> that the quality of air in north India deteriorates during the cold season.
    </div>
    <div class="card">
      02
      <br>
      <b>Identify patterns</b> and come up with conclusive evidence to explain Delhi air pollution.
    </div>
    <div class="card">
      03
      <br>
      <b>Use visual methods to explain</b> the facts that can help create awareness and start conversations in the right direction.
    </div>
  </figure>
</Container>

<Container width="md">

## Research and analysis

We were familiar with the most common causes that the increased air pollution were attributed to -- crop stubble burning in the neighbouring states and burning of firecrackers during the festival of Diwali. After a brief reading on how to best quantify air quality, we sourced some data for particulate pollutants in the city and plotted along with the stubble burning data.

<figure>

  ![A word cloud of some causes identified](/media/projects/delhi-winter-pollution/causes.png)

  <figcaption>
  After extensive secondary research, we were able to narrow down major elements of the system that contribute to the air quality in the region.
  </figcaption>

  </figure>

</Container>
