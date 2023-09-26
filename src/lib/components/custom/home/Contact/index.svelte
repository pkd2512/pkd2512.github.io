<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import NavLink from '$lib/components/ui/Navlink/index.svelte';
  import Icon from '@iconify/svelte';

  import Logo from '$lib/components/ui/Logo/index.svelte';
  import { copy } from 'svelte-copy';

  // @ts-ignore
  import socialUrls from '/src/contents/data/socialurls.csv';

  const email = socialUrls.filter(
    (/** @type {{ name: string; }} */ d) => d.name === 'Email'
  )[0];

  const year = new Date().getFullYear();

  $: icon = 'fluent:copy-arrow-right-24-regular';
  $: copymessage = 'Click to copy';
  $: copied = false;

  const copyEmailClick = (/** @type {any} */ e) => {
    copied = true;
    copymessage = 'Email copied!';
    icon = 'fluent:copy-24-filled';
  };

  setInterval(() => {
    icon = 'fluent:copy-arrow-right-24-regular';
    copymessage = 'Click to copy';
  }, 3000);
</script>

<Container
  width="fluid"
  style="background-color: var(--purple-soft); background-image: url('/media/textures/small-crackle-bright.png');
    background-blend-mode: overlay;"
  id="contact"
>
  <div class="wrapper">
    <div class="contact">
      <!-- Get in touch -->
      <span style="max-width:calc(1.2 * var(--xs))">
        Get in touch to know more about my work, 1:1 mentorship, dataviz
        workshops or invite me to speak at your&nbsp;event!
      </span>
      <div
        class="email"
        role="button"
        on:click="{copyEmailClick}"
        use:copy="{email.url}"
      >
        {email.url}
        <span class="copy" class:copied="{copied}">
          <Icon icon="{icon}" />
          <span>{copymessage}</span>
        </span>
      </div>
    </div>

    <div class="logo">
      <Logo colour="var(--white-soft)" />
    </div>

    <div class="links">
      <!-- Stay in touch -->
      <div class="icons">
        {#each socialUrls as sosh}
          {#if sosh.name !== 'Email'}
            <NavLink
              url="{sosh.url}"
              title="{sosh.name}"
              target="{sosh.target}"
            >
              <Icon icon="{sosh.icon}" />
            </NavLink>
          {/if}
        {/each}
      </div>
    </div>
  </div>
</Container>

<style lang="scss">
  .wrapper {
    display: flex;
    max-width: var(--lg);
    margin-inline: auto;
    margin-top: var(--space-3xl);
    padding-top: var(--space-m-l);
    padding-bottom: var(--space-s-m);
    padding-inline: var(--space-s-m);
    align-items: center;
    justify-content: space-between;
    color: var(--white-soft);
    font-family: var(--font-display);
    letter-spacing: var(--letter-spaced);
  }

  .logo {
    margin: auto;
    visibility: hidden;
  }

  .contact {
    width: 45%;
    span {
      text-transform: none;
      font-size: var(--font-size--1);
      display: block;
      font-weight: var(--font-weight-light);
      font-family: var(--font-sans);
    }
  }

  .email {
    cursor: copy;
    position: relative;
    text-transform: none;
    letter-spacing: var(--letter-spaced);
    font-family: var(--font-sans);
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-xs);
    margin-right: var(--space-2xs);

    &:hover {
      text-decoration: underline;
      text-decoration-thickness: 0.25rem;
      text-underline-position: under;
      text-underline-offset: var(--space-3xs);
      text-decoration-color: var(--purple);
    }
  }

  .copy {
    pointer-events: none;
    position: absolute;
    top: var(--space-3xs);
    left: calc(2.2 * var(--space-3xl));
    margin-top: 3px;

    :global(svg) {
      transform: scaleX(-1);
    }

    &:not(.copied) {
      animation: bounce 1s ease infinite;
    }

    span {
      width: max-content;
      display: inline-block;
      position: absolute;
      margin-left: 3px;
      margin-top: 1px;

      font-size: var(--font-size--2);
    }

    @keyframes bounce {
      25% {
        transform: translateX(-20%);
      }
      40% {
        transform: translateX(-3%);
      }
      0%,
      60%,
      100% {
        transform: translateX(0);
      }
    }
  }

  .links {
    width: 45%;
    text-align: center;
    :global {
      a {
        font-size: var(--font-size-1);
        color: var(--white-soft);
        margin-inline: var(--space-2xs);
        border-bottom: 0rem solid var(--purple);
        &:hover {
          border-bottom: 0.25rem solid var(--purple);
        }
      }
    }
  }

  .icons {
    margin-top: var(--space-3xs);
    min-height: 3rem;
  }
</style>
