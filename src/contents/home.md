---
# Metadata
title: Prasanta Kumar Dutta | Information Experience Designer

description: Award-winning Information Experience Designer, crafting visual stories with data and solving problems in an aesthetically pleasing way.

keywords: Data Journalist, Graphics Journalist, Reuters Graphics Journalist, Data Visualisation Developer, Data Visualization Developer, Narrative Cartographer, User Interface Designer, User Experience Designer, Communication Designer, Data Storyteller, Information Designer, Graphic Designer, Art Director, User centered design, UX, UI, Data Artist, Web Designer, Web Developer, Front-end Web Developer, Photographer, Traveller, Creative writer, Electronics and Communication Engineer, National Institute of Design, National Institute of Technology Durgapur, Prasanta, PrasantaKrDutta, Prasanta Kumar Dutta, Prasanta KrDutta, pkddapacific, pkd.dapacific, pkd_da_pacific, daPacific.

image: share.webp

type: page

intro:
  hed: Prasanta Kumar Dutta

  dek: An Information Experience Designer, crafting award-winning visual stories with data at Reuters and solving problems in an aesthetically pleasing&nbsp;way.

  img: hero.webp

published: true
---

<!-- Components -->
<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import RecentProjects from '$lib/components/custom/home/RecentProjects/index.svelte';
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
  import UpcomingTalk from '$lib/components/custom/home/UpcomingTalk/index.svelte';
  import Awards from '$lib/components/custom/home/Awards/index.svelte';
  import Testimonials from '$lib/components/custom/home/Testimonials/index.svelte';
  import BlogFeed from '$lib/components/custom/home/BlogFeed/index.svelte';
  import Shop from '$lib/components/custom/home/Shop/index.svelte';
  import YouTubeEmbed from '$lib/components/ui/YouTubeEmbed/index.svelte';
  import PhotoPile from '$lib/components/ui/PhotoPile/index.svelte';

</script>

<div class=awards>
<Awards />
</div>

<Container grid style="margin-block-start:  var(--space-2xl);">
<div class="hed col-span-md-5">

## Information design, web development and data journalism

<LinkButton label='More about my work' url='about/#a-storyteller-passionate-about-data-visualisation' />
</div>
<div class="dek col-span-md-7">

I design data-driven visual narratives, dashboards and web applications that help transform information to knowledge using charts, maps and interactive visualisations.

Several of my work over the years have been recognised with various awards including the Society for News Design and the Webby awards.

</div>
</Container>
<RecentProjects />

<Container grid>
<div class="hed col-span-md-5">

## Towards data and infographic literacy

<LinkButton label='See all talks and workshops' url='community/' />
</div>
<div class="dek col-span-md-7">

I love to <LinkButton label='talk' url='https://youtube.com/playlist?list=PLDs9PQJU9iKYFO7VPsaqwhrmFwVUAvtWN&si=Y6-PBmDNPAv-zjZ8' /> about design and data visualisation.
Over the years, I have instructed design students on data representation, geovisualisation and data storytelling at eminent institutes across India like the National Institute of Design and JK Lakshmipat University.

<UpcomingTalk />

</div>
<div class="c col-span-full" style="margin-block-start: var(--space-s);">
<YouTubeEmbed videoId="ngjkqqjW5kY" title="Video of Prasanta talking about Understanding Perception-Driven Data Visualisation at VizChitra 2025" />
</div>
</Container>

<Testimonials/>

<Container grid>
<div class="hed col-span-md-5">

## Art and Photography

</div>
<div class="dek col-span-md-7">

I dabble in creative coding and generative art, mainly as a means to explore the beauty of mathematics, some of which are documented on my <LinkButton label='blog' url='https://medium.com/diarium-da-pacific'  /> and <LinkButton label='Instagram' url='https://www.instagram.com/thebongartista/'  />.

</div>
</Container>

<Container grid>
<div class="col-span-xl-10">
<figure>
<iframe loading="lazy" title="Interactive p5 sketch: Ideas | Thoughts | Actions" aria-label="Interactive visualization: Move your mouse to create flowing patterns that shift between turbulent and calm states" frameborder="0" src="https://openprocessing.org/sketch/1051968/embed/" width="100%" height="500px" style=" border-radius:0.5rem; overflow:hidden;"></iframe>
<figcaption>

<em>Ideas | Thoughts | Actions.</em> This interactive sketch was created using p5.js as a part of Inktober 2021 explorations on <LinkButton label='Openprocessing'  url='https://openprocessing.org/user/66773' />. Move around the canvas to find spots of turbulence or&nbsp;calm.

