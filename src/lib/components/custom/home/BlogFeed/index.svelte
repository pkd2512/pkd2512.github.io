<script>
  import getBlogFeed from '$utils/getBlogFeed';
  import { onMount } from 'svelte';
  import Container from '$lib/components/ui/Container/index.svelte';
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
  import ReferralCard from '$lib/components/ui/ReferralCard/index.svelte';
  import Icon from '@iconify/svelte';

  /**
   * @type {any[]}
   */
  let articles = [];

  onMount(async () => {
    // @ts-ignore
    articles = await getBlogFeed();
  });
</script>

<Container id="blog" width="md">
  <h2 class="title">Latest from the blog</h2>
  <div class="cards">
    {#each articles?.slice(0, 3) as article}
      {@const start = article.description.indexOf('<h4>') + 4}
      {@const end = article.description.indexOf('</h4>')}
      {@const thumbnail = article.description
        .toString()
        .match(/<img[^>]+src="([^">]+)"/)[1]}
      <ReferralCard
        url="{article.link}"
        image="{thumbnail ||
          'https://cdn-images-1.medium.com/max/357/1*O7E1vMVWGStXv8TLKqR3Gw@2x.png'}"
        title="{article.title}"
        description="{article.description.slice(
          start,
          end - start < 120 ? end : start + 120
        )}"
      />
    {/each}
  </div>
  <div class="bloglink">
    <div class="icon">
      <Icon icon="zondicons:news-paper" />
    </div>
    <LinkButton solid url="/blog" target="" label="Show all posts" />
  </div>
</Container>

<style lang="scss">
  @import 'src/lib/styles/mixins/sectionTitle';
  :global {
    #blog {
      margin-block: var(--space-2xl-3xl);
      margin-inline: auto;
    }
  }

  .title {
    @include sectionTitle;
  }

  .cards {
    display: flex;
    flex-flow: column;
  }

  .bloglink {
    text-align: center;
    .icon {
      margin-block: var(--space-2xs);
      font-size: var(--font-size-1);
      :global {
        path {
          fill: var(--purple);
        }
      }
    }
  }
</style>
