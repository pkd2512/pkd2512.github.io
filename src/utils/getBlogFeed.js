const BLOG_FEED_URL =
  'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2Fdiarium-da-pacific';

export default async () => {
  const res = await fetch(BLOG_FEED_URL);
  const data = await res.json();
  return data.items || [];
};
