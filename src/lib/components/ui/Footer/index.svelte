<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import NavLink from '$lib/components/ui/Navlink/index.svelte';
  import socialUrls from '$utils/socialurls';
  import Logo from '$lib/components/ui/Logo/index.svelte';
  import Contact from '$lib/components/custom/home/Contact/index.svelte';

  const email = socialUrls.filter((d) => d.name === 'Email')[0];

  const year = new Date().getFullYear();
</script>

<Contact />

<footer>
  <Container id="site-footer">
    <div class="copyright">
      &copy; <span id="date">2017-{year}</span>&nbsp;Copyright

      <span class="logo">
        <Logo size="1.25rem" colour="var(--white-soft)" />
      </span>

      <NavLink
        style="font-size: var(--font-size--1); color:var(--white);"
        url="/">Prasanta Kumar Dutta</NavLink
      > &#8212; All Rights Reserved
    </div>
  </Container>
</footer>

<style lang="scss">
  .copyright {
    text-align: center;
    font-family: var(--font-display);
  }
  .logo {
    vertical-align: middle;
  }
  footer {
    background-color: var(--purple-soft);

    font-size: var(--font-size--2);
    letter-spacing: var(--letter-spaced);
    padding: var(--space-s) 0;
    color: var(--white);
  }
</style>
