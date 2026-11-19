'use client';

import { useEffect } from 'react';

/**
 * GA4 events for tekguyz.com (tekguyz-one#23). One delegated click listener,
 * so no link component needs to change:
 *   - a link to a demo on `.vercel.app` -> `demo_opened`
 *   - a `mailto:` link -> `email_click`
 *   - a `tel:` link -> `phone_click`
 * `contact_form_sent` is sent from the contact form itself.
 */
export function AnalyticsEvents() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      let name: string | null = null;
      let params: Record<string, string> = {};
      if (href.startsWith('mailto:')) name = 'email_click';
      else if (href.startsWith('tel:')) name = 'phone_click';
      else {
        try {
          const url = new URL(href, window.location.href);
          if (url.hostname.endsWith('.vercel.app')) {
            name = 'demo_opened';
            params = { demo: url.hostname.replace('.vercel.app', '') };
          }
        } catch {
          /* not a URL */
        }
      }
      if (name) window.gtag?.('event', name, params);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
