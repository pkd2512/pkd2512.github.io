import { asset } from '$app/paths';
import manifest from '$lib/data/media-manifest.json';

/** @type {Record<string, string>} */
const hashes = manifest;

/**
 * Content hash of a file in static/media, or '' when unknown. Skipped in dev,
 * where nothing is cached and the manifest may be a step behind.
 * @param {string} path e.g. '/media/awards/whitman.webp'
 */
export function mediaVersion(path) {
  if (import.meta.env.DEV) return '';
  return hashes[path.replace(/^\/?media\//, '')] ?? '';
}

/**
 * URL for a file in static/media with its content hash appended
 * (/media/awards/whitman.webp?v=7bd5185b). When the file changes the URL does
 * too, so a long browser cache can never show a stale copy. Anything that is
 * not a /media file (remote URLs, already-versioned URLs) passes through as is.
 * @param {string} path '/media/...' or 'media/...'
 */
export default function media(path) {
  if (!path || path.includes('?') || !/^\/?media\//.test(path)) return path;
  const clean = '/' + path.replace(/^\/+/, '');
  const v = mediaVersion(clean);
  return asset(clean) + (v ? `?v=${v}` : '');
}
