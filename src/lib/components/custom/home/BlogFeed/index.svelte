<script>
  import { getContext } from 'svelte';
  import { browser } from '$app/environment';
  import Container from '$lib/components/ui/Container/index.svelte';
  import ReferralCard from '$lib/components/ui/ReferralCard/index.svelte';
  import Icon from '@iconify/svelte';
  import getBlogFeed from '$utils/getBlogFeed';

  let articles = $state(getContext('blogFeed') || []);
  let cardsEl = $state(null);
  let paused = $state(false);
  const MEDIA_BREAKPOINT = '768px';
  let isMobile = $state(
    browser && window.matchMedia(`(width < ${MEDIA_BREAKPOINT})`).matches
  );
  let articlesToShow = $derived(articles.slice(0, 3));
  let loopArticles = $derived(
    articlesToShow.length
      ? [articlesToShow.at(-1), ...articlesToShow, ...articlesToShow]
      : []
  );

  $effect(() => {
    if (!browser) return;
    const mq = window.matchMedia(`(width < ${MEDIA_BREAKPOINT})`);
    isMobile = mq.matches;
    const handler = (e) => (isMobile = e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });

  $effect(() => {
    if (!cardsEl || !loopArticles.length || isMobile) return;
    const target = cardsEl.children[1];
    if (!target) return;
    const cardWidth = target.clientWidth;
    const gap = parseFloat(getComputedStyle(cardsEl).gap) || 0;
    cardsEl.scrollTo({ left: cardWidth + gap, behavior: 'instant' });
  });

  function scrollCards(dir) {
    if (!cardsEl) return;
    const el = cardsEl;
    const cardWidth = el.children[0]?.clientWidth ?? 0;
    const gap = parseFloat(getComputedStyle(el).gap) || 0;
    el.scrollBy({ left: (cardWidth + gap) * dir, behavior: 'smooth' });
  }

  $effect(() => {
    if (!browser || isMobile || !cardsEl) return;
    const el = cardsEl;
    const cardWidth = el.children[0]?.clientWidth ?? 0;
    const gap = parseFloat(getComputedStyle(el).gap) || 0;
    const step = cardWidth + gap;
    let interval = setInterval(() => {
      if (paused) return;
      let maxScroll = el.scrollWidth / 2;
      if (el.scrollLeft >= maxScroll) {
        el.scrollTo({ left: el.scrollLeft - maxScroll, behavior: 'instant' });
      }
      el.scrollBy({ left: step, behavior: 'smooth' });
    }, 3000);

    return () => clearInterval(interval);
  });
</script>

<Container id="blog" width={isMobile ? 'fluid' : 'lg'}>
  <h2 class="title">Latest from the blog</h2>
  <div class="cards-wrap">
    <button
      class="nav prev"
      onclick={() => scrollCards(-1)}
      aria-label="Previous"
    >
      <Icon
        icon="pajamas:chevron-left"
        height="var(--font-size-1)"
        style="color: var(--purple-soft)"
      />
    </button>
    <div
      class="cards"
      bind:this={cardsEl}
      onmouseenter={() => (paused = true)}
      onmouseleave={() => (paused = false)}
    >
      {#each isMobile ? articlesToShow : loopArticles as article}
        {@const start = article.description.indexOf('<h4>') + 4}
        {@const end = article.description.indexOf('</h4>')}
        {@const thumbnail = article.description
          .toString()
          .match(/<img[^>]+src="([^">]+)"/)[1]}
        <ReferralCard
          url={article.link}
          image={thumbnail ||
            'https://cdn-images-1.medium.com/max/357/1*O7E1vMVWGStXv8TLKqR3Gw@2x.png'}
          title={article.title}
          description={article.description.slice(
            start,
            end - start < 120 ? end : start + 120
          )}
        />
      {/each}
    </div>
    <button class="nav next" onclick={() => scrollCards(1)} aria-label="Next">
      <Icon
        icon="pajamas:chevron-right"
        height="var(--font-size-1)"
        style="color: var(--purple-soft)"
      />
    </button>
  </div>
</Container>

<style lang="scss">
  @use 'src/lib/styles/mixins/sectionTitle' as *;
  :global {
    #blog {
      margin-block: var(--space-2xl-3xl);
      margin-inline: auto;
      overflow-x: hidden;
    }
  }

  .title {
    @include sectionTitle;
  }

  .cards-wrap {
    position: relative;

    .nav {
      position: absolute;
      top: 50%;
      translate: 0 -50%;
      z-index: 2;
      border: none;
      background: none;
      cursor: pointer;
      font-size: var(--font-size-5);
      color: var(--purple);
      height: 100%;
      padding-inline: var(--space-s);

      :global(svg) {
        background: var(--white-soft);
        border-radius: 50%;
      }

      @media (--md-n-below) {
        display: none;
      }
    }
    .prev {
      left: calc(-1 * var(--space-m));
      padding-inline-end: var(--space-l);
    }
    .next {
      right: calc(-1 * var(--space-m));
      padding-inline-start: var(--space-l);
    }
  }

  .cards {
    min-width: 300px;
    padding-inline: var(--space-s);
    display: flex;
    flex-flow: row;
    gap: var(--space-m);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      #000 10%,
      #000 90%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      #000 15%,
      #000 90%,
      transparent 100%
    );
    :global(> *) {
      scroll-snap-align: center;
    }
    @media (--md-n-below) {
      mask-image: none;
      -webkit-mask-image: none;
    }
    @media (--sm-n-below) {
      gap: var(--space-xs);
    }
  }
</style>
