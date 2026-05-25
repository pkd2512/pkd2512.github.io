<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import Marquee from 'svelte-fast-marquee';
  import { asset } from '$app/paths';
  // @ts-ignore
  import awards from '$contents/data/awards.csv';

  let play = $state(true);

  /**
   * @type {number}
   */
  let windowWidth = $state();

  let slice = $derived(awards.length / 2);
</script>

<svelte:window bind:innerWidth={windowWidth} />

<section id="awards">
  <Container width="fluid">
    {#if windowWidth <= 1024}
      <div class="mobile">
        <Marquee pauseOnHover={true} speed={15} {play}>
          {#each awards.slice(0, slice) as item}
            <a target="" id={item.id} href={item.archive_url || item.url}
              ><img
                src={asset('/media/awards/' + item.img)}
                alt={item.alt}
              /></a
            >
          {/each}
        </Marquee>
        <Marquee pauseOnHover={true} speed={15} {play} direction="right">
          {#each awards.slice(slice, slice * 2) as item}
            <a target="" id={item.id} href={item.archive_url || item.url}
              ><img
                src={asset('/media/awards/' + item.img)}
                alt={item.alt}
              /></a
            >
          {/each}
        </Marquee>
      </div>
    {:else}
      <Marquee pauseOnHover={true} speed={45} {play}>
        {#each awards as item}
          <a target="" id={item.id} href={item.archive_url || item.url}
            ><img src={asset('/media/awards/' + item.img)} alt={item.alt} /></a
          >
        {/each}
      </Marquee>
    {/if}
  </Container>
</section>

<style lang="scss">
  img {
    height: 75px;
    width: auto;
    margin: var(--space-l);

    @media (--md-n-below) {
      height: 50px;
      margin: var(--space-s);
    }
  }

  a {
    filter: grayscale(0.9);

    &:hover {
      filter: none;
    }
  }

  #awards {
    mix-blend-mode: multiply;
    margin-bottom: var(--space-xl-2xl);

    :global(.marquee) {
      justify-content: space-around;
    }
  }

  .mobile {
    display: flex;
    flex-direction: column;
  }
</style>
