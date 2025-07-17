---
title: Air pollution in north India | Prasanta Kumar Dutta

description: Visual analysis of the air quality crisis in northern India every winter and its extent, using data collected from air quality monitors, satellite imagery from NASA and photographic evidence.

keywords: Data Journalist, Graphics Journalist, Reuters Graphics Journalist, Data Visualisation Developer, Data Visualization Developer, Narrative Cartographer, User Interface Designer, User Experience Designer, Communication Designer, Data Storyteller, Information Designer, Graphic Designer, Art Director, User-centered design, UX, UI, Data Artist, Web Designer, Web Developer, Front-end Web Developer, Photographer, Traveller, Creative writer, Electronics and Communication Engineer, National Institute of Design, National Institute of Technology Durgapur, Prasanta, PrasantaKrDutta, Prasanta Kumar Dutta, Prasanta KrDutta, pkddapacific, pkd.dapacific, pkd_da_pacific, daPacific.

image: delhi-winter-pollution.webp
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
  hed: Air pollution in north India

  dek: "Each year, from late October, a thick blanket of smog settles over vast swathes of northern India, including the capital, New Delhi, pushing air pollution levels off the charts. 

  <br>
  I worked on this for my Master's graduation project that looks at the causes, severity and extent of the systemic problem using data collected from air quality monitors, satellite imagery from NASA and photographic evidence."

  img: projects/delhi-winter-pollution/hero.webp

  duration: 10 weeks

  client: Reuters

  url: https://www.reuters.com/graphics/INDIA-POLLUTION/010080SY1KE/

  quote: “North Indian cities, including Delhi, top a list of places with the worst air in the world” — WHO
---

