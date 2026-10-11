const GOOGLE_TAG_ID = 'G-DECCLNKCBR';
const URL = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`;

const isLocal = () =>
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const attachScript = () => {
  if (document.querySelector(`script[src="${URL}"]`)) return;
  const e = document.createElement('script');
  e.type = 'text/javascript';
  e.async = true;
  e.src = URL;
  // Drop a script that failed to load so nothing is left claiming it did.
  e.onerror = () => e.remove();
  document.head.append(e);
};

// Page views are left to GA4 itself. The first `config` sends the landing
// page_view, and the stream's "enhanced measurement" sends one for every
// client-side navigation (history change). Sending our own as well counted
// each navigation twice.
export const initGA = () => {
  if (isLocal()) return;
  try {
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      attachScript();
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', GOOGLE_TAG_ID, {
        // Add ?ga_debug to a URL to see this session in GA4 DebugView. It
        // only takes effect here, in the first config for the tag.
        ...(new URLSearchParams(window.location.search).has('ga_debug')
          ? { debug_mode: true }
          : {}),
      });
    }
  } catch (e) {
    console.warn(`Error initialising Google Analytics: ${e}`);
  }
};

export const sendEvent = (action, params) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  if (isLocal()) return;
  gtag('event', action, params);
};
