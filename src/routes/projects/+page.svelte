<script>
  import MetaTags from '$lib/components/ui/MetaTags/index.svelte';
  import ProjectList from '$lib/components/custom/projects/ProjectList/index.svelte';
  import ProjectCard from '$lib/components/custom/projects/ProjectCard/index.svelte';
  import { base, assets } from '$app/paths';
  import ReferralCard from '$lib/components/ui/ReferralCard/index.svelte';
  import Container from '$lib/components/ui/Container/index.svelte';

  export let data;

  // @ts-ignore
  $: contents = data?.contents.filter((d) => d.type === 'project');

  $: featured = contents[0];
</script>

<MetaTags title="Portfolio | Prasanta Kumar Dutta" />

<a class="featured" href="{base}/projects/{featured.slug}">
  <ProjectCard info="{featured}" />
</a>

<ProjectList posts="{contents.slice(1, 5)}" />

<Container width="md" style="text-align: center;">
  <ReferralCard
    url="https://muckrack.com/pkddapacific"
    image="{assets}/media/muckrack.jpg"
    title="Muckrack portfolio"
    description="Visual journalism and data graphics projects"
  />
</Container>

<ProjectList posts="{contents.slice(5)}" />

<Container width="md" style="text-align: center;">
  <ReferralCard
    url="https://www.behance.net/pkddapacific"
    image="{assets}/media/behance.jpg"
    title="Behance portfolio"
    description="More design projects"
  />
</Container>

<style lang="scss">
  .featured {
    text-decoration: none;
    :global(.card) {
      width: 100%;
      max-height: 90lvh;
      @media (max-width: 600px) {
        max-height: 80lvh;
      }
    }
  }
</style>
