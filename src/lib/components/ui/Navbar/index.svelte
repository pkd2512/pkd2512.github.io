<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import NavLink from './NavLink.svelte';
  import navlinks from '$utils/navlinks';
  import { page } from '$app/stores';
  import resolveLinkTarget from '$utils/resolveLinkTarget';
  import Badge from './Badge.svelte';

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

<nav>
  <Container width="lg" id="sitenav">
    <ul>
      {#each links as link}
        {#if link.url === '/'}
          <li class="nav-item badge">
            <NavLink
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
    @include sr-only;
  }

  nav {
    margin-top: -1px;
    margin-bottom: 5rem;
    position: sticky;
    top: 0;
    background-color: var(--purple-soft);
    background-image: url('https://www.transparenttextures.com/patterns/subtle-dots.png');
    background-blend-mode: difference;
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

    span {
      @include text-shadow(var(--purple));
    }

    &.badge {
      margin-bottom: -5.5%;
      position: relative;
    }
  }
</style>
