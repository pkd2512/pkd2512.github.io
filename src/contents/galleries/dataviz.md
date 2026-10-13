---
title: Data Visualization Gallery | Prasanta Kumar Dutta

description: A collection of charts, maps, and illustrations from my work at Reuters and design school.

image: dataviz-gallery.webp

type: collection

published: true
---

<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import Gallery from '$lib/components/custom/projects/DatavizGallery/index.svelte';
</script>

<Container grid style="margin-block-start:calc(2.5 * var(--space-3xl))">
<div class="hed col-span-md-5">

## Dataviz gallery

</div>
<div class="dek col-span-md-7">

A collection of charts, maps, and illustrations from my work at Reuters and design school. Explore a diverse range of projects that highlight the power of visual communication in conveying insights and narratives through data.

</div>
</Container>

<Gallery groupers="{[
  { key: 'category', label: 'Topic', multi: true },
  { key: 'graphic_type', label: 'Type', multi: false },
]}" />
