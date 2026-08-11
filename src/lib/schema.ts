import { useEffect } from 'react';
import {
  TEAM,
  TESTIMONIALS,
  GOOGLE_REVIEWS,
  RATING_SCHEMA_ENABLED,
} from './reviews';
import { cities } from './cities';
import { situations } from './situations';
import {
  cityAreaNode,
  countyAreaNode,
  servedCountyNodes,
  serviceAreaPlace,
} from './places';

/**
 * Per-page structured data (JSON-LD).
 *
 * Sitewide schema that is valid on EVERY page — the Organization and WebSite
 * nodes — lives hardcoded in index.html. This module owns the schema that is
 * specific to a single page type (LocalBusiness, FAQPage, BlogPosting,
 * BreadcrumbList) and injects exactly the right graph per route.
 *
 * `usePageSchema` removes any page-level schema it previously injected before
 * writing the new one, so navigating between routes never accumulates orphan
 * `<script type="application/ld+json">` tags in <head>.
 */

const SITE = 'https://fathersonhomes.com';
const ORG_ID = `${SITE}/#organization`;
/** The two Person nodes defined in the sitewide identity block in index.html. */
const FATHER_ID = `${SITE}/#father`;
const SON_ID = `${SITE}/#son`;
const SERVICE_AREA_ID = `${SITE}/#serviceArea`;
const PHONE = '+1-949-541-2003';
const EMAIL = 'contact@fathersonhomes.com';
const LOGO = `${SITE}/logo.png`;

/**
 * The situation pages, as the services the business offers. Derived from
 * situations.ts so the offer catalog can never list a page that doesn't exist.
 */
const SERVICE_PAGES = situations.map((situation) => ({
  name: `Sell a House — ${situation.name}`,
  path: `/situations/${situation.slug}`,
  description: situation.cardBlurb,
}));

/** Home → … breadcrumb trail. Every entry after Home is a {name, path} pair. */
function breadcrumb(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      ...trail.map((step, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: step.name,
        item: `${SITE}${step.path}`,
      })),
    ],
  };
}

// Marks every script this module injects so stale ones can be cleared on
// route change regardless of which page created them.
const MANAGED_ATTR = 'data-page-schema';

/**
 * Inject one or more JSON-LD nodes into <head> for the current page. Clears any
 * previously injected page-level schema first (from this or a prior route).
 */
