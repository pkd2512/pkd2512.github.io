<script>
  import NavLink from './NavLink.svelte';
  import { page } from '$app/stores';

  let links = [
    {
      name: 'Projects',
      url: '/projects',
      class: '',
    },
    {
      name: 'Blog',
      url: '/#blog',
      class: '',
    },
    {
      name: 'Resources',
      url: '/resources',
      class: '',
    },
    {
      name: 'Home',
      url: '/',
      class: 'home',
    },
    {
      name: 'About',
      url: '/about',
      class: '',
    },
    {
      name: 'Talks',
      url: '/talks',
      class: '',
    },
    {
      name: 'Contact',
      url: '/#contact',
      class: '',
    },
  ];

  $: pageId = $page.route.id;
  $: pageHash = $page.url.hash;

  $: console.log($page, links);

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
  <div class="navbar">
    <ul>
      {#each links as link}
        {#if link.url === '/'}
          <li class="nav-item">
            <NavLink href="/" active="{pageId === '/' && pageHash === ''}">
              <span>this is home</span>
            </NavLink>
          </li>
        {:else}
          <li class="nav-item">
            <NavLink
              href="{link.url}"
              active="{pageId?.includes(link.url) ||
                pageHash?.includes(link.name.toLowerCase())}"
            >
              <span>{link.name}</span>
            </NavLink>
          </li>
        {/if}
      {/each}
    </ul>
  </div>
</nav>

<style>
  li {
    list-style: none;
  }
</style>
