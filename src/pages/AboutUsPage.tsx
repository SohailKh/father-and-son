import { Container } from '../components/layout';
import { CTASection, Testimonials } from '../components/sections';
import { useSEO } from '../hooks/useSEO';
import {
  usePageSchema,
  aboutPageSchema,
  pageBreadcrumbSchema,
} from '../lib/schema';
import { TEAM, CREDENTIALS } from '../lib/reviews';

export function AboutUsPage() {
  useSEO({
    title: 'About Us | Ahmad & Dustin Hajiali | Father & Son Home Buyers',
    description: 'Meet Ahmad and Dustin Hajiali — the father-and-son team behind Father & Son Home Buyers. 20+ years in construction and 4,000+ real estate transactions.',
    canonical: 'https://fathersonhomes.com/about-us',
  });

  usePageSchema([aboutPageSchema(), pageBreadcrumbSchema('About Us', '/about-us')]);

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-oatmeal/50 to-linen">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-espresso/20" />
              <span className="text-sm font-medium tracking-warm text-driftwood">
                Meet The Family
              </span>
              <div className="h-px w-8 bg-espresso/20" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-espresso mb-6">
              Meet Ahmad &amp; Dustin Hajiali
            </h1>
            <p className="text-lg text-driftwood max-w-2xl mx-auto">
              We're not a faceless corporation — we're a local, family-owned father-and-son team. Together we combine 20+ years of construction with more than 4,000 real estate transactions to help homeowners like you.
            </p>
          </div>
        </Container>
      </section>

      {/* Team Section — real people, real bios */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-espresso mb-4">
              Our Team
            </h2>
            <p className="text-driftwood max-w-xl mx-auto">
              A father and son who actually pick up the phone — and personally evaluate every home we buy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 max-w-4xl mx-auto">
            {TEAM.map((member) => (
              <div key={member.name} className="text-center md:text-left">
                <img
                  src={member.photo}
                  alt={member.photoAlt}
                  className="w-40 h-40 rounded-2xl shadow-warm-lg object-cover mx-auto md:mx-0 mb-5"
                  loading="lazy"
                  decoding="async"
                  width={160}
                  height={160}
                />
                <h3 className="font-serif text-2xl font-medium text-espresso">
                  {member.name}
                </h3>
                <p className="text-sm font-medium tracking-warm text-terracotta mb-3">
                  {member.role}
                </p>
                <p className="text-driftwood leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why We Do This + Credentials */}
      <section className="py-16 md:py-24 bg-oatmeal/30">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-espresso mb-6">
                Why We Do This
              </h2>
              <div className="space-y-4 text-driftwood leading-relaxed">
                <p>
                  We founded Father & Son Home Buyers to give homeowners a straightforward, transparent way to sell properties that may need repairs, renovations, or extra attention.
                </p>
                <p>
                  As a local, family-owned business, our goal is simple: provide homeowners in our community with honest information, clear expectations, and a respectful selling experience from beginning to end.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-warm">
              <h3 className="font-serif text-xl font-medium text-espresso mb-5">
                Credentials & Experience
              </h3>
              <ul className="space-y-4">
                {CREDENTIALS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-driftwood leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-espresso mb-4">
              What We Stand For
            </h2>
            <p className="text-driftwood max-w-xl mx-auto">
              Our values guide every interaction and every offer we make.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-medium text-espresso mb-2">Integrity</h3>
              <p className="text-driftwood text-sm">
                We do what we say we'll do. No hidden fees, no last-minute changes, no games.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-medium text-espresso mb-2">Transparency</h3>
              <p className="text-driftwood text-sm">
                We show you exactly how we calculate our offers. No secrets, no surprises.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-medium text-espresso mb-2">Compassion</h3>
              <p className="text-driftwood text-sm">
                We treat every homeowner like family. Your situation matters to us.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Testimonials />

      <CTASection />
    </>
  );
}
