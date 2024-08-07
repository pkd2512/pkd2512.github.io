// Google property ID
const GOOGLE_TAG_ID = 'G-DECCLNKCBR';

// Google tag url
const URL = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`;

const attachScript = () => {
  // If script is already attached, skip
  if (document.querySelector(`script[src="${URL}"]`)) return;
  // ... else attach it.
  const e = document.createElement('script');
  const head = document.getElementsByTagName('head')[0];
  e.type = 'text/javascript';
  e.async = true;
  e.src = URL;
  head.prepend(e);
};

/**
 * Attach gtag code to webpage
 */
export default () => {
  try {
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      attachScript();
      /** @type {Gtag.Gtag} */
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      // config event registers a pageview by default
      window.gtag('config', GOOGLE_TAG_ID, {
        send_page_view: false,
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
    window.gtag('event', 'page_view', {
      page_location: window.location.origin + window.location.pathname,
      page_title: document?.title,
      language: window?.navigator?.language,
      user_agent: window.navigator.userAgent,
      device: window.devicePixelRatio,
    });
  }
};
