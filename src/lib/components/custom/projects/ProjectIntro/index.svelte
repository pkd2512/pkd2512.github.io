<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import Icon from '@iconify/svelte';

  /**
   * @type {number}
   */
  let infoHeight;

  /**
   * @type {{ intro: { hed: any; dek?: any; img?: any; client?: any; duration?: any; }; }}
   */
  export let meta;
</script>

<section id="hero">
  <Container width="md">
    <header style="height: {Math.round(infoHeight * 1.5)}px;">
      <div class="text" bind:clientHeight="{infoHeight}">
        <h1>{@html meta.intro.hed}</h1>
        <p>
          {@html meta.intro.dek}
        </p>
        <p class="meta">
          <span title="client">
            <Icon icon="mdi:company" width="24" height="24" />{@html meta.intro
              .client}
          </span>
          <span title="duration">
            <Icon icon="mdi:calendar" width="24" height="24" />{@html meta.intro
              .duration}
          </span>
        </p>
      </div>
    </header>
  </Container>
</section>

<style lang="scss">
  @import 'src/lib/styles/mixins/index';

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
      @include text-shadow(var(--purple));
      margin-inline: auto;
    }
  }
</style>