<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
  import ProjectNav from '$lib/components/custom/projects/ProjectNav/index.svelte';
  import OverflowImage from '$lib/components/ui/OverflowingImage/index.svelte';
  import ReferralCard from '$lib/components/ui/ReferralCard/index.svelte';
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

      @media (--md-n-below) {
        flex-direction: column;
      }

    .card {
      background-color: var(--gray-soft);
      padding: var(--space-s);
      width: calc(100%/3);
      border-radius: 0.25rem;
      margin-inline: auto;

      @media (--md-n-below) {
        width: auto;
        max-width: var(--xs);
      }
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

<OverflowImage breakpoint=480 maxWidth='150%' url='media/projects/delhi-winter-pollution/research-chart.webp' alt="Screenshot of line charts showing PM2.5 levels and fires detected between 2015 and 2018." caption="The data was plotted using MS Excel. Looking at the particulate pollutant levels alongside the fires data and Diwali helped establish a correlation among the events." />

<figure>

  ![A word cloud of some causes identified - factories, smoke, motor vehicles, dust, crop fires, aerosols, particulate pollutants, weather conditions, smog, haze, fog, slow winds.](/media/projects/delhi-winter-pollution/causes.webp)

  <figcaption>
  After extensive secondary research, we were able to narrow down major elements of the system that contribute to the air quality in the region.
  </figcaption>

  </figure>

## Design solution

The timing of the project, when it started — September 2018, was quite appropriate to study the air quality crisis in Delhi thoroughly as it could be substantiated with data from coming months. We, a team comprising <LinkButton label='Rajshree Deshmukh'  url='https://www.linkedin.com/in/rajshree-deshmukh/' />, <LinkButton label='Gurman Bhatia'  url='https://www.linkedin.com/in/gurmanbhatia/' /> and <LinkButton label='Simon Scarr'  url='https://www.linkedin.com/in/simon-scarr/' /> began ideating on project angles which can be summarised as --

* Elaborate the reasons behind the air quality crisis using explainer graphic using 2017 evidence, and a primer of what may happen in 2018. <LinkButton label='See Project'  url='https://www.reuters.com/graphics/INDIA-POLLUTION/010080SY1KE/' />

* Show qualitatively/quantitatively the impact of Diwali firecrackers, stubble burning and the meteorological factors on air pollution. <LinkButton label='See Project'  url='https://www.reuters.com/graphics/INDIA-POLLUTION/010081VR3BW/' />

* Show visually, how bad Delhi’s air can get in winter.
Get photos/videos; do some experiment to see the particulate pollutants. <LinkButton label='See Project'  url='https://www.reuters.com/graphics/INDIA-POLLUTION/01008173281/' />

### Making air quality maps

Using monthly data of Aerosol Optical Thickness and Visible Infrared Imaging Radiometer Suite (VIIRS) 375 m active fire product from NASA, I created the maps on QGIS.

![A panel of three maps showing the haze and dots of fires in orange over the norther part of India for March, October and November 2017.](/media/projects/delhi-winter-pollution/map-1.webp)

  <figure>

  ![A panel of two maps for March and October 2017 showing the air quality as grey smoke. Location of fires are shown as red dots. The direction of wind is marked using arrows around Delhi.](/media/projects/delhi-winter-pollution/map-2.webp)

  <figcaption>
  The final maps were exported and styled in Adobe Illustrator. Annotations were added to add context for the readers. Multiple versions of the layout were designed to account for responsive design of the webpage using ai2html.
  </figcaption>

  </figure>

  <figure>

  ![A satellite image showing Punjab, Haryana and Delhi covered by a white smoky haze. Red dots are overlaid on it to show location of stubble burning fires detected by satellite.](/media/projects/delhi-winter-pollution/map-3.webp)

  <figcaption>
  In order to further establish the presence of multitude of fires in the Punjab region in the month of October as seen from VIIRS fire data, I analysed satellite images from NASA Worldview for traces of smoke and fumes that correspond to fire the spots detected.
  </figcaption>

  </figure>

</Container>

<Container width="md" style="text-align:center; margin-block-end:var(--space-l)">

  <ReferralCard
    url="https://www.reuters.com/graphics/INDIA-POLLUTION/010080SY1KE/"
    image="https://fingfx.thomsonreuters.com/gfx/rngs/INDIA-POLLUTION/010080SY1KE/images/share-card.png"
    title="Preparing to choke"
    description="India’s annual air pollution threat explained"
  />

</Container>

<Container width="md">

### Visualising Delhi's air quality

At this point in the project, the attempt was to take a look at the PM2.5 levels across various regions of the city of Delhi, because the pollution levels are not uniform across the city and can vary with the time of the day as well.

Using PM2.5 concentrations data at Continuous Air Quality Monitoring Stations (CAAQM) in Delhi from Central Pollution Control Board, I wanted to look at how the air quality varies geographically within the city and is affected by factors like wind, temperature, stubble burning and Diwali celebrations.

  <figure>

  ![A heatmap of square cells ranging from light to dark blues show air quality in different regions of Delhi from 5-9 November, 2018 .](/media/projects/delhi-winter-pollution/heatmap-1.webp)

  <figcaption>
  Certain patterns emerge from the PM2.5 data for the Diwali period in 2018 — poor air on Nov. 5 due to stubble burning fires, followed by relatively clean air the next day and extremely high levels of PM2.5 on Diwali night, which breaks the sensors at most stations.
  </figcaption>

  </figure>

Using the heat map as a starting point, the time period of observations was expanded to include the whole of October 2018 and the few days of November, later to be expanded to the end of the month.

  <figure>

  ![Variations of the colour scale used in the heatmap.](/media/projects/delhi-winter-pollution/heatmap-2.webp)

  <figcaption>
  The colour scale took quite a few rounds of iterations to resemble the various categories in terms of health impacts of PM2.5 concentrations to add meaning and context to the heatmap. In order to effectively highlight the upper end using reds and purples the ramp was created using HCL (Hue-Chroma-Luminance) colour-interpolation in d3.js.
  </figcaption>

  </figure>

</Container>

<Container width="lg">

  <OverflowImage breakpoint=720 maxWidth='200%' url='media/projects/delhi-winter-pollution/heatmap-3.webp' alt="Screenshot of a section of the heatmap." caption="The air quality heatmap, paired with charts showing temperature, wind speeds and fires data. The final version was simplified and fires information was added as annotations at relevant places." />

</Container>

<Container width="md" style="text-align:center; margin-block-end:var(--space-l)">

  <ReferralCard
    url="https://www.reuters.com/graphics/INDIA-POLLUTION/010081VR3BW/"
    image="https://www.reuters.com/graphics/INDIA-POLLUTION/010081VR3BW/images/share-card.png"
    title="Palette of Pollution"
    description="A Reuters analysis of air quality across New Delhi from October and November shows the impact of temperature and wind speed on pollution levels."
  />

</Container>

<Container width="md">

The outcome of the projects were visual stories published by Reuters. The detailed process is documented in my graduation document which you can navigate through by manually turning the pages at the curl using the mouse or using the <kbd>&#8592;</kbd> and <kbd>&#8594;</kbd> keys. To peek into a section of a page click on the section to zoom in and out of it. You can also zoom out of a view using the <kbd>Esc</kbd> key.

<p style="font-style:italic;">
The high-resolution images may take a while to load upon zoom, depending upon your internet speed.
</p>

</Container>

<Container width="fluid">

<div class='embed-responsive'>
  <iframe class="embed-responsive-item" src="https://delhi-winter-pollution-gpdoc.vercel.app" frameborder="0" scrolling="yes" height="100%" width="100%"allowfullscreen=""></iframe>
</div>

</Container>

<Container width="md">

The project was also featured on <LinkButton label='Lines of Inquiry'  url='https://issuu.com/strangerobot/docs/loi_nid_ebook/94' />, the Annual Design Show at the National Institute of Design, Ahmedabad, India in March 2020.

</Container>
