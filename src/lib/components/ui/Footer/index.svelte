<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import NavLink from '$lib/components/ui/Navlink/index.svelte';
  import socialUrls from '$utils/socialurls';

  import Contact from '$lib/components/custom/home/Contact/index.svelte';

  const email = socialUrls.filter((d) => d.name === 'Email')[0];

  const year = new Date().getFullYear();
</script>

<Contact />

<footer>
  <Container id="site-footer">
    <div class="copyright">
      &copy; <span id="date">2017-{year}</span>&nbsp;Copyright
      <NavLink
        style="font-size: var(--font-size--2); color:var(--white);"
        url="/">&nbsp;Prasanta Kumar Dutta</NavLink
      > &#8212; All Rights Reserved
    </div>
  </Container>
</footer>

<style lang="scss">
  .copyright {
    text-align: center;
    font-family: var(--font-display);
  }

  footer {
    background-color: var(--purple-soft);

    font-size: var(--font-size--2);
    letter-spacing: var(--letter-spaced);
    padding: var(--space-s) 0;
    color: var(--white);
  }
</style>
