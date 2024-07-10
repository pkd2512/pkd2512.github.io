/**
 * Gets RSS feed as a JSON
 * https://rss2json.com/#rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2Fdiarium-da-pacific
 */
export default async () => {
  const response = await fetch(
    'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2Fdiarium-da-pacific'
  );

  const res = await response.json();

  return res.items;
};
