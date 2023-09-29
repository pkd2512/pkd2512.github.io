<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import ParallaxHero from '$lib/components/ui/ParallaxHero/index.svelte';
  import Icon from '@iconify/svelte';
  import { copy } from 'svelte-copy';
  import { assets } from '$app/paths';

  /**
   * @param {String} hed
   * Title of the card
   */
  export let hed = '';

  /**
   * @param {String} dek
   * Card description
   */
  export let dek = '';

  $: icon = 'fluent:copy-24-regular';
  $: copied = false;

  const copyClick = (/** @type {any} */ e) => {
    copied = true;
    icon = 'fluent:copy-24-filled';
  };

  setInterval(() => {
    icon = 'fluent:copy-24-regular';
  }, 3000);
</script>

<section>
  <ParallaxHero vPos="center" img="/media/hero-about.jpg" />

  <Container width="md">
    <div class="card">
      <div class="img">
        <img src="{assets}/media/Prasanta_KrDutta.jpg" alt="" />
      </div>
      <div class="body">
        <h1>{hed}</h1>
        <p>{@html dek}</p>
        <span
          class="icon"
          role="button"
          on:click="{copyClick}"
          use:copy="{dek}"
        >
          <Icon
            width="22"
            height="22"
            icon="{icon}"
            color="var(--purple-soft)"
          />
        </span>
      </div>
    </div>
  </Container>
</section>

<style lang="scss">
  @import 'src/lib/styles/mixins/screenReaderOnly';
  @import 'src/lib/styles/mixins/fullHeight';

  section {
    :global(.container-md) {
      margin-top: -70lvh;

      @media (--xl-n-below) {
        margin-top: -65lvh;
      }

      @media (max-width: 600px) {
        margin-top: -60lvh;
      }
    }
  }

  .card {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 0.25rem;
    max-width: calc(var(--md) + 2 * var(--space-l));
    margin-inline: auto;
    margin-block: var(--space-xl);
    flex-wrap: wrap;
  }

  .icon {
    cursor: copy;
    position: absolute;
    bottom: var(--space-2xs);
    right: calc(1 * var(--space-2xs));
    transition: all 0.35s ease;
  }

  .img {
    width: 55%;
    height: 55%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: var(--purple);
    border-radius: 50%;
    z-index: var(--layer-1);
    box-shadow: var(--shadow-3);

    @media (--lg-only) {
      width: 70%;
      height: 70%;
    }

    img {
      object-fit: cover;
      min-height: 100%;

      mix-blend-mode: lighten;
      filter: saturate(0.75);
    }
  }

  .body {
    width: 100%;
    border-radius: 0.25rem;
    padding: var(--space-l) var(--space-s) var(--space-l) var(--space-m-l);
    background-color: var(--white);
    display: flex;
    align-items: center;
    box-shadow: var(--shadow-1);

    margin-top: -13%;
    padding-top: 15%;

    @media (--md-n-below) {
      width: 100%;
    }

    h1 {
      @include screenReaderOnly;
    }

    p {
      font-style: italic;
      margin-block: 0;
      text-wrap: balance;
    }
  }
</style>
