import { Link } from 'react-router-dom';
import { Container } from './Container';
import { countyHubs } from '../../lib/counties';
import { situations } from '../../lib/situations';

const quickLinks = [
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/cash-advance', label: 'Cash Advance' },
  { to: '/about-us', label: 'About Us' },
  { to: '/blog', label: 'Blog' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

// County hubs come first (derived from counties.ts so this can't drift),
// followed by a few flagship cities and the full index.
const serviceAreas = [
  ...countyHubs.map((hub) => ({
    to: `/service-areas/${hub.slug}`,
    label: hub.slug === 'inland-empire' ? 'Inland Empire' : hub.name,
  })),
  { to: '/locations/anaheim', label: 'Anaheim' },
  { to: '/locations/irvine', label: 'Irvine' },
  { to: '/locations/long-beach', label: 'Long Beach' },
  { to: '/locations/riverside', label: 'Riverside' },
  { to: '/service-areas', label: 'View All Cities' },
];

// Every situation landing page, derived from situations.ts.
const situationLinks = situations.map((s) => ({
  to: `/situations/${s.slug}`,
  label: s.name,
}));

// Real, verified profiles only — these are the same URLs the Organization
// schema lists in `sameAs`, so the on-page links and the markup agree.
const socialLinks = [
  {
    href: 'https://share.google/mYFjndAgX62vZejGs',
    label: 'Google Business Profile',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.24 10.28v3.64h5.16c-.21 1.34-1.55 3.93-5.16 3.93-3.11 0-5.64-2.57-5.64-5.75s2.53-5.75 5.64-5.75c1.77 0 2.95.75 3.63 1.4l2.47-2.38C16.75 3.85 14.68 3 12.24 3 7.15 3 3 7.14 3 12.1s4.15 9.1 9.24 9.1c5.34 0 8.88-3.75 8.88-9.03 0-.61-.07-1.07-.15-1.53h-8.73z" />
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/fathersonhomes',
    label: 'Instagram',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.72a6.12 6.12 0 100 12.24 6.12 6.12 0 000-12.24zm0 10.1a3.98 3.98 0 110-7.96 3.98 3.98 0 010 7.96zm7.79-10.34a1.43 1.43 0 11-2.86 0 1.43 1.43 0 012.86 0z" />
      </svg>
    ),
  },
];

const promises = [
  'Cash offer within 24 hours',
  'Close in as little as 14 days',
  'No fees or commissions',
  'Sell as-is, no repairs needed',
  '100% transparent process',
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-espresso text-cream">
      <Container>
        {/* Main Footer Content */}
        <div className="py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div>
              <div className="mb-6">
                <img
                  src="/logo.png"
                  alt="Father & Son Home Buyers — we buy houses in Southern California"
                  className="h-24 w-auto rounded-lg"
                  width={512}
                  height={512}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="text-sm text-cream/70 leading-relaxed mb-6">
                A local father and son team helping Southern California homeowners sell their properties quickly and fairly. No pressure, no hidden fees.
              </p>
              <div className="space-y-3 text-sm">
                <p>
                  <a href="tel:+19495412003" className="text-cream/80 hover:text-terracotta transition-warm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call or Text (949) 541-2003
                  </a>
                </p>
                <p>
                  <a href="mailto:contact@fathersonhomes.com" className="text-cream/80 hover:text-terracotta transition-warm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    contact@fathersonhomes.com
                  </a>
                </p>
                <p className="text-cream/60 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Serving Orange County, LA County & Inland Empire
                </p>
              </div>

              {/* Social / review profiles — the same URLs as schema `sameAs`. */}
              <div className="flex items-center gap-3 mt-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center text-cream/70 hover:text-terracotta hover:border-terracotta transition-warm"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h3 className="text-sm font-medium tracking-warm text-cream/50 mb-5">
                Quick Links
              </h3>
              <nav className="space-y-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="block text-sm text-cream/70 hover:text-terracotta transition-warm"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Service Areas Column */}
            <div>
              <h3 className="text-sm font-medium tracking-warm text-cream/50 mb-5">
                Service Areas
              </h3>
              <nav className="space-y-3">
                {serviceAreas.map((link, index) => (
                  <Link
                    key={index}
                    to={link.to}
                    className="block text-sm text-cream/70 hover:text-terracotta transition-warm"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Situations Column */}
            <div>
              <h3 className="text-sm font-medium tracking-warm text-cream/50 mb-5">
                Situations We Help With
              </h3>
              <nav className="space-y-3">
                {situationLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block text-sm text-cream/70 hover:text-terracotta transition-warm"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Our Promise Column */}
            <div>
              <h3 className="text-sm font-medium tracking-warm text-cream/50 mb-5">
                Our Promise
              </h3>
              <ul className="space-y-3">
                {promises.map((promise) => (
                  <li key={promise} className="flex items-start gap-2 text-sm text-cream/70">
                    <svg className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {promise}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream/40">
            &copy; {currentYear} Father & Son Home Buyers. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-xs text-cream/40 hover:text-terracotta transition-warm">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-xs text-cream/40 hover:text-terracotta transition-warm">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
