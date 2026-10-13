// Every gallery, at /gallery/[slug]. Content lives in src/contents/galleries/[slug].md.
// This is the one list the routes, the slug matcher and the projects page read:
// add an entry here and a matching .md file to add a gallery.
// `featured` galleries get the large hero card on the projects page; the rest
// are the smaller cards under it.
// Not a CSV in src/contents/data: those are synced from the Google Sheet.
export default [
  {
    slug: 'dataviz',
    title: 'Dataviz gallery',
    description: 'An interactive gallery of charts, maps and graphics.',
    src: '/media/share-images/dataviz-gallery.webp',
    categories: ['Interactive'],
    featured: true,
  },
  {
    slug: 'zines',
    title: 'Zines',
    description: 'Hand-made zines on travel, food and everyday life.',
    src: '/media/zines/zines-1.webp',
    categories: ['Print', '5 zines'],
  },
  {
    slug: 'photography',
    title: 'Photography',
    description: 'Landscapes and street scenes from my travels.',
    src: '/media/pexels-prasanta-kr-dutta-117541.webp',
    categories: ['Photography', '120 photos'],
  },
  {
    slug: 'art',
    title: 'Art',
    description: 'Generative art and creative coding experiments.',
    src: '/media/pkd-islands.webp',
    categories: ['Creative coding', '30 pieces'],
  },
];
