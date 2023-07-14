<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import NavLink from './NavLink.svelte';
  import navlinks from '$utils/navlinks';
  import { page } from '$app/stores';
  import resolveLinkTarget from '$utils/resolveLinkTarget';
  import Emblem from './Emblem.svelte';

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

  // $: console.log($page);
</script>

<nav>
  <Container id="sitenav">
    <ul>
      {#each links as link}
        {#if link.url === '/'}
          <li class="nav-item emblem">
            <NavLink
              target="{resolveLinkTarget(link.url, $page.url.hostname)}"
              url="/"
              active="{pageId === '/' && pageHash === ''}"
            >
              <Emblem />
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
  ul {
    display: flex;
    justify-content: space-evenly;
    padding: 0;
  }
  li {
    list-style: none;
    text-transform: uppercase;
    letter-spacing: var(--letter-spaced);
    text-align: center;

    &.emblem {
      margin-top: -5%;
      position: relative;
    }
  }
</style>
