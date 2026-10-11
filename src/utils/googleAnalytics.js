const GOOGLE_TAG_ID = 'G-DECCLNKCBR';
const URL = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`;

let previousPage = '';

const attachScript = () => {
  if (document.querySelector(`script[src="${URL}"]`)) return;
  const e = document.createElement('script');
  e.type = 'text/javascript';
  e.async = true;
  e.src = URL;
  e.onerror = () => e.remove();
  document.head.append(e);
};

export const initGA = () => {
  try {
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      attachScript();
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', GOOGLE_TAG_ID, {
        send_page_view: false,
        // Add ?ga_debug to a URL to see this session in GA4 DebugView.
        ...(new URLSearchParams(window.location.search).has('ga_debug')
          ? { debug_mode: true }
          : {}),
      });
      registerPageview();
    }
  } catch (e) {
    console.warn(`Error initialising Google Analytics: ${e}`);
  }
};

export const registerPageview = () => {
  if (typeof window === 'undefined' || !window.gtag) return;

  if (!['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    const page_location = window.location.origin + window.location.pathname;
    const page_title = document?.title || '';
    const page_referrer = previousPage || document.referrer || undefined;
    previousPage = page_location;

    attachScript();
    gtag('event', 'page_view', {
      page_title,
      page_location,
      page_referrer,
    });
  }
};

export const sendEvent = (action, params) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  if (['localhost', '127.0.0.1'].includes(window.location.hostname)) return;
  gtag('event', action, params);
};
