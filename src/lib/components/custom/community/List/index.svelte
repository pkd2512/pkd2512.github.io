<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import { marked } from 'marked';
  import { markedSmartypants } from 'marked-smartypants';
  import Icon from '@iconify/svelte';
  import NavLink from '$lib/components/ui/Navlink/index.svelte';
  import { timeFormat } from 'd3-time-format';
  import slugify from '$utils/slugify';

  marked.use(markedSmartypants());

  /**
   * @param content - List of items
   * @type {any[]}
   */
  export let content = [];

  /**
   * @param title - Title of the list
   */
  export let title = '';

  const formatDate = (/** @type {string | number | Date} */ date) => {
    if (!date) return;
    const d = new Date(date);
    const format = timeFormat('%b %Y');

    return format(d);
  };

  // @ts-ignore
  content.sort((a, b) => new Date(b.date) - new Date(a.date));
</script>

{#if content.length > 0}
  <Container width="md">
    <div class="list-wrapper">
      <h2 id="{slugify(title)}">{title}</h2>
      <ul>
        {#each content as item}
          <li class="list-item">
            <span class="topic">
              <strong>{@html marked.parse(item.topic)}</strong>

              <span style="white-space: nowrap;">
                <span class="date">
                  {item.date ? '• ' + formatDate(item.date) : ''}
                </span>

                {#if item.link}
                  <NavLink target="" url="{item.link}"
                    ><Icon
                      width="22"
                      height="22"
                      icon="iconamoon:link-external-duotone"
                    /></NavLink
                  >
                {/if}
              </span>
            </span>

            <span class="place">
              {@html marked.parse(item.place)}
            </span>
          </li>
        {/each}
      </ul>
    </div>
  </Container>
{/if}

<style lang="scss">
  @import 'src/lib/styles/mixins/sectionTitle';
  h2 {
    @include sectionTitle;
  }

  ul {
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  li {
    list-style: none;
    margin-block: var(--space-2xs);
  }

  .date {
    color: var(--gray);
    font-size: var(--font-size--1);
    font-family: var(--font-display);
    font-weight: var(--font-weight-medium);
    display: inline;
    white-space: nowrap;
  }

  .sep {
    color: var(--gray);
  }

  .topic {
    :global(p),
    :global(a) {
      display: inline;
    }
  }

  .list-wrapper .list-item {
    :global(strong p) {
      color: var(--black-soft);
      font-family: var(--font-sans);
      font-weight: var(--font-weight-medium);
    }

    :global(a svg) {
      transform: translateY(0.35rem);
      transition: all 0.35s ease;
    }
    :global(a:hover svg) {
      transform: translate(0.15rem, 0.2rem);
    }

    :global(*) {
      margin-block: 0;
    }
  }
</style>
