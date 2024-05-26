---
# Metadata
title: About | Prasanta Kumar Dutta

description: Award-winning Information Experience Designer, crafting visual stories with data and solving problems in an aesthetically pleasing way.

keywords: Data Journalist, Graphics Journalist, Reuters Graphics Journalist, Data Visualisation Developer, Data Visualization Developer, Narrative Cartographer, User Interface Designer, User Experience Designer, Communication Designer, Data Storyteller, Information Designer, Graphic Designer, Art Director, User-centered design, UX, UI, Data Artist, Web Designer, Web Developer, Front-end Web Developer, Photographer, Traveller, Creative writer, Electronics and Communication Engineer, National Institute of Design, National Institute of Technology Durgapur, Prasanta, PrasantaKrDutta, Prasanta Kumar Dutta, Prasanta KrDutta, pkddapacific, pkd.dapacific, pkd_da_pacific, daPacific.

image: share.jpg

type: page

intro:
  hed: Prasanta Kumar Dutta

  dek: Prasanta Kumar Dutta is an Information Experience Designer from India, working at the intersection of design, coding, and journalism at Reuters. With a background in engineering and design, he crafts data-driven pieces that help narrate important stories visually. Several of his work has been recognized with numerous awards. He also teaches and talks about data visualization, narrative cartography, and design at eminent institutes across&nbsp;India.

  img: hero.png

published: true
---
<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
  import BioCard from '$lib/components/custom/about/BioCard/index.svelte';
  import ReferralCard from '$lib/components/ui/ReferralCard/index.svelte';

  let el;
  let innerHeight;
  
  let top = 0;
  let marginTop = 0;

  const getTop = () =>{
    const { top } = el && el.getBoundingClientRect();
    return top;
  }

  $: if(el) {
    top = getTop();
  }

  $: if(innerHeight >960) {
   marginTop = top < innerHeight*0.9 ? Math.round(innerHeight*0.15) : 0;
  }

</script>

<svelte:window bind:innerHeight/>

<BioCard hed={intro.hed} dek={intro.dek}/>

<div bind:this={el} style="position: relative; top: {marginTop}px" >
<Container width=md>

## A storyteller, passionate about data visualisation

At <LinkButton target=_blank label='Reuters' url='https://www.reuters.com/authors/prasanta-kumar-dutta/' />, I work mainly with the Europe desk covering breaking news as well as graphics-driven stories. My work typically involves a combination of research and data analysis, data gathering, ideating visuals, making maps and charts, and putting them all together on a responsive webpage.

I combine my knowledge of designing interfaces with my love for coding (HTML/CSS/JS).  I have extensively used D3 to develop interactive dataviz along with other libraries for canvas-based graphics. For data analysis, I mainly rely on Excel, Observable Notebooks and a pinch of Python when required. I also
enjoy working with spatial datasets and a big part of my work needs me to make maps from raw datasets using tools like QGIS. For design, I mainly use Adobe Illustrator and Figma, along with other photo and video tools in the suite.

My work has been recognised with <LinkButton target=_blank label='numerous awards' url='https://www.linkedin.com/in/pkddapacific/details/honors/' />  including the Webby, Society for News Design and Reuters Journalists of the Year Awards.

<div style=text-align:center;>
<ReferralCard url="https://datajournalism.com/read/blog/best-data-journalism-projects-2021#vaccination-tracker-reuters" image="https://s3.eu-central-1.amazonaws.com/datajournalismcom/long-reads/best-data-journalism-projects-2021/roundup2021-2.jpg" title="Data journalism roundup 2021" description="Featuring the Reuters COVID-19 vaccination tracker"
/></div>

## An engineer turned information designer

I began my journey as most Indians do -- by pursuing an undergrad in engineering. I graduated from <LinkButton target=_blank label='National Institute of Technology Durgapur, India' url='https://nitdgp.ac.in/' /> with a Bachelor of Technology in Electronics & Communication Engineering in 2015. During that time, I developed an interest in <LinkButton target=_blank label='robotics' url='https://www.slideshare.net/secret/FYLgD09ElKVZ7F' />, <LinkButton target=_blank label='movie-making' url='https://www.youtube.com/watch?v=KEBk9fZOdEY' /> and of course <LinkButton target=_blank label='graphic design' url='https://www.behance.net/gallery/22482999/MOTOR-Zundung-5' />. A year later, I decided to seek a formal education in design which led me to pursue a Masters in Information Design from <LinkButton target=_blank label='National Institute of Design Bangalore, India' url='https://www.nid.edu/academics/programmes/master-of-design-mdes/information-design-mdes' />.

In the meanwhile, I briefly worked as --

- An Assistant Manager at an e-learning startup, where I managed the creation and curation of high school maths and science content among other things.

- A Graphic Designer at a digital marketing agency, where I designed ads, infographics and other <LinkButton target=_blank label='promotional materials' url='https://www.facebook.com/eklakshyatransformations/videos/1623378141305834' />.

- A freelance UX-UI designer for a digital commerce app, where I ideated user journeys and designed app screens and other <LinkButton target=_blank label='UI assets' url='https://www.behance.net/gallery/52114777/Icon-Design-for-local-shopping-app-Bottleview' />.

</Container>
</div>

<Container width=md style="text-align: center; margin-top: var(--space-m); margin-bottom: var(--space-xl);">

 <LinkButton solid="{true}" target=_blank  url="https://prasantakrdutta.notion.site/Prasanta-Kumar-Dutta-7e14ed79579f40bdab9d739a8a576ea2" label="View My Resume" />

</Container>

<Container width=md>

## An aspiring artist and an avid experimenter

I love to dabble in generative and digital art when I can. You can find some of my explorations on <LinkButton target=_blank label='Instagram' url='https://www.instagram.com/thebongartista/' /> or on my <LinkButton target=_blank label='blog' url='https://medium.com/diarium-da-pacific/tagged/projects' />. As I come across new technology, I love to try it out for fun and see how it might be useful for my area of work. <LinkButton label='Reach out' url='#contact' /> if you would like to buy or exhibit my artwork!

<figure>

![My logo, reading PKD, imagined as islands in the Pacific generated using ControlNet v1.1.](/media/pkd-islands.png)

<figcaption>
My logo, imagined as islands in the Pacific generated using ControlNet v1.1.
</figcaption>

</figure>

My experiments don't stop in the digital realm. When I am not working, you can find me exploring places and indulging in the <LinkButton target=_blank label='culinary arts' url='https://www.instagram.com/thebongbawarchi/' />.

<div style=text-align:center;><ReferralCard url="https://medium.com/diarium-da-pacific/cooking-is-therapy-424efbdc4570" image="/media/cooking.jpg" title="Cooking is therapy" description="How a designer finds solace in the culinary arts to exercise his creative senses"
/></div>

</Container>
