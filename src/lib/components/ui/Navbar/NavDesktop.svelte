<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import NavLink from '$lib/components/ui/Navlink/index.svelte';
  import { page } from '$app/state';
  import resolveLinkTarget from '$utils/resolveLinkTarget';
  import Badge from './Badge.svelte';

  import scrollDirection from '$utils/scrollDirection';
  import { inview } from 'svelte-inview';
  import { afterNavigate } from '$app/navigation';

  let { links } = $props();

  let pageId = $derived(page.route.id);
  let pageHash = $derived(page.url.hash);
  let pin = $state(false);
  let resizeTimer;
  /** @type {HTMLElement} */
  let navEl;

  const handleInview = (/** @type {{ detail: { inView: any; } }} */ e) => {
    if (window.scrollY > -1) {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        pin = !e.detail.inView;
      }, 100);
    }
  };

  afterNavigate(() => {
    // The observer can't settle this on its own: it reports *changes*, and the
    // bar's clipping often reads the same either side of a navigation, so no
    // event fires and the old page's state sticks. Measure instead. Sticky
    // keeps the bar in flow, so offsetTop is still its natural place in the new
    // page — and `margin-top: -1px` is what makes a bar sitting at the document
    // top count as scrolled past, which is how pages without a hero above the
    // nav get the pill at rest.
    clearTimeout(resizeTimer);
    pin = window.scrollY > navEl.offsetTop;
  });
</script>

<nav
  id="sitenav"
  bind:this={navEl}
  class="up"
  class:pin
  use:scrollDirection
  use:inview={{ root: null, threshold: 1 }}
  oninview_change={handleInview}
>
  <Container grid>
    <ul class="col-span-full">
      {#each links as link (link.name)}
        {#if link.url === '/'}
          <li class="nav-item badge">
            <NavLink
              style="color: var(--white);"
              target={resolveLinkTarget(link.url, page.url.hostname)}
              url="/"
              active={pageId === '/' && pageHash === ''}
            >
              <span class="sr-only">Home</span>
              <Badge />
            </NavLink>
          </li>
        {:else}
          <li class="nav-item">
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
    </ul>
  </Container>
</nav>

<style lang="scss">
  @use 'src/lib/styles/mixins/shadows' as *;
  @use 'src/lib/styles/mixins/screenReaderOnly' as *;

  .sr-only {
    @include screenReaderOnly;
  }

  nav {
    margin-top: -1px;
    margin-bottom: var(--space-3xl);
    // Every property the `.pin` state changes that can be interpolated, so the
    // bar reshapes into the pill (and back, on navigation) instead of snapping.
    transition:
      transform 0.35s ease,
      max-width 0.35s ease,
      border-radius 0.35s ease,
      filter 0.35s ease;
    z-index: var(--layer-5);
    background-color: var(--purple-soft);
    position: relative;
    margin-inline: auto;
    max-width: 100%;

    &.pin {
      position: sticky !important;
      top: -1px;
      left: -50%;
      max-width: var(--md);
      // box-shadow: var(--shadow-3);
      @include filter-shadow(var(--purple));

      @media (min-width: 600px) {
        border-radius: 15rem;
      }
    }
  }

  :global(nav#sitenav.pin.down:not(.open)) {
    transform: translate3d(0, -250%, 0);
  }

  :global(nav#sitenav.pin.up) {
    transform: translate3d(0, 0, 0);
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
      transition: width 0.35s ease;
    }

    :global(a.active::after) {
      width: 100%;
    }
  }

  ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    transition: padding-inline 0.35s ease;
  }

  // Unpinned, the links sit in columns 2-11, where `col-start-lg-2
  // col-span-lg-10` used to put them. As padding that interpolates; grid
  // placement does not, so swapping the class popped the row a frame before
  // the bar had moved. (100% - 11 gutters) / 12 is one column, plus its gutter.
  @media (min-width: 1024px) {
    nav:not(.pin) ul {
      padding-inline: calc(
        (100% - 11 * var(--grid-gutter)) / 12 + var(--grid-gutter)
      );
    }
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
