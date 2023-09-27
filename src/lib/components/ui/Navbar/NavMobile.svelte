<script>
  import NavLink from '$lib/components/ui/Navlink/index.svelte';
  import Badge from './Badge.svelte';
  import Hamburger from './Hamburger.svelte';
  import scrollDirection from '$utils/scrollDirection';
  import { inview } from 'svelte-inview';
  import { page } from '$app/stores';
  import { afterNavigate } from '$app/navigation';
  import resolveLinkTarget from '$utils/resolveLinkTarget';

  /**
   * Nav items
   * @type {any[]}
   */
  export let links;

  $: isOpen = false;

  afterNavigate(() => {
    isOpen = false;
  });

  $: pageId = $page.route.id;
  $: pageHash = $page.url.hash;
  $: home = links.filter((d) => d.url === '/')[0];
</script>

<nav
  id="sitenav-mobile"
  class="up"
  class:open="{isOpen}"
  use:scrollDirection
  use:inview="{{ root: null, threshold: 1 }}"
  on:inview_change="{(
    /** @type {{ detail: { node: { classList: { toggle: (arg0: string, arg1: boolean) => void; }; }; inView: any; }; }} */ e
  ) => {
    window.scrollY > -1 &&
      e.detail.node.classList.toggle('pin', !e.detail.inView);
  }}"
>
  <div class="home">
    <NavLink
      style="color: var(--white);"
      target="{resolveLinkTarget(home.url, $page.url.hostname)}"
      url="/"
      active="{pageId === '/' && pageHash === ''}"
    >
      <span class="sr-only">Home</span>
      <Badge mobile />
    </NavLink>
  </div>

  <div role="button" class="hamburger" on:click="{() => (isOpen = !isOpen)}">
    <Hamburger open="{isOpen}" />
  </div>

  <ul class:open="{isOpen}">
    {#if isOpen}
      {#each links as link, i (link.name)}
        {#if link.url !== '/'}
          <li style="animation-delay:{(i + 0.5) * 0.1}s;" class="nav-item">
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
    {/if}
  </ul>
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
    transition: transform 0.35s ease-out, max-width 0.15s ease-out;
    z-index: var(--layer-important);
    background-color: var(--purple-soft);
    box-shadow: var(--shadow-3), var(--shadow-5);
    position: relative;
    margin-inline: auto;
    padding-inline: var(--space-s);
    max-width: 100%;
    height: 4rem;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .hamburger {
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .home {
    :global(a) {
      height: 7.5rem;
      position: absolute;
      top: 0.95rem;
    }
  }

  ul {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 0;
    background-color: var(--purple-soft);
    width: calc(100% + 2 * var(--space-s));
    margin-inline: calc(-1 * var(--space-s));
    transition: all 0.65s cubic-bezier(0.29, 1.4, 0.44, 0.96);
    height: 0;
    box-shadow: var(--shadow-3), var(--shadow-5);

    &.open {
      height: calc(0.25 * 100svh);
    }
  }
  li {
    padding-inline: var(--space-s);
    list-style: none;
    text-transform: uppercase;
    letter-spacing: var(--letter-spaced-more);
    text-align: left;
    height: var(--space-l);
    display: flex;
    align-items: center;
    opacity: 0;
    animation-name: fadeIn;
    animation-duration: 0.35s;
    animation-fill-mode: forwards;

    span {
      @include text-shadow(var(--purple));
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
      margin-top: var(--space-3xs);
      background-color: var(--purple);
      transition: all 0.35s ease;
    }

    :global(a.active::after) {
      width: 100%;
      height: 0.3rem;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
