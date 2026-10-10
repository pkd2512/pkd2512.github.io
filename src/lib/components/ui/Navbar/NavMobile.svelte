<script>
  import NavLink from '$lib/components/ui/Navlink/index.svelte';
  import Badge from './Badge.svelte';
  import Hamburger from './Hamburger.svelte';
  import pinNav from '$utils/pinNav';
  import { sendEvent } from '$utils/googleAnalytics';
  import { page } from '$app/state';
  import { afterNavigate } from '$app/navigation';
  import resolveLinkTarget from '$utils/resolveLinkTarget';

  let { links } = $props();

  let isOpen = $state(false);

  afterNavigate(() => {
    isOpen = false;
  });

  let pageId = $derived(page.route.id);
  let pageHash = $derived(page.url.hash);
  let home = $derived(links.filter((/** @type {any} */ d) => d.url === '/')[0]);
</script>

<!-- Marks where the bar naturally sits; pinNav reads it. Must stay directly
     before the nav. -->
<div class="pin-sentinel" aria-hidden="true"></div>

<nav id="sitenav-mobile" class="up" class:open={isOpen} use:pinNav>
  <div class="home">
    <NavLink
      style="color: var(--white);"
      target={resolveLinkTarget(home.url, page.url.hostname)}
      url="/"
      active={pageId === '/' && pageHash === ''}
    >
      <span class="sr-only">Home</span>
      <Badge mobile />
    </NavLink>
  </div>

  <div
    role="button"
    class="hamburger"
    onclick={() => {
      isOpen = !isOpen;
      sendEvent('navbar_toggle', { state: isOpen ? 'open' : 'closed' });
    }}
    onkeydown={(e) => e.key === 'Enter' && (isOpen = !isOpen)}
    tabindex="0"
  >
    <Hamburger open={isOpen} />
  </div>

  <ul class:open={isOpen}>
    {#if isOpen}
      {#each links as link, i (link.name)}
        {#if link.url !== '/'}
          <li style="animation-delay:{(i + 0.5) * 0.1}s;" class="nav-item">
            <NavLink
              style="color: var(--white);"
              target={resolveLinkTarget(link.url, page.url.hostname)}
              url={link.url}
              active={pageId?.includes(link.url) ||
                pageHash?.includes(link.name.toLowerCase())}
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
  @use 'src/lib/styles/mixins/shadows' as *;
  @use 'src/lib/styles/mixins/screenReaderOnly' as *;

  .sr-only {
    @include screenReaderOnly;
  }

  .pin-sentinel {
    height: 0;
    pointer-events: none;
  }

  nav {
    margin-top: -1px;
    margin-bottom: var(--space-3xl);
    transition: transform 0.35s ease-out;
    z-index: var(--layer-important);
    background-color: var(--purple-soft);
    // box-shadow: var(--shadow-3), var(--shadow-5);
    position: relative;
    margin-inline: auto;
    padding-inline: var(--grid-margin);
    max-width: 100%;
    height: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    box-shadow: var(--shadow-2);
  }

  // `pin`, `up`, `down` and `settling` are toggled with classList by pinNav,
  // which Svelte can't see, so these have to be :global to survive scoping.
  // Pinned, the bar sticks to the top; it slides away scrolling down and back
  // in scrolling up, unless the menu is open.
  :global(nav#sitenav-mobile.pin) {
    position: sticky !important;
    top: -1px;
    // Already on its own layer when the transform changes, so iOS animates the
    // move rather than snapping to the end state.
    will-change: transform;
  }

  // Away: quick and out of the way.
  :global(nav#sitenav-mobile.pin.down:not(.open)) {
    transform: translate3d(0, -250%, 0);
    transition-duration: 0.3s;
    transition-timing-function: ease-in;
  }

  // Back: a longer, decelerating roll down.
  :global(nav#sitenav-mobile.pin.up) {
    transform: translate3d(0, 0, 0);
    transition-duration: 0.5s;
    transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  }

  :global(nav#sitenav-mobile.settling) {
    transition: none !important;
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
    width: calc(100% + 2 * var(--grid-margin));
    margin-inline: calc(-1 * var(--grid-margin));
    transition: all 0.65s cubic-bezier(0.29, 1.4, 0.44, 0.96);
    height: 0;
    box-shadow: var(--shadow-2);
    &.open {
      height: calc(0.25 * 100svh);
    }
  }
  li {
    padding-inline: var(--grid-margin);
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
      // height: 0.3rem;
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