</figcaption>
</figure>

</div>
</Container>

<!-- <Shop /> -->

<Container grid>

<div class="col-span-lg-5">

I co-host <LinkButton label='Creative Coding Crafts Space'  url='https://www.instagram.com/p/DNKVWp3M8IG/' /> -- a London-based and online community dedicated to making space for creativity - physical space, head space, collaboration space. We try to meet monthly to explore tools, ideas, and experiments that live at the intersection of code and art.

</div>

<div class="col-span-lg-7">
<PhotoPile orientation="golden"
  items={[
    {
      src: '/media/c3s/c3s-1.webp',
      alt: "Orange flyer for Creative Coding Crafts Space taped to a dark brick wall, decorated with colourful generative butterflies and a QR code marked 'Register today!'. It invites people to bring laptops for an afternoon of making generative art with code, at The Cave, Algha Works, Hackney Wick, Saturday 28 September, 2 to 6 pm.",
    },
    {
      src: '/media/c3s/c3s-2.webp',
      alt: "Prasanta speaking at a standing table with a laptop, beside a large projected slide titled 'About C3S'. The slide describes Creative Coding Crafts Space as a London-based and online community for exploring the tools, ideas and experiments at the intersection of code and art, and credits its hosts Dea Bankova and Prasanta Kumar Dutta.",
    },
    {
      src: '/media/c3s/c3s-3.webp',
      alt: "Prasanta speaking into a microphone while seated on a stool beside a laptop, in a brick-walled venue lit with blue and amber light. Workshop participants with laptops listen at a table on the left.",
    },
    {
      src: '/media/c3s/c3s-4.webp',
      alt: "A speaker at a laptop presents to a room of participants seated at tables with laptops. The projected screen behind shows a pink and blue mandala pattern drawn with code.",
    },
    {
      src: '/media/c3s/c3s-5.webp',
      alt: "Participants at laptops face a large projection of swirling purple, orange and blue generative visuals, with lines of live-coding code beside them. Two people at the front adjust the setup.",
    },
    {
      src: '/media/c3s/c3s-6.webp',
      alt: "A pen plotter, a small robotic arm holding a black marker, drawing geometric patterns on paper. Finished squares nearby show grids of overlapping squares, scattered small shapes and looping circles.",
    },
    {
      src: '/media/c3s/c3s-7.webp',
      alt: "Participants in a craft workshop hold out their hands to compare white gloves decorated with felt flowers and small glowing LED lights. A table of coloured felt and craft supplies sits in front.",
    },
    {
      src: '/media/c3s/c3s-8.webp',
      alt: "A speaker holding a microphone presents beside a laptop on a standing table, in front of a wall-sized pattern of overlapping blobs in neon pink, blue, green and orange. Two attendees with laptops sit in the foreground.",
    },
    {
      src: '/media/c3s/c3s-9.webp',
      alt: "Collage of six photos from C3S events: Prasanta and others smiling in selfies and group portraits, in a red-lit lounge, on a dark street, in a plant-filled venue and beside a neon sign reading 'The Nest'.",
    },
  ]}
/>
</div>

</Container>

<Container grid>

<div class="col-span-lg-7">
<PhotoPile orientation="landscape"
  items={[
    {
      src: '/media/zines/zines-1.webp',
      alt: "A zine stall on a table in front of a teal wall, with printed zines, a sticker sheet of mandala patterns and a framed grid of pixelated colour blocks. Signs read 'Sacred Geometry' and 'Boshonto Utsab'; titles on display include 'Shaak Paata' and 'Wandering with Purpose'.",
    },
    {
      src: '/media/zines/zines-2.webp',
      alt: "Two folded concertina zines titled 'Rhythm & Rhymes' laid out on a wooden table. Each panel pairs a bold orange, black or purple pattern with a short four-line poem, under titles such as 'Fish n Chips'.",
    },
    {
      src: '/media/zines/zines-3.webp',
      alt: "Mock-up of a photo zine about street dogs. An open spread shows golden-brown dogs in close-up photographs, with covers edged by a strip of colourful prayer flags lying around it.",
    },
    {
      src: '/media/zines/zines-4.webp',
      alt: "A hand holds open a small zine outdoors. The left page has a long-exposure photograph of a stream tumbling over rocks. The right page has a four-line poem in Roman Urdu, beginning 'har mod pe tera', with its English translation: at every turn you will meet a new version of yourself, and only after knowing every 'you' will you truly meet yourself.",
    },
    {
      src: '/media/zines/zines-5.webp',
      alt: "Prasanta smiling and holding up a small purple zine titled 'Wandering with Purpose', in front of a white wall pinned with many other zines and prints.",
    },
  ]}
