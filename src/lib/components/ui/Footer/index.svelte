<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import NavLink from '$lib/components/ui/Navbar/NavLink.svelte';
  import Icon from '@iconify/svelte';
  import socialUrls from '$assets/data/socialurls.json';

  const email = socialUrls.filter((d) => d.name === 'Email')[0];

  const year = new Date().getFullYear();
</script>

<footer>
  <Container id="site-footer">
    <div class="contact">
      <div>Say hello!</div>
      <NavLink url="{email.url}" target="{email.target}"
        >pkd@prasantakrdutta.com
      </NavLink>
      <div class="links">
        {#each socialUrls as sosh}
          {#if sosh.name !== 'Email'}
            <NavLink
              url="{sosh.url}"
              title="{sosh.name}"
              target="{sosh.target}"
            >
              <Icon icon="{sosh.icon}" />
            </NavLink>
          {/if}
        {/each}
      </div>
    </div>
    <div class="copyright">
      &copy; <span id="date">2017-{year}</span>&nbsp;Copyright
      <NavLink url="/">&nbsp;Prasanta Kumar Dutta</NavLink> &#8212; All Rights Reserved
    </div>
  </Container>
</footer>

<style lang="scss">
  .copyright,
  .contact {
    text-align: center;
  }
</style>
