export const prerender = true;
export const trailingSlash = 'always';

import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

injectSpeedInsights();
