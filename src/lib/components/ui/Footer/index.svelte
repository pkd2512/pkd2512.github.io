<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import NavLink from '$lib/components/ui/Navlink/index.svelte';

  import Logo from '$lib/components/ui/Logo/index.svelte';
  import Contact from '$lib/components/custom/home/Contact/index.svelte';

  // @ts-ignore
  import socialUrls from '/src/contents/data/socialurls.csv';

  const email = socialUrls.filter(
    (/** @type {{ name: string; }} */ d) => d.name === 'Email'
  )[0];

  const year = new Date().getFullYear();
</script>

<div style="margin-top: var(--space-xl)">
  <Contact />

  <footer>
    <Container id="site-footer">
      <div class="copyright">
        &copy; <span id="date">{year}</span>&nbsp;Copyright

        <div class="logo">
          <Logo size="1.25rem" colour="var(--white-soft)" />
        </div>

        <NavLink url="/">Prasanta Kumar Dutta</NavLink> &#8212; All Rights Reserved
      </div>
    </Container>
  </footer>
</div>

<style lang="scss">
  .copyright {
    text-align: center;
    font-family: var(--font-display);
  }
  .logo {
    vertical-align: middle;
    display: inline-flex;
  }
  footer {
    background-color: var(--purple-soft);

    font-size: var(--font-size--2);
    letter-spacing: var(--letter-spaced);
    padding: var(--space-s) 0;
    color: var(--white);

    :global(a) {
      color: var(--white);
      font-size: var(--font-size--2);
      font-weight: var(--font-weight-regular);
    }
  }
</style>