/>
</div>

<div class="col-span-lg-5" style="display: flex; flex-direction: column; align-self: flex-end;">

I love to make <LinkButton label='zines and prints' url='https://www.instagram.com/p/DOeVJNXjcX-/'  /> of my work. Get in touch if you'd like to buy a print or commission a piece.

Over the years, I have also created a collection of stock photographs that have been viewed more than 11M times. Available for download on <LinkButton label='Unsplash' url='https://unsplash.com/@pkddapacific'  />, <LinkButton label='Pexels' url='https://www.pexels.com/@pkddapacific/'  /> and <LinkButton label='Noun Project' url='https://thenounproject.com/creator/prasanta/?tab=photos'  />.

</div>

</Container>

<Container grid>

<div class="col-span-xl-10">
<figure >

![A close up view of a mask of Goddess Durga being hand-painted](https://images.pexels.com/photos/190589/pexels-photo-190589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

<figcaption>
<em>A close up view of a mask of Goddess Durga being hand-painted.</em> This photo, taken in 2016, has been downloaded nearly 20k times and have been featured on <LinkButton label='CNN'  url='https://sponsorcontent.cnn.com/edition/2018/more-to-incredible-india/' /> and <LinkButton label='Times Travel'  url='https://timesofindia.indiatimes.com/travel/destinations/what-makes-bengals-durga-puja-special/photostory/86833303.cms' />.
</figcaption>
</figure>

</div>
</Container>

<br />
<Container  grid>

<div class="hed col-span-md-5">

## Poetry and Performing arts

</div>
<div class="dek col-span-md-7">

As a storyteller I use different mediums to tell different stories. I write and perform Urdu/Hindi poetry at open mics and literary events, along with occasional standup-comedy at the <LinkButton label='Bakwaas Comedy Club' url='https://www.instagram.com/p/DQXBzvzCGER/'  />, <LinkButton label='Tape-a-Tale' url='https://www.instagram.com/p/DV8ZMFnjAub/'  /> and <LinkButton label='Art-a-Wish' url='https://www.instagram.com/p/DXbxx58CA2F/'  />.

I am also part of <LinkButton label='Dakshinayan UK' url='https://www.londonpuja.co.uk/dakshinayan-uk-2/'  /> -- a London-based music group that performs Rabindranath Tagore's compositions along with other traditional Indian music and dance performances.

Drop me a line if you would like me to perform at your event or hear more about my <LinkButton label='poetry ' url='https://www.instagram.com/muhabbat_ka_sharbat/' /> and <LinkButton label='music ' url='https://www.instagram.com/thebongmusical/' />.

</div>
</Container>

<Container grid>
<div class="col-span-full" style="margin-block-start: var(--space-s);">
<PhotoPile orientation="golden"
  items={[
    {
      src: '/media/shows/shows-1.webp',
      alt: "Performers in colourful traditional attire pose together on stage at Viraasat UK 2026, in front of a banner reading 'Celebrating Heritage, Culture, Community', 6th and 7th June at Chiswick Town Hall. A seated musician with a harmonium sits at the right.",
    },
    {
      src: '/media/shows/shows-2.webp',
      alt: "Three photos of Prasanta performing. Left: sitting on a stool with a microphone under a 'Big Belly Comedy Club' sign. Centre: standing at a microphone in a teal kurta against a brick wall. Right: laughing at a microphone in a red scarf, in front of a red curtain.",
    },
    {
      src: '/media/shows/shows-3.webp',
      alt: "Group photo of about a dozen comedians and organisers, standing and kneeling in a warmly lit bar decorated with festive greenery. Several are smiling; one wears a bowler hat and bow tie, and another gives a thumbs-up.",
    },
  ]}
/>
</div>
</Container>

<BlogFeed/>

<style lang=scss>
  .two-column {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: var(--space-s);

    @media (--md-n-below) {
      display: block;
    }
  }

  .awards {
    margin-block-start: calc(1.5 * var(--space-3xl));
    height: calc(0.2 * 100lvh - 70px);
    display: flex;
    align-items: center;

    @media (max-width: 1024px) {
      height: calc(0.2 * 100lvh + 35px);
    }
  
  }

  .hed {
    text-wrap: balance;
    :global(h2) {
      margin-block-start: 0;
    }
  }

</style>
