<script>
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { initGA, sendEvent } from '$utils/googleAnalytics';

  let scrollThresholds = [25, 50, 75, 100];
  let sentScroll = new Set();

  const handleClick = (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    try {
      const url = new URL(href, window.location.origin);

      if (url.hostname !== window.location.hostname) {
        sendEvent('click', {
          event_category: 'outbound',
          link_url: url.href,
          link_text: link.textContent?.trim() || '',
          destination_domain: url.hostname,
        });
        return;
      }

      if (
        url.pathname.startsWith('/projects/') &&
        url.pathname !== '/projects/'
      ) {
        const slug = url.pathname.replace('/projects/', '').replace(/\/$/, '');
        sendEvent('select_content', {
          content_type: 'project',
          item_id: slug,
        });
        return;
      }

      if (url.hash && url.pathname === window.location.pathname) {
        sendEvent('anchor_nav', {
          anchor_id: url.hash.slice(1),
          page_path: url.pathname,
        });
      }
    } catch {
      /* invalid URL */
    }
  };

  const handleScroll = () => {
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const scrolled = (window.scrollY / scrollHeight) * 100;

    for (const threshold of scrollThresholds) {
      if (scrolled >= threshold && !sentScroll.has(threshold)) {
        sentScroll.add(threshold);
        sendEvent('scroll_depth', {
          percent: threshold,
          page_path: window.location.pathname,
        });
      }
    }
  };

  onMount(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initGA, { timeout: 3000 });
    } else {
      setTimeout(initGA, 3000);
    }

    document.addEventListener('click', handleClick);

    window.addEventListener('scroll', handleScroll, { passive: true });
  });

  afterNavigate(() => {
    sentScroll = new Set();
  });
</script>
