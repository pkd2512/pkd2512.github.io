<script>
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';
  import '@splidejs/svelte-splide/css';
  import Icon from '@iconify/svelte';
  import testimonials from '$utils/testimonials';
  import Container from '$lib/components/ui/Container/index.svelte';
  import truncateText from '$utils/truncateText';
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
</script>

<Container id="mentoring" width="lg">
  <Splide
    options="{{
      rewind: true,
      autoplay: true,
      type: 'loop',
      padding: '0',
      pagination: false,
    }}"
    aria-label="My Favorite Images"
  >
    {#each testimonials as { content, name, credentials }}
      <SplideSlide>
        <blockquote>
          <p class="textimonial-text">{@html truncateText(content, 45)}</p>
          <cite>— {name}, <em>{credentials}</em></cite>
        </blockquote>
      </SplideSlide>
    {/each}
  </Splide>

  <div class="mentoring">
    <div class="icon">
      <Icon icon="icon-park-solid:appointment" />
    </div>

    <LinkButton
      label="Book a session"
      target="_blank"
      url="https://topmate.io/prasanta_kumar_dutta"
      solid="{true}"
    />
  </div>
</Container>

<style lang="scss">
  .mentoring {
    margin-bottom: var(--space-2xl-3xl);
    text-align: center;
    .icon {
      margin-block: var(--space-2xs);
      font-size: var(--font-size-1);
      :global {
        path {
          fill: var(--purple);
        }
      }
    }
  }
  :global {
    #mentoring {
      li {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      button {
        background-color: var(--white-soft);
        svg {
          fill: var(--purple);
        }
      }
    }
  }
</style>
