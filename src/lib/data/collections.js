// Collections shown under the dataviz hero on the projects page. `slug` is the
// page at /[slug], whose content lives in src/contents/collections/[slug].md.
// Not a CSV in src/contents/data: those are synced from the Google Sheet.
export default [
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