export function usePageSchema(nodes: object | object[]) {
  const list = Array.isArray(nodes) ? nodes : [nodes];
  const serialized = list.map((node) => JSON.stringify(node));
  // Stable dependency: only re-inject when the actual schema content changes.
  const key = serialized.join('\u0000');

  useEffect(() => {
    document.head
      .querySelectorAll(`script[${MANAGED_ATTR}]`)
      .forEach((el) => el.remove());

    const created = serialized.map((text) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(MANAGED_ATTR, '');
      script.textContent = text;
      document.head.appendChild(script);
      return script;
    });

    return () => created.forEach((el) => el.remove());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

/**
 * Homepage LocalBusiness. Region-level address (no fabricated street) plus the
 * counties we serve.
 *
 * `founder` is always emitted (real named owners). `aggregateRating`/`review`
 * are gated behind RATING_SCHEMA_ENABLED — see reviews.ts — so we don't ship a
 * self-serving rating built on a tiny review sample. It turns back on
 * automatically once the real reviewCount clears the threshold.
 */
export function homeLocalBusinessSchema() {
  const ratingNodes = RATING_SCHEMA_ENABLED
    ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: String(GOOGLE_REVIEWS.ratingValue),
          reviewCount: String(GOOGLE_REVIEWS.reviewCount),
          bestRating: '5',
          worstRating: '1',
        },
        review: TESTIMONIALS.map((t) => ({
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: String(t.rating),
            bestRating: '5',
            worstRating: '1',
          },
          author: { '@type': 'Person', name: t.name },
          reviewBody: t.quote,
        })),
      }
    : {};

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE}/#business`,
    name: 'Father & Son Home Buyers',
    alternateName: 'Father and Son Home Buyers',
    description:
      'Family-owned cash home buyers serving Southern California. We buy houses as-is in Orange County, Los Angeles County, and the Inland Empire. Get a fair cash offer within 24 hours.',
    url: `${SITE}/`,
    logo: LOGO,
    image: LOGO,
    telephone: PHONE,
    email: EMAIL,
    priceRange: '$$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Cash',
    // The Person nodes themselves live in the sitewide identity block, so these
    // references resolve on every page without duplicating the bios.
    founder: [{ '@id': FATHER_ID }, { '@id': SON_ID }],
    employee: [{ '@id': FATHER_ID }, { '@id': SON_ID }],
    parentOrganization: { '@id': ORG_ID },
    ...ratingNodes,
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    areaServed: { '@id': SERVICE_AREA_ID },
    knowsAbout: [
      {
        '@type': 'Thing',
        name: 'Sell Your House Fast for Cash',
        url: `${SITE}/how-it-works`,
      },
      {
        '@type': 'Thing',
        name: 'Cash Advance Before Closing',
        url: `${SITE}/cash-advance`,
      },
      ...SERVICE_PAGES.map((service) => ({
        '@type': 'Thing',
        name: service.name,
        url: `${SITE}${service.path}`,
      })),
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Home Selling Solutions',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sell Your House Fast for Cash',
            url: `${SITE}/how-it-works`,
            description:
              'Get a no-obligation cash offer within 24 hours and close on your timeline — often in days, not months.',
            serviceType: 'Cash home purchase',
            provider: { '@id': ORG_ID },
            areaServed: { '@id': SERVICE_AREA_ID },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Cash Advance Before Closing',
            url: `${SITE}/cash-advance`,
            description:
              'Eligible sellers can receive cash advanced to them before the sale closes.',
            serviceType: 'Cash advance to home sellers before closing',
            provider: { '@id': ORG_ID },
            areaServed: { '@id': SERVICE_AREA_ID },
          },
        },
        ...SERVICE_PAGES.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            url: `${SITE}${service.path}`,
            description: service.description,
            serviceType: service.name,
            provider: { '@id': ORG_ID },
            areaServed: { '@id': SERVICE_AREA_ID },
          },
        })),
      ],
    },
    potentialAction: {
      '@type': 'ReserveAction',
      name: 'Request a Cash Offer',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE}/contact`,
        inLanguage: 'en-US',
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/IOSPlatform',
          'https://schema.org/AndroidPlatform',
        ],
      },
      result: { '@type': 'Reservation', name: 'Cash Offer Consultation' },
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '15:00',
      },
    ],
    // Real, verified profiles. Add more (e.g. Facebook, LinkedIn) as they go live.
    sameAs: [
      'https://www.instagram.com/fathersonhomes',
      'https://share.google/mYFjndAgX62vZejGs',
    ],
  };
}

/**
 * The `Place` the homepage business node points `areaServed` at: state →
 * counties → every city we serve, each linked to its real-world entity. Ships
 * on the homepage alongside the business node so the `@id` reference resolves.
 */
export function serviceAreaSchema() {
  return { '@context': 'https://schema.org', ...serviceAreaPlace(SITE, cities) };
}

/** FAQPage schema built from the questions actually shown on the FAQ page. */
export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

interface BlogPostLike {
  slug: string;
  title: string;
  description: string;
  date: string;
  category?: string;
  sections?: {
    heading?: string;
    body?: string;
    bullets?: { lead?: string; text: string }[];
    outro?: string;
  }[];
}

/** ISO 8601 for a post's human-readable date string ("February 28, 2026"). */
function isoDate(date: string) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? undefined
    : parsed.toISOString().slice(0, 10);
}

/** Words in the article body — what `wordCount` is supposed to report. */
function postWordCount(post: BlogPostLike) {
  const text = (post.sections ?? [])
    .map((s) =>
      [
        s.heading ?? '',
        s.body ?? '',
        ...(s.bullets ?? []).map((b) => `${b.lead ?? ''} ${b.text}`),
        s.outro ?? '',
      ].join(' ')
    )
    .join(' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return words || undefined;
}

/**
 * A single BlogPosting node for an article page.
 *
 * `author` points at the son's Person node from the sitewide identity block
 * rather than restating it — Google wants a real, identifiable author on
 * money-topic content, and one entity beats two half-matching copies.
 */
export function blogPostingSchema(post: BlogPostLike) {
  const published = isoDate(post.date);
  const words = postWordCount(post);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${SITE}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.description,
    ...(published ? { datePublished: published, dateModified: published } : {}),
    image: [`${SITE}/og-image.png`],
    author: { '@id': SON_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
    ...(post.category ? { articleSection: post.category } : {}),
    ...(words ? { wordCount: words } : {}),
    // No isPartOf → the Blog node only exists on /blog, and every @id here has
    // to resolve to an entity that ships on this page.
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE}/blog/${post.slug}`,
    },
  };
}

