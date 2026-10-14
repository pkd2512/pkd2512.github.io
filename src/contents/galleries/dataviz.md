---
title: Data Visualization Gallery | Prasanta Kumar Dutta

description: Explore a diverse range of projects that highlight the power of visual communication in conveying insights and narratives through data.

image: dataviz-gallery.webp

type: gallery

# Card on the projects page
order: 1
featured: true
intro:
  hed: Data Visualization
src: /media/share-images/dataviz-gallery.webp
categories:
  - Reuters
  - Infographics

published: true
---

<script>
  import Gallery from '$lib/components/custom/galleries/Gallery/index.svelte';
  import { getAllRows } from '$lib/components/custom/galleries/dataviz/data/dataviz-gallery-counts.js';
</script>

<Gallery items={getAllRows()} title="Dataviz gallery" />
