---
# Metadata
title: Talks and Community Resources | Prasanta Kumar Dutta

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
  import List from '$lib/components/custom/community/List/index.svelte';
  import ParallaxHero from '$lib/components/ui/ParallaxHero/index.svelte';
  import ReferralCard from '$lib/components/ui/ReferralCard/index.svelte';

  import talks from '/src/contents/data/talks.csv';
  import teachings from '/src/contents/data/teachings.csv';
  import resources from '/src/contents/data/resources.csv';
</script>

<ParallaxHero img='/media/hero-community.jpg'/>

<Container width=md>

<p style="margin-block-start: var(--space-xl)">
  I love to talk about design and data visualisation. Over the years, I have instructed students and professionals on data representation, geographic visualisation and visual storytelling.
</p>

</Container>

<Container width=md style="text-align: center; margin-top: var(--space-m); margin-bottom: var(--space-xl);">

 <LinkButton solid="{true}"  url="#contact" label="Get in touch" />

 </Container>

<List title='Talks and Workshops' content={talks}/>

<List title='In the classroom' content={teachings}/>

<div style=text-align:center;><ReferralCard  url="https://medium.com/diarium-da-pacific/showcasing-brilliance-2fe5fa976b5b" image="/media/teachings.jpg" title="Showcasing Brilliance" description="A curation of data visualisation projects from my students"/></div>

<List title='Resources and Tools' content={resources}/>
