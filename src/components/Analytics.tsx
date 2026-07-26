import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, initPhoneTracking } from '../lib/analytics';

/**
 * Fires a GA4 page_view on every client-side route change (the gtag config in
 * index.html sets send_page_view:false, so this is the single source of truth)
 * and binds sitewide tel: click tracking once. Renders nothing.
 */
export function Analytics() {
  const location = useLocation();

  useEffect(() => {
    initPhoneTracking();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
}
