<script>
  import NavDesktop from './NavDesktop.svelte';
  import NavMobile from './NavMobile.svelte';

  // @ts-ignore
  import navlinks from '/src/contents/data/navlinks.csv';
  import { page } from '$app/state';

  let pageId = $derived(page.route.id);

  // Change blog and contact to external links for other pages
  let links = $derived(
    pageId !== '/'
      ? // @ts-ignore
        navlinks.map(({ url, name, ...rest }) => {
          let newUrl = url;
          switch (name) {
            case 'Blog':
              newUrl = '/blog';
              break;
            default:
              break;
          }
          return { url: newUrl, name, ...rest };
        })
      : // @ts-ignore
        navlinks.map(({ url, name, ...rest }) => {
          let newUrl = url;
          switch (name) {
            case 'Blog':
              newUrl = '/#blog';
              break;
            default:
              break;
          }
          return { url: newUrl, name, ...rest };
        })
  );
</script>

<header>
  <div class="nav-mobile">
    <NavMobile {links} />
  </div>
  <div class="nav-desktop">
    <NavDesktop {links} />
  </div>
</header>

<style lang="scss">
  header {
    display: contents;
  }

  .nav-desktop {
    display: contents;
    @media ('(--md-n-below)') {
      display: none;
    }
  }

  .nav-mobile {
    display: contents;
    @media ('(--md-n-above)') {
      display: none;
    }
  }
</style>
