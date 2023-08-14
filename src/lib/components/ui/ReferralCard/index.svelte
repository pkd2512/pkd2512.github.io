<script>
  import Icon from '@iconify/svelte';
  import truncateText from '$utils/truncateText';
  import NavLink from '$lib/components/ui/Navlink/index.svelte';
  /**
   * @type {String}
   * Path to thumbnail image
   */
  export let image;

  /**
   * @type {String}
   * Card title
   */
  export let title;

  /**
   * @type {string}
   * Card description text
   */
  export let description = '';

  /**
   * @type {String}
   * Link to external site
   */
  export let url = '';
</script>

<NavLink
  data-card-type="referral-card"
  target="_blank"
  url="{url}"
  rel="noreferrer"
  disabled="{url === '' ? true : false}"
>
  <div class="preview-card">
    <div class="image" style="background-image:url({image})"></div>
    <div class="label">
      <div class="title">{@html title}</div>
      <p>
        {@html truncateText(description, 15)}
      </p>
    </div>
  </div>
</NavLink>

<style lang="scss">
  :global {
    [data-card-type='referral-card'] {
      &:hover {
        .preview-card {
          box-shadow: var(--shadow-3) !important;
          transform: scale3d(1.01, 1.01, 1.01);

          .image {
            filter: saturate(1);
            background-blend-mode: normal;
          }
        }
      }
    }
  }

  .preview-card {
    display: flex;
    margin-block: var(--space-xs);
    margin-inline: auto;
    max-width: calc(0.8 * var(--md));
    background-color: var(--white);
    border-radius: 0.25rem;
    box-shadow: var(--shadow-1);

    transition: all 0.3s ease;
  }

  .image {
    width: calc(2 * var(--space-3xl));
    aspect-ratio: var(--ratio-golden);

    background-size: cover;
    background-position: center;
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
    background-color: var(--purple);
    background-blend-mode: screen;
    filter: saturate(0.75);
  }

  .label {
    width: calc(100% - 2 * var(--space-3xl));
    display: flex;
    flex-flow: column;
    justify-content: center;
    margin-inline: var(--space-s);
    text-align: left;
    color: var(--black-soft);
    letter-spacing: 0;

    .title {
      font-size: var(--font-size--1);
      color: var(--black-soft);
      font-weight: var(--font-weight-bold);
      font-family: var(--font-sans);
      line-height: var(--line-height-medium);
    }

    p {
      margin-block: var(--space-3xs);
      font-style: italic;
      font-family: var(--font-serif);
      font-size: var(--font-size-0);
      line-height: var(--line-height-tight);
    }
  }
</style>
