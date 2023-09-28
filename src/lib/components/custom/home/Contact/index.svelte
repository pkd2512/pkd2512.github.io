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

  $: icon = 'fluent:copy-24-regular';
  $: copymessage = 'Click to copy';
  $: copied = false;

  const copyEmailClick = (/** @type {any} */ e) => {
    copied = true;
    copymessage = 'Email copied!';
    icon = 'fluent:copy-24-filled';
  };

  setInterval(() => {
    icon = 'fluent:copy-24-regular';
    copymessage = 'Click to copy';
  }, 3000);
</script>

<section id="contact">
  <Container width="lg snap">
    <div class="wrapper">
      <div class="contact">
        <!-- Get in touch -->
        <span class="msg">
          Get in touch to know more about my work, 1:1 mentorship, dataviz
          design workshops or invite me to speak at your&nbsp;event!
        </span>
        <div
          class="email"
          role="button"
          on:click="{copyEmailClick}"
          use:copy="{email.url}"
        >
          <span class="id">{email.url}</span>
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
        <span class="msg"> Get social </span>
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
</section>

<style lang="scss">
  section {
    background-color: var(--purple-soft);
    background-image: url('/media/textures/small-crackle-bright.png');
    background-blend-mode: overlay;
  }

  .wrapper {
    display: flex;
    margin-inline: auto;
    padding-top: var(--space-m-l);
    padding-bottom: var(--space-s-m);
    align-items: flex-start;
    justify-content: space-between;
    color: var(--white-soft);
    font-family: var(--font-display);
    letter-spacing: var(--letter-spaced);

    @media (--lg-n-below) {
      flex-flow: column;
      max-width: var(--sm);
    }
  }

  .logo {
    margin: auto;
    visibility: hidden;
  }

  .contact {
    width: 55%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media (--lg-n-below) {
      width: 100%;
    }
  }

  .msg {
    width: 100%;
    text-wrap: balance;
    text-transform: none;
    font-size: var(--font-size--1);
    display: block;
    font-weight: var(--font-weight-light);
    font-family: var(--font-sans);
  }

  .email {
    width: 100%;
    cursor: copy;
    position: relative;
    margin-bottom: var(--space-xs);
    .id {
      text-transform: none;
      text-decoration: none;
      letter-spacing: var(--letter-spaced);
      font-family: var(--font-sans);
      font-size: var(--font-size-0);
      font-weight: var(--font-weight-bold);
      &:hover {
        text-decoration: underline;
        text-decoration-thickness: 0.25rem;
        text-underline-position: under;
        text-underline-offset: var(--space-3xs);
        text-decoration-color: var(--purple);

        @media (--lg-n-below) {
          text-decoration: none;
        }
      }
    }
  }

  .copy {
    pointer-events: none;
    position: absolute;
    display: block;
    top: var(--space-3xs);
    left: calc(2.2 * var(--space-3xl));

    @media (--xs-n-below) {
      position: relative;
      margin: auto;
      left: unset;
    }

    &:not(.copied) {
      animation: bounce 1s ease infinite;
    }

    span {
      width: max-content;
      display: inline-block;
      position: absolute;
      margin: auto;
      top: calc(0.15 * var(--font-size-0));
      left: var(--space-s);

      @media (--xs-n-below) {
        position: relative;
        left: 0;
        top: -5px;
      }

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

    @media (--xs-n-below) {
      @keyframes bounce {
        25% {
          transform: translateY(-20%);
        }
        40% {
          transform: translateY(-3%);
        }
        0%,
        60%,
        100% {
          transform: translateY(0);
        }
      }
    }
  }

  .links {
    width: 45%;
    text-align: center;

    @media (--lg-n-below) {
      width: 100%;
      text-align: left;
    }
    :global(a) {
      font-size: var(--font-size-1);
      color: var(--white-soft);
      margin-inline: var(--space-2xs);

      &:first-child {
        margin-inline-start: 0;
      }
      &:last-child {
        margin-inline-end: 0;
      }

      border-bottom: 0rem solid var(--purple);
      &:hover {
        border-bottom: 0.25rem solid var(--purple);
      }
    }
  }

  .icons {
    margin-top: var(--space-3xs);
    min-height: 3rem;
  }
</style>
