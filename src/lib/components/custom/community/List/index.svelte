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
          <li
            class="list-item"
            style="--year:'{formatDate(item.date) || '🗒️'} &bullet; '"
          >
            <strong>{@html marked.parse(item.topic)}</strong>
            <span class="sep">|</span>
            {@html marked.parse(item.place)}

            {#if item.link}
              <NavLink target="_blank" url="{item.link}"
                ><Icon
                  width="22"
                  height="22"
                  icon="iconamoon:link-external-duotone"
                /></NavLink
              >
            {/if}
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
    padding-left: calc(var(--space-2xl) + 0.5rem);
    li {
      margin-block: var(--space-s);
      &::marker {
        color: var(--gray);
        font-size: var(--font-size--1);
        font-family: var(--font-display);
        font-weight: var(--font-weight-medium);
        content: var(--year);
      }
    }
  }

  .sep {
    color: var(--gray);
  }

  .list-wrapper .list-item {
    :global {
      strong p {
        font-weight: var(--font-weight-medium) !important;
      }

      svg {
        transform: translateY(0.35rem);
      }

      * {
        margin-block: 0;
        display: inline;
      }
    }
  }
</style>
