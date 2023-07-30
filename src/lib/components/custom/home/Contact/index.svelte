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
    icon =
      'streamline:interface-file-clipboard-check-checkmark-edit-task-edition-checklist-check-success-clipboard-form';
  };

  setInterval(() => {
    icon = 'lucide:clipboard-copy';
    copymessage = 'Click to copy';
  }, 3000);
</script>

<Container
  width="fluid"
  style="background-color: var(--purple-soft); background-image: url('media/textures/small-crackle-bright.png');
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
    </div>

    <div class="logo">
      <Logo colour="var(--white-soft)" />
    </div>

    <div class="links">
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
    padding-top: var(--space-m-l);
    padding-bottom: var(--space-s-m);
    align-items: flex-end;
    justify-content: space-between;
    color: var(--white-soft);
    font-family: var(--font-display);
    letter-spacing: var(--letter-spaced);
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
    letter-spacing: var(--letter-spaced);
    font-family: var(--font-sans);
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-light);
    margin-bottom: var(--space-xs);
    margin-right: var(--space-2xs);
  }

  .copy {
    pointer-events: none;
    position: absolute;
    margin-top: 3px;
    margin-left: var(--space-3xs);

    &:not(.copied) {
      animation: bounce 1s ease infinite;
    }

    span {
      width: max-content;
      display: inline-block;
      position: absolute;
      margin-top: 25%;
      font-size: var(--font-size--2);
    }

    @keyframes bounce {
      25% {
        transform: translateX(-10%);
      }
      40% {
        transform: translateX(-1%);
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
    text-align: right;
    :global {
      a {
        font-size: var(--font-size-0);
        color: var(--white-soft);
        margin-inline: var(--space-2xs);
      }
    }
  }
</style>