/** BreadcrumbList for an article: Home → Blog → Post. */
export function blogPostBreadcrumbSchema(post: BlogPostLike) {
  return breadcrumb([
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);
}

/** The /blog index: a Blog entity listing the posts actually shown on it. */
export function blogIndexSchema(posts: BlogPostLike[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE}/blog#blog`,
    url: `${SITE}/blog`,
    name: 'Father & Son Home Buyers Blog',
    description:
      'Guides on selling your house fast for cash in Southern California — foreclosure, probate, divorce, as-is, and more.',
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      '@id': `${SITE}/blog/${post.slug}#article`,
      headline: post.title,
      url: `${SITE}/blog/${post.slug}`,
      author: { '@id': SON_ID },
    })),
  };
}

/** BreadcrumbList for the blog index: Home → Blog. */
export function blogBreadcrumbSchema() {
  return breadcrumb([{ name: 'Blog', path: '/blog' }]);
}

/**
 * Service schema for a standalone service page (/cash-advance, /how-it-works).
 * Situation pages have their own builder below.
 */
export function servicePageSchema(service: {
  name: string;
  serviceType: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE}${service.path}#service`,
    name: service.name,
    serviceType: service.serviceType,
    description: service.description,
    url: `${SITE}${service.path}`,
    provider: { '@id': ORG_ID },
    areaServed: servedCountyNodes(),
  };
}

/** BreadcrumbList for a top-level page: Home → Page. */
export function pageBreadcrumbSchema(name: string, path: string) {
  return breadcrumb([{ name, path }]);
}

/**
 * /about-us — an AboutPage whose `mainEntity` is the business, plus the two
 * founders as full Person nodes. This is the page Google should use to connect
 * "Father & Son Home Buyers" to two real, named people.
 */
export function aboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${SITE}/about-us#webpage`,
    url: `${SITE}/about-us`,
    name: 'About Father & Son Home Buyers',
    description:
      'Meet Ahmad and Dustin Hajiali — the father and son behind Father & Son Home Buyers, buying houses for cash across Southern California.',
    isPartOf: { '@id': `${SITE}/#website` },
    inLanguage: 'en-US',
    mainEntity: { '@id': ORG_ID },
    about: TEAM.map((member) => ({
      '@id': member.name.startsWith('Ahmad') ? FATHER_ID : SON_ID,
    })),
  };
}

/** /contact — a ContactPage tied to the organization. */
export function contactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE}/contact#webpage`,
    url: `${SITE}/contact`,
    name: 'Contact Father & Son Home Buyers',
    description:
      'Request a no-obligation cash offer on your Southern California house. Call, text, or send us the property details.',
    isPartOf: { '@id': `${SITE}/#website` },
    inLanguage: 'en-US',
    mainEntity: { '@id': ORG_ID },
  };
}

interface CityLike {
  slug: string;
  name: string;
  county: string;
  state: string;
  description: string;
}

/** ISO 3166-2 region → country. Our cities are all California. */
const COUNTRY = 'US';

