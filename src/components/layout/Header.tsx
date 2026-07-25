import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Container } from './Container';
import { countyHubs } from '../../lib/counties';
import { situations } from '../../lib/situations';

interface NavItem {
  to?: string;
  label: string;
  children?: { to: string; label: string }[];
}

// Dropdown children are derived from the data files so the nav can never
// drift out of sync with the county-hub and situation route sets.
const navItems: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/instant-offer', label: 'Instant Offer' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/cash-advance', label: 'Cash Advance' },
  {
    to: '/service-areas',
    label: 'Service Areas',
    children: [
      ...countyHubs.map((hub) => ({
        to: `/service-areas/${hub.slug}`,
        label: hub.slug === 'inland-empire' ? 'Inland Empire' : hub.name,
      })),
      { to: '/service-areas', label: 'All Cities' },
    ],
  },
  {
    label: 'Situations',
    children: situations.map((s) => ({
      to: `/situations/${s.slug}`,
      label: s.name,
    })),
  },
  { to: '/about-us', label: 'About Us' },
  { to: '/blog', label: 'Blog' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium whitespace-nowrap transition-warm ${
    isActive ? 'text-terracotta' : 'text-espresso hover:text-terracotta'
  }`;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-espresso/10 bg-linen sticky top-0 z-[60]">
      <Container size="wide">
        <div className="flex items-center justify-between gap-4 h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/logo.png"
              alt="Father & Son Home Buyers — sell your house fast for cash"
              className="h-16 w-auto"
              width={512}
              height={512}
              loading="eager"
              decoding="async"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-5">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="relative group">
                  {item.to ? (
                    <NavLink to={item.to} className={navLinkClass}>
                      <span className="inline-flex items-center gap-1">
                        {item.label}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </NavLink>
                  ) : (
                    <span className="text-sm font-medium whitespace-nowrap text-espresso group-hover:text-terracotta transition-warm cursor-default inline-flex items-center gap-1">
                      {item.label}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  )}
                  {/* Dropdown stays in the DOM (hidden via CSS) so crawlers see
                      these links in the prerendered HTML of every page. */}
                  <div className="absolute left-0 top-full pt-3 hidden group-hover:block group-focus-within:block z-50">
                    <div className="bg-linen border border-espresso/10 rounded-lg shadow-warm-lg py-2 min-w-56">
                      {item.children.map((child) => (
                        <NavLink
                          key={`${child.to}-${child.label}`}
                          to={child.to}
                          className={({ isActive }) =>
                            `block px-5 py-2.5 text-sm font-medium transition-warm ${
                              isActive
                                ? 'text-terracotta'
                                : 'text-espresso hover:text-terracotta hover:bg-oatmeal/50'
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink key={item.label} to={item.to!} className={navLinkClass} end={item.to === '/'}>
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          {/* Phone CTA */}
          <a
            href="tel:+19495412003"
            className="hidden md:flex btn-primary px-4 py-2.5 rounded-md text-sm font-medium items-center gap-2 whitespace-nowrap flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call or Text (949) 541-2003
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-espresso"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="xl:hidden py-4 border-t border-espresso/10 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.to ? (
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-md text-sm font-medium transition-warm ${
                          isActive
                            ? 'bg-terracotta/10 text-terracotta'
                            : 'text-espresso hover:bg-oatmeal'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ) : (
                    <span className="block px-4 py-3 text-sm font-medium text-espresso">
                      {item.label}
                    </span>
                  )}
                  {item.children && (
                    <div className="flex flex-col">
                      {item.children.map((child) => (
                        <NavLink
                          key={`${child.to}-${child.label}`}
                          to={child.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `block pl-8 pr-4 py-2.5 rounded-md text-sm transition-warm ${
                              isActive
                                ? 'bg-terracotta/10 text-terracotta'
                                : 'text-driftwood hover:bg-oatmeal'
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a
                href="tel:+19495412003"
                className="mt-2 btn-primary px-4 py-3 rounded-md text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call or Text (949) 541-2003
              </a>
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
}
