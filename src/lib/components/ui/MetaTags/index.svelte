<script>
  import { page } from '$app/state';

  let {
    title = 'Prasanta Kumar Dutta',
    description = 'Award-winning Information Experience Designer, crafting visual stories with data and solving problems in an aesthetically pleasing way.',
    keywords = 'Data Journalist, Graphics Journalist, Reuters Graphics Journalist, Data Visualisation Developer, Data Visualization Developer, Narrative Cartographer, User Interface Designer, User Experience Designer, Communication Designer, Data Storyteller, Information Designer, Graphic Designer, Art Director, User-centered design, UX, UI, Data Artist, Web Designer, Web Developer, Front-end Web Developer, Photographer, Traveller, Creative writer, Electronics and Communication Engineer, National Institute of Design, National Institute of Technology Durgapur, Prasanta, PrasantaKrDutta, Prasanta Kumar Dutta, Prasanta KrDutta, pkddapacific, pkd.dapacific, pkd_da_pacific, daPacific.',
    image = 'share.webp',
    meta = null,
  } = $props();

  let pageUrl = $derived(page.url);
  let canonicalUrl = $derived(
    ('https://prasantakrdutta.com' + pageUrl.pathname).replace(
      /index\.html/,
      ''
    )
  );
  let imageUrl = $derived(
    `https://prasantakrdutta.com/media/share-images/${image}`
  );
  let personImageUrl =
    'https://prasantakrdutta.com/media/share-images/share.webp';

  let isProject = $derived(meta?.type === 'project');
  let isHome = $derived(
    pageUrl.pathname === '/' || pageUrl.pathname === '/index.html'
  );

  let breadcrumbItems = $derived.by(() => {
    const baseUrl = 'https://prasantakrdutta.com';
    const items = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl + '/' },
    ];

    const pathParts = pageUrl.pathname
      .replace(/\/$/, '')
      .split('/')
      .filter(Boolean);

    if (pathParts.length === 0) return items;

    if (pathParts[0] === 'projects') {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Projects',
        item: baseUrl + '/projects/',
      });
      if (pathParts[1] && meta?.intro?.hed) {
        items.push({
          '@type': 'ListItem',
          position: 3,
          name: meta.intro.hed,
          item: baseUrl + '/projects/' + pathParts[1] + '/',
        });
      }
    } else if (pathParts[0] && pathParts[0] !== 'index.html') {
      const name = pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1);
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: name,
        item: baseUrl + '/' + pathParts[0] + '/',
      });
    }

    return items;
  });

  let schemas = $derived.by(() => {
    const baseUrl = 'https://prasantakrdutta.com';
    const s = [];

    // WebSite schema (homepage only)
    if (isHome) {
      s.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': baseUrl + '/#website',
        url: baseUrl + '/',
        name: 'Prasanta Kumar Dutta',
        description:
          'Award-winning Information Experience Designer, crafting visual stories with data at Reuters.',
        publisher: { '@type': 'Person', '@id': baseUrl + '/#person' },
        inLanguage: 'en-IN',
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate:
                baseUrl + '/?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        ],
      });
    }

    // WebPage or Article schema (every page)
    s.push({
      '@context': 'https://schema.org',
      '@type': isProject ? 'Article' : 'WebPage',
      '@id': canonicalUrl + '#webpage',
      url: canonicalUrl,
      name: title,
      description: description,
      image: imageUrl,
      inLanguage: 'en-IN',
      isPartOf: {
        '@type': 'WebSite',
        '@id': baseUrl + '/#website',
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        '@id': canonicalUrl + '#breadcrumb',
      },
      ...(isProject && meta
        ? {
            headline: meta.intro?.hed || title,
            datePublished: new Date(meta.date).toISOString() || undefined,
            dateModified: new Date(meta.date).toISOString() || undefined,
            author: { '@type': 'Person', '@id': baseUrl + '/#person' },
            publisher: { '@type': 'Person', '@id': baseUrl + '/#person' },
            articleSection: meta.categories?.join(', ') || undefined,
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
          }
        : {}),
    });

    // BreadcrumbList (every page)
    s.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': canonicalUrl + '#breadcrumb',
      itemListElement: breadcrumbItems,
    });

    // Person schema (every page, stable @id)
    s.push({
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': baseUrl + '/#person',
      name: 'Prasanta Kumar Dutta',
      url: baseUrl + '/',
      image: personImageUrl,
      description:
        'Award-winning Information Experience Designer, crafting visual stories with data at Reuters and solving problems in an aesthetically pleasing way.',
      disambiguatingDescription:
        'Information Experience Designer at Reuters specializing in data visualization, information design, data journalism, and narrative cartography.',
      jobTitle: 'Information Experience Designer',
      worksFor: {
        '@type': 'Organization',
        name: 'Reuters',
        url: 'https://www.reuters.com/authors/prasanta-kumar-dutta/',
        sameAs: ['https://www.reuters.com/'],
      },
      alumniOf: [
        {
          '@type': 'CollegeOrUniversity',
          name: 'National Institute of Design, Bangalore',
          url: 'https://www.nid.edu/',
        },
        {
          '@type': 'CollegeOrUniversity',
          name: 'National Institute of Technology Durgapur',
          url: 'https://nitdgp.ac.in/',
        },
      ],
      knowsAbout: [
        'Data Visualization',
        'Information Design',
        'Visual Journalism',
        'Data Journalism',
        'Narrative Cartography',
        'User Experience Design',
        'Front-end Web Development',
        'Photography',
      ],
      award: [
        'Webby Awards',
        'Society for News Design (SND) Awards',
        'Reuters Journalist of the Year',
      ],
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
    });

    return s;
  });
</script>

<svelte:head>
  {#key canonicalUrl}
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <link rel="canonical" href={canonicalUrl} />

    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:title" content={title} itemprop="name" />
    <meta
      property="og:description"
      content={description}
      itemprop="description"
    />
    <meta
      property="og:image"
      name="image"
      content={imageUrl}
      itemprop="image"
    />
    <meta property="og:site_name" content="Prasanta Kumar Dutta" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Da_Pacific" />
    <meta name="twitter:creator" content="@Da_Pacific" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:url" content={canonicalUrl} />
    <meta name="twitter:image" content={imageUrl} />

    {#each schemas as schema}
      {@html `<${'script'} type="application/ld+json">${JSON.stringify(
        schema
      )}</script>`}
    {/each}
  {/key}
</svelte:head>