/** BreadcrumbList for a city page: Home → Service Areas → City. */
export function cityBreadcrumbSchema(city: CityLike) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Service Areas',
        item: `${SITE}/service-areas`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: city.name,
        item: `${SITE}/locations/${city.slug}`,
      },
    ],
  };
}

interface CountyHubLike {
  slug: string;
  name: string;
  proseName: string;
  metaDescription: string;
  /** Human county names this hub covers, e.g. ['Riverside County', ...]. */
  countyNames: string[];
}

/** BreadcrumbList for a county hub page: Home → Service Areas → County. */
export function countyBreadcrumbSchema(hub: CountyHubLike) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Service Areas',
        item: `${SITE}/service-areas`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: hub.name,
        item: `${SITE}/service-areas/${hub.slug}`,
      },
    ],
  };
}

/**
 * LocalBusiness scoped to a county/region hub page. Distinct `@id` from the
 * sitewide Organization and from the per-city LocalBusiness nodes, with
 * `areaServed` listing every county the hub covers.
 */
export function countyLocalBusinessSchema(hub: CountyHubLike) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE}/service-areas/${hub.slug}#business`,
    name: 'Father & Son Home Buyers',
    description: `Cash home buyers in ${hub.proseName}. ${hub.metaDescription}`,
    url: `${SITE}/service-areas/${hub.slug}`,
    telephone: PHONE,
    email: EMAIL,
    logo: LOGO,
    image: LOGO,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'CA',
      addressCountry: COUNTRY,
    },
    areaServed: hub.countyNames.map(countyAreaNode),
    serviceType: [
      'Cash Home Buying',
      'As-Is Home Purchase',
      'Pre-Foreclosure Home Purchase',
    ],
  };
}

interface SituationLike {
  slug: string;
  name: string;
  h1: string;
  metaDescription: string;
}

/** BreadcrumbList for a situation page: Home → Situation. */
export function situationBreadcrumbSchema(situation: SituationLike) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: situation.name,
        item: `${SITE}/situations/${situation.slug}`,
      },
    ],
  };
}

/**
 * Service schema for a situation page — describes the specific service (e.g.
 * buying a house in foreclosure) provided by the sitewide Organization across
 * the counties we serve. Its `provider` points at the Organization `@id` from
 * index.html rather than redefining it.
 */
export function situationServiceSchema(situation: SituationLike) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: situation.h1,
    serviceType: `${situation.name} home purchase`,
    description: situation.metaDescription,
    url: `${SITE}/situations/${situation.slug}`,
    provider: { '@id': ORG_ID },
    areaServed: servedCountyNodes(),
  };
}

/** BreadcrumbList for the instant-offer estimator: Home → Instant Offer. */
export function instantOfferBreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Instant Cash Offer Estimate',
        item: `${SITE}/instant-offer`,
      },
    ],
  };
}

/**
 * WebApplication node for the instant-offer estimator — a free interactive
 * tool provided by the sitewide Organization.
 */
export function instantOfferWebAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Instant Cash Offer Request',
    url: `${SITE}/instant-offer`,
    description:
      'Free 60-second tool for Southern California homeowners to request a real cash offer for their house — priced individually and delivered within 24 hours.',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: 'Father & Son Home Buyers',
    },
  };
}

/**
 * LocalBusiness scoped to a single city page. Distinct `@id` from the sitewide
 * Organization so it never duplicates or conflicts with it.
 */
export function cityLocalBusinessSchema(city: CityLike) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE}/locations/${city.slug}#business`,
    name: 'Father & Son Home Buyers',
    description: `Cash home buyers in ${city.name}, ${city.state}. ${city.description}`,
    url: `${SITE}/locations/${city.slug}`,
    telephone: PHONE,
    email: EMAIL,
    logo: LOGO,
    image: LOGO,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.state,
      addressCountry: COUNTRY,
    },
    areaServed: cityAreaNode(city.slug, city.name, city.county),
    serviceType: [
      'Cash Home Buying',
      'As-Is Home Purchase',
      'Pre-Foreclosure Home Purchase',
    ],
  };
}
