---
# Metatags
title: Data Visualization Gallery | Prasanta Kumar Dutta

description: A collection of charts, maps, and illustrations from my work at Reuters and design school. 

keywords: Data Journalist, Graphics Journalist, Reuters Graphics Journalist, Data Visualisation Developer, Data Visualization Developer, Narrative Cartographer, User Interface Designer, User Experience Designer, Communication Designer, Data Storyteller, Information Designer, Graphic Designer, Art Director, User centered design, UX, UI, Data Artist, Web Designer, Web Developer, Front-end Web Developer, Photographer, Traveler, Creative writer, Electronics and Communication Engineer, National Institute of Design, National Institute of Technology Durgapur, Prasanta, PrasantaKrDutta, Prasanta Kumar Dutta, Prasanta KrDutta, pkddapacific, pkd.dapacific, pkd_da_pacific, daPacific.

image: dataviz-gallery.webp
type: project
date: '2026-06-05'
published: true

# categories:
#   - NID
#   - Photojournalism
#   - Graphic Design


links: 
  - type: doc
    url: projects/dataviz-gallery/
    label: 🗒️ Read more

intro:

  hed: Dataviz gallery

  dek: "A collection of charts, maps, and illustrations from my work at Reuters and design school. Explore a diverse range of projects that highlight the power of visual communication in conveying insights and narratives through data."

  img: projects/dataviz-gallery/hero.webp



  quote: “Visualization gives you answers to questions you didn't know you had” — Ben Shneiderman, Professor of Computer Science, University of Maryland
---


<!-- Components -->
<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import Gallery from '$lib/components/custom/projects/DatavizGallery/index.svelte';
</script>

<Gallery groupers="{[
  { key: 'category', label: 'Topic', multi: true },
  { key: 'graphic_type', label: 'Type', multi: false },
]}" />
