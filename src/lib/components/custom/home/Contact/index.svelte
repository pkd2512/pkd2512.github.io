<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import NavLink from '$lib/components/ui/Navlink/index.svelte';
  import Icon from '@iconify/svelte';
  import socialUrls from '$utils/socialurls';
  import Logo from '$lib/components/ui/Logo/index.svelte';
  import { copy } from 'svelte-copy';

  const email = socialUrls.filter((d) => d.name === 'Email')[0];

  const year = new Date().getFullYear();

  $: icon = 'lucide:clipboard-copy';
  $: copymessage = 'Click to copy';
  $: copied = false;

  const copyEmailClick = (/** @type {any} */ e) => {
    copied = true;
    copymessage = 'Email copied!';
    icon = 'solar:clipboard-check-bold';
  };

  setInterval(() => {
    icon = 'lucide:clipboard-copy';
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
      Get in touch
      <span style="max-width:var(--xs)">
        To know more about my work, 1:1 mentorship, dataviz workshops or invite
        me to speak at your event!
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
      Stay in touch
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
    align-items: flex-start;
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
      font-size: var(--font-size--1);
      display: block;
      font-weight: var(--font-weight-light);
      font-family: var(--font-sans);
    }
  }

  .email {
    cursor: copy;
    position: relative;
    letter-spacing: var(--letter-spaced);
    font-family: var(--font-sans);
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-xs);
    margin-right: var(--space-2xs);

    &:hover {
      text-decoration: dotted;
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
    top: 0.35rem;
    left: 16.5rem;
    margin-top: 3px;

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
  }
</style>