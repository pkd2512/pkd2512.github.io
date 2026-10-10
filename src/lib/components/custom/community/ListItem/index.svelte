<script>
  import { marked } from 'marked';
  import { markedSmartypants } from 'marked-smartypants';
  import Icon from '@iconify/svelte';
  import NavLink from '$lib/components/ui/Navlink/index.svelte';
  import { timeFormat } from 'd3-time-format';

  marked.use(markedSmartypants());

  let { item, upcoming = false, link = true } = $props();

  // Upcoming talks get the day too. Parsed as local time so the day can't slip
  // back by one in timezones behind UTC.
  const formatDate = (date) => {
    if (!date) return;
    return upcoming
      ? timeFormat('%-d %b %Y')(new Date(`${date.trim()}T00:00`))
      : timeFormat('%b %Y')(new Date(date));
  };
</script>

<li class="list-item" class:upcoming>
  <span class="topic">
    <strong
      >{@html marked.parse(item.place)}
      {#if upcoming}<span class="badge">Upcoming</span>{/if}
      {#if link && (item.archive_url || item.url)}
        <NavLink target="" url={item.archive_url || item.url}
          ><Icon
            width="22"
            height="22"
            icon="iconamoon:link-external-duotone"
          /></NavLink
        >
      {/if}</strong
    >
  </span>

  <span class="place">
    <span class="date">
      {item.date ? formatDate(item.date) + ' • ' : ''}
    </span>
    {@html marked.parse(item.topic)}
  </span>
</li>

<style lang="scss">
  li {
    list-style: none;
    margin-block-end: var(--space-m);
    break-inside: avoid;

    @media (--md-n-below) {
      margin-block-end: var(--space-s);
    }
  }

  .date {
    color: var(--gray);
    font-size: var(--font-size--1);
    font-family: var(--font-display);
    font-weight: var(--font-weight-medium);
    display: inline;
    white-space: nowrap;
  }

  .upcoming .date {
    color: var(--purple-soft);
    font-weight: var(--font-weight-bold);
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-3xs);
    margin-inline: 0 var(--space-3xs);
    padding: var(--space-3xs) var(--space-2xs);
    border-radius: 0.125rem;
    background: var(--purple-soft);
    color: var(--white);
    font-family: var(--font-display);
    font-size: var(--font-size--2);
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spaced-more);
    line-height: 1;
    text-transform: uppercase;
    vertical-align: middle;

    &::before {
      content: '';
      width: var(--space-3xs);
      height: var(--space-3xs);
      border-radius: 50%;
      background: currentColor;
      animation: pulse 2s infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      &::before {
        animation: none;
      }
    }
  }

  @keyframes pulse {
    50% {
      opacity: 0.3;
    }
  }

  .topic {
    display: flex;
    align-items: baseline;
    justify-content: space-between;

    :global(p),
    :global(a) {
      display: inline-flex;
      line-height: var(--line-height-medium);
    }
  }

  .place {
    display: inline;
    :global(p),
    :global(a) {
      display: inline;
    }
  }

  .list-item {
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
