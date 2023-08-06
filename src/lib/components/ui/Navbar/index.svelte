<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import NavLink from '$lib/components/ui/Navlink/index.svelte';
  import navlinks from '$utils/navlinks';
  import { page } from '$app/stores';
  import resolveLinkTarget from '$utils/resolveLinkTarget';
  import Badge from './Badge.svelte';
  import { onMount } from 'svelte';
  import scrollDirection from '$utils/scrollDirection';
  import { inview } from 'svelte-inview';

  let links = navlinks;
  $: pageId = $page.route.id;
  $: pageHash = $page.url.hash;

  // Change blog and contact to external links for other pages
  $: if (pageId !== '/') {
    links = links.map(({ url, name, ...rest }) => {
      let newUrl = url;
      switch (name) {
        case 'Blog':
          newUrl = 'https://medium.com/diarium-da-pacific';

          break;

        default:
          break;
      }

      return { url: newUrl, name, ...rest };
    });
  } else {
    links = links.map(({ url, name, ...rest }) => {
      let newUrl = url;
      switch (name) {
        case 'Blog':
          newUrl = '/#blog';

          break;

        default:
          break;
      }

      return { url: newUrl, name, ...rest };
    });
  }
</script>

<nav
  use:scrollDirection
  use:inview="{{ root: null, rootMargin: '0px', threshold: 1 }}"
  on:inview_change="{(
    /** @type {{ detail: { node: { classList: { toggle: (arg0: string, arg1: boolean) => void; }; }; inView: any; }; }} */ e
  ) => {
    e.detail.node.classList.toggle('pin', !e.detail.inView);
  }}"
>
  <Container width="lg" id="sitenav">
    <ul>
      {#each links as link}
        {#if link.url === '/'}
          <li class="nav-item badge">
            <NavLink
              style="color: var(--white);"
              target="{resolveLinkTarget(link.url, $page.url.hostname)}"
              url="/"
              active="{pageId === '/' && pageHash === ''}"
            >
              <span class="sr-only">Home</span>
              <Badge />
            </NavLink>
          </li>
        {:else}
          <li class="nav-item">
            <NavLink
              style="color: var(--white);"
              target="{resolveLinkTarget(link.url, $page.url.hostname)}"
              url="{link.url}"
              active="{pageId?.includes(link.url) ||
                pageHash?.includes(link.name.toLowerCase())}"
            >
              <span>{link.name}</span>
            </NavLink>
          </li>
        {/if}
      {/each}
    </ul>
  </Container>
</nav>

<style lang="scss">
  @import 'src/lib/styles/mixins/_shadows';
  @import 'src/lib/styles/mixins/_screenReaderOnly';

  .sr-only {
    @include screenReaderOnly;
  }

  nav {
    margin-top: -1px;
    margin-bottom: var(--space-3xl);
    transition: transform 0.3s ease;
    z-index: var(--layer-important);
    background-color: var(--purple-soft);
    position: relative;
  }

  :global {
    nav.pin {
      position: sticky !important;
      top: -1px;

      &.down {
        transform: translateY(-200%);
      }
      &.up {
        transform: translateY(0%);
      }
    }
  }

  ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
  }
  li {
    list-style: none;
    text-transform: uppercase;
    letter-spacing: var(--letter-spaced);
    text-align: center;

    width: 100%;

    span {
      @include text-shadow(var(--purple));
    }

    &.badge {
      margin-bottom: -5.5%;
      position: relative;

      :global {
        a.active {
          border-bottom: none;
          padding-bottom: 0 !important;
        }
      }
    }
  }
</style>
