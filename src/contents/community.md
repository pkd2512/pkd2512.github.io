---
# Metadata
title: Talks and Community Resources | Prasanta Kumar Dutta

description: Award-winning Information Experience Designer, crafting visual stories with data and solving problems in an aesthetically pleasing way.

keywords: Data Journalist, Graphics Journalist, Reuters Graphics Journalist, Data Visualisation Developer, Data Visualization Developer, Narrative Cartographer, User Interface Designer, User Experience Designer, Communication Designer, Data Storyteller, Information Designer, Graphic Designer, Art Director, User-centered design, UX, UI, Data Artist, Web Designer, Web Developer, Front-end Web Developer, Photographer, Traveller, Creative writer, Electronics and Communication Engineer, National Institute of Design, National Institute of Technology Durgapur, Prasanta, PrasantaKrDutta, Prasanta Kumar Dutta, Prasanta KrDutta, pkddapacific, pkd.dapacific, pkd_da_pacific, daPacific.

image: share.webp

type: page

intro:
  hed: Prasanta Kumar Dutta

  dek: Prasanta Kumar Dutta is an Information Experience Designer from India, working at the intersection of design, coding, and journalism at Reuters. With a background in engineering and design, he crafts data-driven pieces that help narrate important stories visually. Several of his work has been recognized with numerous awards. He also teaches and talks about data visualization, narrative cartography, and design at eminent institutes across&nbsp;India.

  img: hero.webp

published: true
---

<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
  import List from '$lib/components/custom/community/List/index.svelte';
  import ParallaxHero from '$lib/components/ui/ParallaxHero/index.svelte';
  import ReferralCard from '$lib/components/ui/ReferralCard/index.svelte';
  import PhotoPile from '$lib/components/ui/PhotoPile/index.svelte';
  import { asset } from '$app/paths';

  import talks from '/src/contents/data/talks.csv';
  import teachings from '/src/contents/data/teachings.csv';
  import resources from '/src/contents/data/resources.csv';
  import mentions from '/src/contents/data/mentions.csv';
</script>

<svelte:head>

  <link rel="preload" href={asset('/media/hero-community.webp')} as="image" fetchpriority="high">
</svelte:head>

<ParallaxHero img='/media/hero-community.webp'/>

<Container grid style="margin-block-start: var(--space-l);">
<div class="hed col-span-md-5">

## Talks, teaching and community

</div>
<div class="dek col-span-md-7">

I love to talk about design and data visualisation. Over the years, I have instructed students and professionals on data representation, geographic visualisation and visual storytelling.

<LinkButton solid="{true}" url="https://topmate.io/prasanta_kumar_dutta" label="Schedule a call" />

</div>
</Container>

<Container grid style="margin-block-start: var(--space-xl);">
<div class="col-span-full">
<PhotoPile orientation="widescreen"
  items={[
    {
      src: 'https://picsum.photos/seed/community-1/1600/900',
      alt: 'Placeholder photo from a talk',
      caption: 'Speaking at a data visualisation talk.',
    },
    {
      src: 'https://picsum.photos/seed/community-2/1600/900',
      alt: 'Placeholder photo from a workshop',
      caption: 'Running a hands-on workshop with students.',
    },
    {
      src: 'https://picsum.photos/seed/community-3/1600/900',
      alt: 'Placeholder photo from a classroom session',
      caption: 'A classroom session on narrative cartography.',
    },
    {
      src: 'https://picsum.photos/seed/community-4/1600/900',
      alt: 'Placeholder photo from a panel discussion',
      caption: 'On a panel discussing data storytelling.',
    },
    {
      src: 'https://picsum.photos/seed/community-5/1600/900',
      alt: 'Placeholder photo from a meetup',
      caption: 'Meeting fellow designers at a community meetup.',
    },
  ]}
/>
</div>
</Container>

<Container grid style="margin-block-start: var(--space-xl);">
<div class="col-span-full">
<List title='Interviews and Features' content={mentions}/>
<List title='Talks and Workshops' content={talks}/>
<List title='In the classroom' content={teachings}/>
</div>
</Container>

<Container width=md style="text-align: center;">
<ReferralCard  url="https://medium.com/diarium-da-pacific/showcasing-brilliance-2fe5fa976b5b" image="/media/teachings.webp" title="Showcasing Brilliance" description="A curation of data visualisation projects from my students"/>
</Container>

<Container grid style="margin-block-start: var(--space-xl);">
<div class="col-span-full">
<List title='Resources and Tools' content={resources}/>
</div>
</Container>
