<script>
  import { page } from '$app/stores';
  import getPageOrigin from '$utils/getPageOrigin';

  /**
   * @param {String} title - Title to be shown in browser tab and share card
   */
  export let title = 'Prasanta Kumar Dutta';

  /**
   * @param {String} description - Description to be shown in search results
   */
  export let description =
    'Award-winning Information Experience Designer, crafting visual stories with data and solving problems in an aesthetically pleasing way.';

  /**
   * @param {String} keywords - Keywords to be shown in search results
   */
  export let keywords =
    'Data Journalist, Graphics Journalist, Reuters Graphics Journalist, Data Visualisation Developer, Data Visualization Developer, Narrative Cartographer, User Interface Designer, User Experience Designer, Communication Designer, Data Storyteller, Information Designer, Graphic Designer, Art Director, User-centered design, UX, UI, Data Artist, Web Designer, Web Developer, Front-end Web Developer, Photographer, Traveller, Creative writer, Electronics and Communication Engineer, National Institute of Design, National Institute of Technology Durgapur, Prasanta, PrasantaKrDutta, Prasanta Kumar Dutta, Prasanta KrDutta, pkddapacific, pkd.dapacific, pkd_da_pacific, daPacific.';

  /**
   * @param {String} image - Thubnail to be shown in share card.
   * Share images should be in "static/share-images"
   */
  export let image = 'share.jpg';

  $: pageUrl = $page.url;
  $: canonicalUrl = ('http://prasantakrdutta.com' + pageUrl.pathname).replace(
    /index\.html/,
    ''
  );
  // $: canonicalUrl = (getPageOrigin(pageUrl) + pageUrl.pathname).replace(
  //   /index\.html/,
  //   ''
  // );
  $: imageUrl = `http://prasantakrdutta.com/media/share-images/${image}`;
  // $: imageUrl = `${getPageOrigin(pageUrl)}/media/share-images/${image}`;

  $: personSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    name: 'Prasanta Kumar Dutta',
    url: 'http://prasantakrdutta.com/',
    image: `${imageUrl}`,
    sameAs: [
      'https://www.reuters.com/authors/prasanta-kumar-dutta/',
      'https://adplist.org/mentors/prasanta-kr-dutta',
      'https://muckrack.com/pkddapacific',
      'https://facebook.com/pkd.dapacific',
      'https://vis.social/@pkddapacific',
      'https://twitter.com/Da_Pacific',
      'https://www.linkedin.com/in/pkddapacific/',
      'https://medium.com/@Da_Pacific',
      'https://www.instagram.com/pkd_da_pacific/',
      'https://www.instagram.com/thebongartista/',
      'https://www.instagram.com/thebongbawarchi/',
      'https://www.pexels.com/@pkddapacific/',
      'https://unsplash.com/@pkddapacific/',
      'https://500px.com/pkddapacific',
      'https://thenounproject.com/prasanta/',
      'https://www.behance.net/pkddapacific',
      'http://pkddapacific.blogspot.in',
      'https://www.youtube.com/user/pkddapacific',
      'https://unacademy.com/user/pkd.dapacific',
      'https://www.zomato.com/daPacific',
      'https://www.redbubble.com/people/daPacificArt/shop',
    ],
    jobTitle: 'Information Experience Designer',
    worksFor: {
      '@type': 'Organization',
      name: 'Reuters',
    },
  };
</script>

<svelte:head>
  {#key canonicalUrl}
    <!-- Meta -->
    <title>{title}</title>
    <meta name="description" content="{description}" />
    <meta name="keywords" content="{keywords}" />
    <link rel="canonical" href="{canonicalUrl}" />

    <!-- OpenGraph -->
    <meta property="og:url" content="{canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="{title}" itemprop="name" />
    <meta
      property="og:description"
      content="{description}"
      itemprop="description"
    />
    <meta
      property="og:image"
      name="image"
      content="{imageUrl}"
      itemprop="image"
    />
    <meta property="og:site_name" content="Prasanta Kumar Dutta" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Da_Pacific" />
    <meta name="twitter:creator" content="@Da_Pacific" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{description}" />
    <meta name="twitter:url" content="{canonicalUrl}" />
    <meta name="twitter:image" content="{imageUrl}" />

    <!-- Rich Snippets -->
    {@html `<${'script'} type="application/ld+json">${JSON.stringify(
      personSchema
    )}</script>`}
  {/key}
</svelte:head>
