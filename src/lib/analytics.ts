/**
 * Google Analytics 4 (GA4) helpers.
 *
 * The gtag loader lives in index.html and is skipped on localhost/prerender, so
 * `window.gtag` is undefined during `npm run dev` and the Puppeteer prerender —
 * every function here no-ops safely in that case. In production the inline
 * snippet defines `window.gtag` synchronously (queuing to dataLayer), so calls
 * made before the async library finishes loading are still captured.
 */

export const GA_MEASUREMENT_ID = 'G-0BTH7MJ5ND';

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

function hasGtag(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

/** Send a custom GA4 event. */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!hasGtag()) return;
  window.gtag!('event', name, params ?? {});
}

/** Send a manual page_view (config uses send_page_view:false so SPA nav is tracked here). */
export function trackPageView(path: string): void {
  if (!hasGtag()) return;
  window.gtag!('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

let phoneTrackingBound = false;

/**
 * One delegated listener catches clicks on every `tel:` link sitewide, so we
 * don't have to touch each of the ~10 phone links individually.
 */
export function initPhoneTracking(): void {
  if (typeof document === 'undefined' || phoneTrackingBound) return;
  phoneTrackingBound = true;
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    const link = target?.closest?.('a[href^="tel:"]') as HTMLAnchorElement | null;
    if (link) {
      trackEvent('phone_click', { link_url: link.href });
    }
  });
}
