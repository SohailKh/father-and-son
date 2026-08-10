import { useParams, Link } from 'react-router-dom';
import { Container } from '../components/layout';
import { CTASection } from '../components/sections';
import { RichText, RichSpan } from '../components/ui';
import { useSEO } from '../hooks/useSEO';
import {
  usePageSchema,
  cityBreadcrumbSchema,
  cityLocalBusinessSchema,
  faqPageSchema,
} from '../lib/schema';
import { getCityBySlug, getNearbyCities } from '../lib/cities';
import { getCityGuide } from '../lib/city-guides';
import { getHubForCity } from '../lib/counties';
import { getSituationsForCity } from '../lib/situations';

export function CityPage() {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? getCityBySlug(slug) : undefined;
  // Long-form local copy, where we have it for this city.
  const guide = slug ? getCityGuide(slug) : undefined;
  const nearbyCities = slug ? getNearbyCities(slug) : [];
  const countyHub = city ? getHubForCity(city) : undefined;
  const citySituations = slug ? getSituationsForCity(slug) : [];

  // Local FAQ built from this city's own data, so the copy varies city-to-city
  // instead of shipping identical boilerplate across every location page.
  const localFaqs = city
    ? [
        {
          question: `How fast can you buy my house in ${city.name}?`,
          answer: `We can present a fair cash offer on your ${city.name} home within 24 hours and close in as little as 14 days. Because we buy with our own funds — no lender, no appraisal, no financing contingency — the closing date is yours to choose, whether you need to be out in two weeks or a couple of months.`,
        },
        {
          question: `Do you buy houses in any condition in ${city.name}?`,
          answer: `Yes. From ${city.neighborhoods[0]} to ${
            city.neighborhoods[city.neighborhoods.length - 1]
          }, we buy ${city.name} homes exactly as they sit. You never make repairs, clean out the property, or stage anything — we take it as-is and handle everything after closing.`,
        },
        {
          question: `What situations do you help ${city.name} homeowners with?`,
          answer: `Common reasons ${city.name} owners reach out include ${city.situations
            .slice(0, 3)
            .join(', ')}, and more. We approach every situation without judgment and shape the sale around what you actually need.`,
        },
        {
          question: `Can I get a cash advance before closing in ${city.name}?`,
          answer: `Often, yes. Once we're under contract on your ${city.name} home, eligible sellers can receive a cash advance to cover moving costs, deposits, or urgent bills before the sale is final. Every term is put in writing before you accept anything.`,
        },
        {
          question: `Are there any fees or commissions when I sell in ${city.name}?`,
          answer: `None. There are no agent commissions, no closing costs, and no hidden fees. The cash offer we agree on for your ${city.name} property is exactly what you walk away with.`,
        },
      ]
    : [];

  useSEO({
    title: city
      ? `Sell My House Fast in ${city.name}, CA | Father & Son`
      : 'City Not Found | Father & Son',
    description: city
      ? `Get a fair cash offer for your ${city.name} home in 24 hours. No repairs, no fees, no agents. Father & Son Home Buyers serves ${city.county}.`
      : 'Page not found.',
    canonical: city ? `https://fathersonhomes.com/locations/${city.slug}` : undefined,
  });

  // City pages emit a BreadcrumbList plus a LocalBusiness scoped to this city.
  // The city LocalBusiness has its own @id, so it never duplicates the sitewide
  // Organization from index.html.
  usePageSchema(
    city
      ? [
          cityBreadcrumbSchema(city),
          cityLocalBusinessSchema(city),
          faqPageSchema(localFaqs),
        ]
      : []
  );

  if (!city) {
    return (
      <section className="py-24">
        <Container size="narrow">
          <div className="text-center">
            <h1 className="font-serif text-4xl font-medium text-espresso mb-4">City Not Found</h1>
            <p className="text-driftwood mb-8">We couldn't find that location. View all our service areas below.</p>
            <Link to="/service-areas" className="btn-terracotta px-8 py-3 rounded-md text-sm font-medium inline-flex items-center gap-2">
              View Service Areas
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-oatmeal/50 to-linen">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-espresso/20" />
              <span className="text-sm font-medium tracking-warm text-driftwood">
                {city.county}, {city.state}
              </span>
              <div className="h-px w-8 bg-espresso/20" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-espresso mb-6">
              Sell Your House Fast for Cash in {city.name}
            </h1>
            <p className="text-lg text-driftwood max-w-2xl mx-auto mb-10">
              {city.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn-terracotta px-8 py-3 rounded-md text-sm font-medium inline-flex items-center justify-center gap-2"
              >
                Get My Cash Offer
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href="tel:+19495412003"
                className="btn-secondary px-8 py-3 rounded-md text-sm font-medium inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call or Text (949) 541-2003
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* How It Works - Quick Version */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-espresso mb-4">
              How We Buy Your {city.name} Home
            </h2>
            <p className="text-driftwood max-w-xl mx-auto">
              Three simple steps — no repairs, no fees, no surprises.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Tell Us About Your Home',
                body: `Fill out our form or call us about your ${city.name} property. Takes less than 5 minutes.`,
              },
              {
                step: '02',
                title: 'Receive a Cash Offer',
                body: "We'll present a fair, no-obligation cash offer within 24 hours — no walkthroughs, no appraisals.",
              },
              {
                step: '03',
                title: 'Close on Your Timeline',
                body: 'Accept the offer and pick your closing date. As fast as 14 days, or whenever works for you.',
              },
            ].map((item) => (
              <div key={item.step} className="card-warm p-8 text-center">
                <div className="font-serif text-5xl font-medium text-terracotta/30 mb-4">{item.step}</div>
                <h3 className="font-serif text-xl font-medium text-espresso mb-3">{item.title}</h3>
                <p className="text-driftwood text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Situations We Help With */}
      <section className="py-16 md:py-20 bg-oatmeal/30">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-espresso/20" />
                <span className="text-sm font-medium tracking-warm text-driftwood">We Can Help</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-espresso mb-4">
                Situations We Buy In {city.name}
              </h2>
              <p className="text-driftwood mb-4">
                {city.blurb} We approach every situation without judgment — just honest, fair offers.
              </p>
              <p className="text-driftwood mb-8">
                No two {city.name} sales look the same. Whether your home is in{' '}
                {city.neighborhoods.slice(0, 2).join(' or ')} or anywhere else in{' '}
                {city.county}, we buy directly and pay cash — so there are no agents,
                no financing fall-throughs, and no months of open-market waiting.
                These are the situations we handle most often here:
              </p>
              <ul className="space-y-3 mb-8">
                {city.situations.map((s) => (
                  <li key={s} className="flex items-start gap-3 text-driftwood">
                    <svg className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {s}
                  </li>
                ))}
              </ul>
              {/* Cross-links to the situation landing pages most relevant to
                  this city — reciprocal with each situation's own city links. */}
              {citySituations.length > 0 && (
                <div className="space-y-3 mb-8">
                  {citySituations.map((s) => (
                    <Link
                      key={s.slug}
                      to={`/situations/${s.slug}`}
                      className="card-warm p-4 flex items-center justify-between gap-4 hover:shadow-md transition-warm"
                    >
                      <div>
                        <span className="font-serif text-base font-medium text-espresso block">
                          {s.name}
                        </span>
                        <span className="text-xs text-driftwood">How we help {city.name} sellers</span>
                      </div>
                      <svg className="w-4 h-4 text-terracotta flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  ))}
                </div>
              )}
              <p className="text-driftwood text-sm">
                Dealing with something not on this list? It's likely we've seen it
                before.{' '}
                <Link to="/how-it-works" className="text-terracotta font-medium hover:underline">
                  See exactly how our process works
                </Link>{' '}
                or{' '}
                <Link to="/contact" className="text-terracotta font-medium hover:underline">
                  tell us about your {city.name} home
                </Link>
                .
              </p>
            </div>
            <div className="card-warm p-8">
              <h3 className="font-serif text-2xl font-medium text-espresso mb-6">
                Neighborhoods We Serve in {city.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {city.neighborhoods.map((n) => (
                  <span
                    key={n}
                    className="text-sm text-driftwood bg-oatmeal/60 px-3 py-1.5 rounded-full"
                  >
                    {n}
                  </span>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-espresso/10">
                <p className="text-sm text-driftwood mb-4">
                  Don't see your neighborhood? We likely buy there too — give us a call.
                </p>
                <a
                  href="tel:+19495412003"
                  className="text-terracotta font-medium text-sm hover:underline"
                >
                  (949) 541-2003
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* In-depth local guide — agency-written copy, where we have it. */}
      {guide && guide.length > 0 && (
        <section className="py-16 md:py-20">
          <Container size="narrow">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-espresso mb-4">
                Selling a House in {city.name}: What to Know
              </h2>
              <p className="text-driftwood">
                A closer look at this market, what we buy here, and who we help.
              </p>
            </div>
            <div className="prose-warm">
              {guide.map((section, i) => (
                <div key={i} className="mb-8">
                  {section.heading && (
                    <h3 className="font-serif text-2xl font-medium text-espresso mb-4 mt-10 first:mt-0">
                      {section.heading}
                    </h3>
                  )}
                  {section.body && <RichText text={section.body} />}
                  {section.bullets && (
                    <ul className="space-y-3 mb-4">
                      {section.bullets.map((bullet, j) => (
                        <li key={j} className="flex items-start gap-3 text-driftwood leading-relaxed">
                          <svg className="w-5 h-5 text-terracotta flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>
                            {bullet.lead && (
                              <strong className="font-medium text-espresso">{bullet.lead}: </strong>
                            )}
                            <RichSpan text={bullet.text} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.outro && <RichText text={section.outro} />}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Why Cash vs. Listing */}
      <section className="py-16 md:py-20 bg-oatmeal/20">
        <Container size="narrow">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-espresso mb-4">
              Cash Sale vs. Listing in {city.name}
            </h2>
            <p className="text-driftwood">Not every seller needs the same solution. Here's how we compare.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-espresso/10">
                  <th className="text-left py-3 pr-6 text-driftwood font-medium"></th>
                  <th className="py-3 px-4 text-center text-espresso font-medium">Father & Son</th>
                  <th className="py-3 pl-4 text-center text-driftwood font-medium">Traditional Listing</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Cash offer timeline', '24 hours', '2–4 weeks'],
                  ['Repairs required', 'None — buy as-is', 'Often required'],
                  ['Agent commissions', 'Zero', '5–6%'],
                  ['Closing costs', 'We cover them', 'Seller typically pays'],
                  ['Closing timeline', 'As fast as 14 days', '30–60+ days'],
                  ['Showings & open houses', 'None', 'Multiple required'],
                  ['Sale certainty', 'Guaranteed close', 'May fall through'],
                ].map(([feature, us, them]) => (
                  <tr key={feature} className="border-b border-espresso/5">
                    <td className="py-3 pr-6 text-driftwood">{feature}</td>
                    <td className="py-3 px-4 text-center text-terracotta font-medium">{us}</td>
                    <td className="py-3 pl-4 text-center text-driftwood/70">{them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-10">
            <p className="text-driftwood mb-4">
              Wondering what a cash offer on your {city.name} home might look like?
            </p>
            <Link
              to="/instant-offer"
              className="btn-terracotta px-8 py-3 rounded-md text-sm font-medium inline-flex items-center justify-center gap-2"
            >
              Request Your Cash Offer
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <p className="text-xs text-driftwood mt-3">
              Free, 60 seconds, no obligation — a real number within 24 hours.
            </p>
          </div>
        </Container>
      </section>

      {/* Cash Advance callout — a genuine differentiator, surfaced on every city page */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-espresso to-espresso/95">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-cream/20" />
                <span className="text-sm font-medium tracking-warm text-terracotta">
                  Cash Advance Available
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-cream mb-6">
                Need cash before your {city.name} home closes?
              </h2>
              <p className="text-lg text-cream/80 mb-8 leading-relaxed">
                It's something most cash buyers won't do: once we're under contract
                on your {city.name} property, eligible sellers can receive a cash
                advance to cover moving costs, deposits, storage, or urgent bills —
                before the sale is even final. We put every term in writing first, so
                there are no surprises.
              </p>
              <Link
                to="/cash-advance"
                className="btn-terracotta px-8 py-3 rounded-md text-sm font-medium inline-flex items-center justify-center gap-2"
              >
                See if I Qualify
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="card-warm bg-cream p-8 md:p-10 rounded-2xl shadow-warm-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl font-medium text-espresso mb-3">
                  Money in hand when you need it
                </h3>
                <p className="text-driftwood mb-6">
                  Life in {city.name} doesn't pause for closing day. A cash advance
                  helps you handle what's urgent while we work toward the finish line.
                </p>
                <div className="border-t border-espresso/10 pt-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="font-serif text-2xl font-medium text-terracotta">Fast</div>
                      <div className="text-xs text-driftwood">Funding</div>
                    </div>
                    <div>
                      <div className="font-serif text-2xl font-medium text-terracotta">Clear</div>
                      <div className="text-xs text-driftwood">Terms</div>
                    </div>
                    <div>
                      <div className="font-serif text-2xl font-medium text-terracotta">Simple</div>
                      <div className="text-xs text-driftwood">Process</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Local FAQ */}
      <section className="py-16 md:py-20">
        <Container size="narrow">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-espresso mb-4">
              Selling a House in {city.name}: Common Questions
            </h2>
            <p className="text-driftwood">
              Straight answers for {city.name} homeowners weighing a cash sale.
            </p>
          </div>
          <div className="space-y-6">
            {localFaqs.map((faq) => (
              <div key={faq.question} className="card-warm p-6">
                <h3 className="font-serif text-lg font-medium text-espresso mb-2">
                  {faq.question}
                </h3>
                <p className="text-driftwood leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/faq"
              className="btn-secondary px-6 py-3 rounded-md text-sm font-medium inline-flex items-center justify-center gap-2"
            >
              View All FAQs
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </Container>
      </section>

      {/* Nearby Areas We Serve */}
      {nearbyCities.length > 0 && (
        <section className="py-16 md:py-20 bg-oatmeal/30">
          <Container>
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-espresso mb-4">
                We Also Buy Houses in These Nearby Cities
              </h2>
              <p className="text-driftwood max-w-xl mx-auto">
                Father &amp; Son Home Buyers serves homeowners across Southern California. Explore more of our service areas.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {nearbyCities.map((nearby) => (
                <Link
                  key={nearby.slug}
                  to={`/locations/${nearby.slug}`}
                  className="card-warm p-5 text-center hover:shadow-md transition-warm"
                >
                  <h3 className="font-serif text-lg font-medium text-espresso mb-1">
                    {nearby.name}
                  </h3>
                  <p className="text-xs text-driftwood">{nearby.county}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Breadcrumb nav back to service areas */}
      <section className="py-8 bg-oatmeal/20">
        <Container>
          <div className="flex flex-wrap items-center gap-2 text-sm text-driftwood">
            <Link to="/service-areas" className="hover:text-terracotta transition-warm">
              Service Areas
            </Link>
            <span>/</span>
            {countyHub ? (
              <Link
                to={`/service-areas/${countyHub.slug}`}
                className="hover:text-terracotta transition-warm"
                title={`We buy houses across ${countyHub.name}`}
              >
                {countyHub.name}
              </Link>
            ) : (
              <span>{city.county}</span>
            )}
            <span>/</span>
            <span className="text-espresso">{city.name}</span>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
