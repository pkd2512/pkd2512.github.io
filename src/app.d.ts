declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	interface Window {
		dataLayer: unknown[];
		gtag: (...args: unknown[]) => void;
	}
}

declare module '*.md' {
	import type { SvelteComponent } from 'svelte';
	const content: SvelteComponent;
	export default content;
	export const metadata: Record<string, unknown>;
}

export {};
