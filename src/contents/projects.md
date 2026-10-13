---
title: Portfolio | Prasanta Kumar Dutta

description: Award-winning portfolio of data visualization, information design, and visual journalism projects by Prasanta Kumar Dutta, an Information Experience Designer at Reuters.

image: share.webp

type: collection

published: true
---

<script>
  import ProjectList from '$lib/components/custom/projects/ProjectList/index.svelte';
  import ProjectCard from '$lib/components/custom/projects/ProjectCard/index.svelte';
  import { asset, resolve } from '$app/paths';
  import ReferralCard from '$lib/components/ui/ReferralCard/index.svelte';
  import Container from '$lib/components/ui/Container/index.svelte';
  import { page } from '$app/state';

  let contents = page.data.contents
    .filter((d) => d.type === 'project')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const galleryData = page.data.contents
    .filter((d) => d.type === 'gallery')
    .sort((a, b) => a.order - b.order)
    .map((g) => ({
      ...g,
      href: resolve('/gallery/[gallery=gallery]', { gallery: g.slug }),
    }));

  const featured = galleryData.filter((g) => g.featured);
  const galleries = galleryData.filter((g) => !g.featured);
</script>

<!--
  Case studies: every published project, newest first.
  Galleries are the pages in src/contents/galleries/, each at /gallery/[slug];
  the card reads their front matter, and the featured one gets the large hero card. Swap its still for one with no
  baked-in text.
  Do not put // comments inside the script above: mdsvex crashes on them.
-->

{#each featured as gallery}
  <a class="featured" href={gallery.href}>
    <ProjectCard info={gallery} />
  </a>
{/each}

<ProjectList posts={galleries} />

<h2 class="label">Case studies</h2>
<ProjectList posts={contents} />

<h2 class="label">Elsewhere</h2>
<Container width="xl" style="display:flex; flex-wrap:wrap; justify-content:center; gap:var(--space-s);">
  <ReferralCard
    url="https://muckrack.com/pkddapacific"
    image={asset('/media/muckrack.webp')}
    title="Muckrack portfolio"
    description="Visual journalism and data graphics projects"
  />
  <ReferralCard
    url="https://www.behance.net/pkddapacific"
    image={asset('/media/behance.webp')}
    title="Behance portfolio"
    description="More design projects"
  />
</Container>

<style lang="scss">
  @use 'lib/styles/mixins' as m;

  // Slim section labels: tight to the grid so they read as pauses in one
  // gallery, not breaks between separate sections.
  .label {
    @include m.sectionTitle;
    margin-block: var(--space-xl) var(--space-s);
  }

  .featured {
    text-decoration: none;
    display: block;
    // Same step the grid uses between cards, so the hero reads as the first
    // row of one continuous grid rather than a separate banner.
    margin-block-end: var(--project-gap);

    :global(.card) {
      width: 100%;
      max-height: 90lvh;
      @media (max-width: 600px) {
        max-height: 80lvh;
      }
    }

    :global(.card .container-sm) {
      max-height: 90lvh;
      @media (max-width: 600px) {
        max-height: 80lvh;
      }
    }
  }
</style>
