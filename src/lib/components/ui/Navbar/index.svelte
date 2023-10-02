<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import NavLink from '$lib/components/ui/Navlink/index.svelte';
  import { page } from '$app/stores';
  import resolveLinkTarget from '$utils/resolveLinkTarget';
  import Badge from './Badge.svelte';

  import NavMobile from './NavMobile.svelte';

  import scrollDirection from '$utils/scrollDirection';
  import { inview } from 'svelte-inview';

  // @ts-ignore
  import navlinks from '/src/contents/data/navlinks.csv';

  let links = navlinks;
  $: pageId = $page.route.id;
  $: pageHash = $page.url.hash;

  // Change blog and contact to external links for other pages
  $: if (pageId !== '/') {
    // @ts-ignore
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
    // @ts-ignore
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

<header>
  <!-- Mobile nav -->
  <NavMobile links="{links}" />

  <!-- Desktop nav -->
  <nav
    id="sitenav"
    class="up"
    use:scrollDirection
    use:inview="{{ root: null, threshold: 1 }}"
    on:inview_change="{(
      /** @type {{ detail: { node: { classList: { toggle: (arg0: string, arg1: boolean) => void; }; }; inView: any; }; }} */ e
    ) => {
      window.scrollY > -1 &&
        e.detail.node.classList.toggle('pin', !e.detail.inView);
    }}"
  >
    <Container width="lg">
      <ul>
        {#each links as link (link.name)}
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
</header>

<style lang="scss">
  @import 'src/lib/styles/mixins/_shadows';
  @import 'src/lib/styles/mixins/_screenReaderOnly';

  header {
    display: contents;

    @media (max-width: 600px) {
      :global(#sitenav) {
        display: none;
      }
      :global(#sitenav-mobile) {
        display: flex;
      }
    }
    @media (min-width: 600px) {
      :global(#sitenav) {
        display: block;
      }
      :global(#sitenav-mobile) {
        display: none;
      }
    }
  }

  .sr-only {
    @include screenReaderOnly;
  }

  nav {
    margin-top: -1px;
    margin-bottom: var(--space-3xl);
    transition: transform 0.35s ease, max-width 0.15s ease;
    z-index: var(--layer-important);
    background-color: var(--purple-soft);
    position: relative;
    margin-inline: auto;
    max-width: 100%;
  }

  header {
    :global(nav.pin) {
      position: sticky !important;
      top: -1px;
      left: -50%;

      max-width: var(--md);
      box-shadow: var(--shadow-3), var(--shadow-5);

      @media (min-width: 600px) {
        border-radius: 15rem;
      }
    }

    :global(nav.pin.down:not(.open)) {
      transform: translate3d(0, -250%, 0);
    }

    :global(nav.pin.up) {
      transform: translate3d(0, 0, 0);
    }
  }

  .nav-item:not(.badge) {
    :global(a) {
      padding: var(--space-s) var(--space-3xs);
    }

    :global(a::after) {
      content: '';
      width: 0%;
      height: 0rem;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: block;
      border-radius: 1rem;
      margin-top: var(--space-xs);
      background-color: var(--purple);
      transition: all 0.35s ease;
    }

    :global(a.active::after) {
      width: 100%;
      height: 0.3rem;
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
    letter-spacing: var(--letter-spaced-more);
    text-align: center;

    width: 100%;

    span {
      @include text-shadow(var(--purple));
    }

    &.badge {
      margin-bottom: -6rem;
      position: relative;

      :global(a.active) {
        border-bottom: none;
        padding-bottom: 0 !important;
      }
    }
  }
</style>
