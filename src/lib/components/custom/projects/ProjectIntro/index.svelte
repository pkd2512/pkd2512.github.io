<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import { page } from '$app/stores';
  import Icon from '@iconify/svelte';

  /**
   * @type {number}
   */
  let infoHeight;
  $: console.log(infoHeight);
  const { hed, dek, img, client, duration } = $page.data.meta.intro;
</script>

<section id="hero">
  <Container width="lg">
    <header style="height: {infoHeight * 1.5}px;">
      <div class="text" bind:clientHeight="{infoHeight}">
        <h1>{@html hed}</h1>
        <p>
          {@html dek}
        </p>
        <p class="meta">
          <span title="client">
            <Icon icon="mdi:company" width="24" height="24" />{@html client}
          </span>
          <span title="duration">
            <Icon icon="mdi:calendar" width="24" height="24" />{@html duration}
          </span>
        </p>
      </div>
    </header>
  </Container>
</section>

<style lang="scss">
  @import 'src/lib/styles/mixins/fullHeight';
  @import 'src/lib/styles/mixins/shadows';

  #hero {
    margin-top: calc(-1.5 * var(--space-3xl));
    background-color: var(--purple-soft);
    position: relative;
    z-index: var(--layer-5);
  }

  header {
    min-height: 90lvh;

    @media (max-width: 600px) {
      min-height: 80lvh;
    }

    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white-soft);

    .text {
      max-width: calc(0.85 * var(--lg));
      position: relative;
      z-index: var(--layer-1);

      @media (--xl-n-below) {
        max-width: calc(var(--lg) - 2 * var(--space-xl));
      }

      @media (--lg-n-below) {
        max-width: calc(1.15 * var(--md));
      }
    }

    p {
      color: var(--white-soft);
      font-size: var(--font-size-1);
      font-weight: var(--font-weight-light);
      @include text-shadow(var(--purple));

      &.meta {
        font-family: var(--font-sans);
        font-size: var(--font-size--1);

        span {
          display: inline-flex;
          align-items: flex-end;
          margin-inline-end: var(--space-s);
          letter-spacing: var(--letter-spaced);
          :global(svg) {
            margin-inline-end: var(--space-3xs);
          }
        }
      }
    }

    h1 {
      color: var(--white-soft);
      margin-inline: auto;
    }
  }
</style>
