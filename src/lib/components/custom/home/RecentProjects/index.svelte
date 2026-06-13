<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import Container from '$lib/components/ui/Container/index.svelte';
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
  import Icon from '@iconify/svelte';
  import { page } from '$app/state';
  import { asset } from '$app/paths';
  import resolveLinkUrl from '$utils/resolveLinkUrl';

  gsap.registerPlugin(ScrollTrigger);

  let data = $derived(
    page.data.contents
      .filter((/** @type {{ type: string; }} */ d) => d.type === 'project')
      .slice(0, 3)
      // @ts-ignore
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  );

  let wrapper;
  let cards = [];

  onMount(() => {
    if (!wrapper || cards.length < 2) return;

    const n = cards.length;

    gsap.set(wrapper, { perspective: 1200 });

    cards.forEach((card, i) => {
      card.style.zIndex = i;
    });

    gsap.set(cards[0], {
      y: 90,
      x: 32,
      rotation: 3.5,
      scale: 0.75,
      rotateY: 7,
    });
    gsap.set(cards[1], {
      y: 45,
      x: 16,
      rotation: -2,
      scale: 0.86,
      rotateY: -3,
    });
    gsap.set(cards[n - 1], {
      y: 0,
      x: 0,
      rotation: 0,
      scale: 1,
      rotateY: 0,
      zIndex: n - 1,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        pin: true,
        start: 'top top',
        end: `+=${n * 100}%`,
        scrub: 1,
        invalidateOnRefresh: true,
      },
      defaults: { ease: 'none' },
    });

    let gap = { t: 0 };

    tl.to(gap, { t: 1 });

    for (let i = n - 1; i > 0; i--) {
      tl.to(cards[i], {
        x: 320,
        y: -120,
        rotation: 14,
        rotateY: 0,
        scale: 0.85,
        opacity: 1,
      });
      tl.to(
        cards[i - 1],
        i === n - 1
          ? { x: 20, y: 32, rotation: -1, scale: 0.95, rotateY: -3, opacity: 1 }
          : { x: 10, y: 16, rotation: -0.5, scale: 1, rotateY: 0, opacity: 1 },
        '<'
      );
      tl.set(cards[i], { zIndex: -1 });
      tl.to(cards[i], {
        x: i === n - 1 ? 32 : 16,
        y: i === n - 1 ? 90 : 45,
        rotation: i === n - 1 ? 3.5 : -2,
        rotateY: i === n - 1 ? 7 : -3,
        scale: i === n - 1 ? 0.75 : 0.86,
        opacity: 1,
      });

      if (i === n - 1) {
        tl.to(gap, { t: 1 });
        tl.to(gap, { t: 1 });
      } else {
        tl.to(gap, { t: 1 });
      }
    }

    tl.to(cards[0], {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1.01,
      rotateY: 0,
      opacity: 1,
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  });
</script>

<svelte:head>
  {#each data as d}
    <link rel="preload" as="image" href={asset('/media/' + d.intro.img)} />
  {/each}
</svelte:head>

<section id="recent-projects">
  <Container grid>
    <div class="cards-wrapper col-span-12" bind:this={wrapper}>
      {#each data as project, i}
        <div
          class="card"
          bind:this={cards[i]}
          style="background-image:url({asset('/media/' + project.intro.img)})"
        >
          <div class="card-body">
            <Container grid>
              <div class="anno col-start-7 col-span-6">
                <p class="hed">{project.intro.hed}</p>
                <p class="dek">{project.description}</p>

                {#if project.links}
                  <div class="links">
                    {#each project.links as link}
                      <div class="link">
                        <LinkButton
                          url={resolveLinkUrl(link.url)}
                          label={link.label}
                          target=""
                        />
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            </Container>
          </div>
        </div>
      {/each}
    </div>
  </Container>
  <div id="all-projects">
    <div class="icon">
      <Icon icon="icon-park-solid:more-app" />
    </div>

    <LinkButton solid={true} url="projects/" label="Show more work" />
  </div>
</section>

<style lang="scss">
  #recent-projects {
    margin-bottom: var(--space-2xl-3xl);
    padding-block-start: var(--space-3xl);
  }

  .cards-wrapper {
    position: relative;
    height: 100lvh;
    display: grid;
    place-items: center;
  }

  .card {
    grid-area: 1 / 1;
    width: 100%;
    max-width: var(--grid-max-width);
    height: min(75vh, 45rem);
    border-radius: 0.75rem;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.45) 0%,
        transparent 50%
      );
      pointer-events: none;
    }
  }

  .card-body {
    position: relative;
    z-index: 1;
    padding: var(--space-m-l);
  }

  .anno {
    background-color: var(--white);
    padding: var(--space-s-m) var(--space-m-l);
    border-radius: 0.5rem;
    box-shadow: var(--shadow-2);
    display: flex;
    flex-flow: column;

    @media (--md-n-below) {
      grid-column: 1 / -1;
    }
  }

  .hed {
    font-size: var(--font-size-1);
    color: var(--black-soft);
    font-weight: var(--font-weight-light);
    font-family: var(--font-sans);
    line-height: var(--line-height-medium);
    margin-bottom: var(--space-2xs);
  }

  .dek {
    margin: 0;
    font-style: italic;
  }

  .links {
    margin-top: var(--space-xs);
    display: flex;
    justify-content: end;
    width: 100%;

    .link {
      width: 10rem;
      text-align: end;
    }
  }

  #all-projects {
    width: 100%;
    text-align: center;
    margin-block: var(--space-s);

    .icon {
      margin-block: var(--space-2xs);
      font-size: var(--font-size-1);
      :global(path) {
        fill: var(--purple);
      }
    }
  }
</style>
