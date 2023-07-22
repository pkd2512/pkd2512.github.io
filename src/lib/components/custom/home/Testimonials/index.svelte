<script>
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';
  import '@splidejs/svelte-splide/css';
  import testimonials from '$utils/testimonials';
  import Container from '$lib/components/ui/Container/index.svelte';
</script>

<Container id="testimonials" width="lg">
  <Splide
    options="{{
      rewind: true,
      autoplay: true,
      type: 'loop',
      padding: '10rem',
    }}"
    aria-label="My Favorite Images"
  >
    {#each testimonials as { content, name, credentials }}
      <SplideSlide>
        <figure>
          <blockquote>
            <p>{@html content}</p>
          </blockquote>
          <figcaption>— {name}, <cite>{credentials}</cite></figcaption>
        </figure>
      </SplideSlide>
    {/each}
  </Splide>
</Container>
