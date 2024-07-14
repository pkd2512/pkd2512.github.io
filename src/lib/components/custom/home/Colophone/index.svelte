<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
</script>

<div id="content">
  <Container width="md">
    <p>
      The site is built from the ground up using
      <LinkButton
        target="_blank"
        label="Sveltekit"
        url="https://kit.svelte.dev/"
      />
      and styled using a custom build of
      <LinkButton
        target="_blank"
        label="OpenProps"
        url="https://open-props.style/"
      />. The content is served via markdown files parsed through
      <LinkButton
        target="_blank"
        label="mdsvex"
        url="https://mdsvex.pngwn.io/"
      />. It is hosted via
      <LinkButton
        target="_blank"
        label="GitHub Pages"
        url="https://pages.github.com/"
      />.
    </p>

    <p>
      The pages are set in
      <LinkButton
        target="_blank"
        label="Erode"
        url="https://www.fontshare.com/fonts/erode"
      /> and
      <LinkButton
        target="_blank"
        label="Hind"
        url="https://www.fontshare.com/fonts/hind"
      /> typefaces from the Indian Type Foundry, along with
      <LinkButton
        target="_blank"
        label="Montserrat"
        url="https://www.fontshare.com/fonts/montserrat"
      /> for the title, served via Fontshare. The layout is designed to be fluid
      based on a typography and spacing scale generated using
      <LinkButton
        target="_blank"
        label="Utopia"
        url="https://utopia.fyi/space/calculator/?c=320,18,1.25,1440,22,1.414,4,2,&s=0.75%7C0.5%7C0.25,1.5%7C2%7C3%7C4%7C6,s-l&g=2xs,xs,xl,12"
      />.
    </p>

    <p>
      <kbd style="background:#2f0743" class="swatch">#2f0743</kbd>
      violet is used as the primary colour along with

      <kbd style="background:#231d25" class="swatch">#231d25</kbd> black and

      <kbd style="background:#999999" class="swatch">#999999</kbd> grey. They are
      paired with their softer accents.
    </p>

    <p>
      The <span class="logo"></span> logo is a visual play on the reflective
      symmetry of my initials <kbd>p</kbd> and
      <kbd>d</kbd>
      along the axis of <kbd>k</kbd> made by the negative space between the shapes.
    </p>

    <p>
      The animated line-drawing portrait was generated using
      <LinkButton
        target="_blank"
        label="AiDraw"
        url="https://ai-draw.tokyo/en/"
      />. The icons are a courtesy of the
      <LinkButton
        target="_blank"
        label="Iconify project"
        url="https://iconify.design/"
      />.
    </p>
  </Container>
</div>

<style lang="scss">
  .logo {
    background-image: url('/favicon.png');
    background-size: contain;
    background-repeat: no-repeat;
    display: inline-block;
    width: var(--font-size-1);
    height: var(--font-size-1);
    vertical-align: text-bottom;
  }

  .swatch {
    display: inline-flex;
    border-radius: 0.25rem;
    padding-inline: var(--space-2xs);
    color: white;
    line-height: var(--line-height-medium);
  }
</style>
