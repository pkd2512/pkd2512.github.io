<script>
  import MetaTags from '$lib/components/ui/MetaTags/index.svelte';
  import ProjectList from '$lib/components/custom/projects/ProjectList/index.svelte';
  import ParallaxHero from '$lib/components/ui/ParallaxHero/index.svelte';
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
  import { assets } from '$app/paths';
  import ReferralCard from '$lib/components/ui/ReferralCard/index.svelte';
  import Container from '$lib/components/ui/Container/index.svelte';

  export let data;

  // @ts-ignore
  $: contents = data?.contents.filter((d) => d.type === 'project');

  $: featured = contents[1];
</script>

<MetaTags title="Portfolio | Prasanta Kumar Dutta" />

<ParallaxHero img="{assets}/media/{featured.intro.img}">
  <Container width="sm">
    <div class="anno">
      <!-- <p class="hed">{featured.intro.hed}</p> -->
      <p class="dek">{featured.intro.dek}</p>

      {#if featured.links}
        <div class="links">
          {#each featured.links as link}
            <div class="link">
              <LinkButton
                url="{link.url}"
                label="{link.label}"
                target="{link.target || ''}"
              />
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </Container>
</ParallaxHero>

<section id="news-graphics">
  <ProjectList title="News Graphics" posts="{contents}" />
</section>

<div style="text-align:center;">
  <ReferralCard
    url="https://muckrack.com/pkddapacific"
    image="/media/muckrack.jpg"
    title="Muckrack portfolio"
    description="Visual journalism and data graphics projects"
  />
</div>

<section id="ux-ui-design">
  <ProjectList title="UX-UI Design" posts="{contents}" />
</section>

<div style="text-align:center;">
  <ReferralCard
    url="https://www.behance.net/pkddapacific"
    image="/media/behance.jpg"
    title="Behance portfolio"
    description="More design projects"
  />
</div>

<style lang="scss">
  .anno {
    background-color: var(--white);
    padding: var(--space-s-m) var(--space-m-l);
    margin-bottom: var(--space-l);
    border-radius: 0.25rem;
    box-shadow: var(--shadow-2);

    .hed {
      font-size: var(--font-size-1);
      color: var(--black-soft);
      font-weight: var(--font-weight-regular);
      font-family: var(--font-display);
      line-height: var(--line-height-medium);
    }

    .links {
      margin-top: var(--space-s-m);
      display: flex;
      justify-content: end;
      width: 100%;

      .link {
        width: 10rem;
        text-align: end;
      }
    }
  }
</style>
