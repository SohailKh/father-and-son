import { Container } from '../components/layout';
import { CTASection } from '../components/sections';
import { useSEO } from '../hooks/useSEO';
import {
  usePageSchema,
  servicePageSchema,
  pageBreadcrumbSchema,
} from '../lib/schema';

const steps = [
  {
    number: '01',
    title: 'Contact Us',
    description: 'Fill out our simple form or give us a call. Tell us about your property — any condition, any situation. There\'s no obligation.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'We Visit Your Property',
    description: 'We\'ll schedule a quick, no-pressure visit to see your property in person. This helps us give you the most accurate and fair offer.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Get Your Offer',
    description: 'After seeing your property, we\'ll present you with a fair, honest cash offer. No repairs needed — we buy as-is.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Choose Your Close Date',
    description: 'Accept the offer and pick the closing date that works for you — as fast as 14 days or whenever you\'re ready. You\'re in control.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Get Paid',
    description: 'Close with a reputable title company. Walk away with cash in hand — no fees, no commissions, no hassle.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const benefits = [
  'Cash offer within 24 hours',
  'Close in as little as 14 days',
  'No fees or commissions',
  'Sell as-is, no repairs needed',
  '100% transparent process',
];

export function HowItWorksPage() {
  useSEO({
    title: 'How It Works | Sell Your House for Cash | Father & Son',
    description: 'Simple 5-step process: contact us, we visit, get your offer, sign, and close in as little as 14 days. No repairs or showings needed.',
    canonical: 'https://fathersonhomes.com/how-it-works',
  });

  // Goes through the same injector as every other page so there is exactly one
  // managed set of page-level JSON-LD and nothing can be left behind on a route
  // change (the audit's root schema problem was duplicate, orphaned blocks).
  usePageSchema([
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      'name': 'How to Sell Your House for Cash',
      'description': 'Our 5-step process for selling your Southern California home for cash — no repairs, no fees, no agent commissions.',
      'totalTime': 'P14D',
      'step': [
        { '@type': 'HowToStep', 'position': 1, 'name': 'Contact Us', 'text': 'Fill out our simple form or give us a call. Tell us about your property — any condition, any situation. There\'s no obligation.' },
        { '@type': 'HowToStep', 'position': 2, 'name': 'We Visit Your Property', 'text': 'We\'ll schedule a quick, no-pressure visit to see your property in person. This helps us give you the most accurate and fair offer.' },
        { '@type': 'HowToStep', 'position': 3, 'name': 'Get Your Cash Offer', 'text': 'After seeing your property, we\'ll present you with a fair, honest cash offer within 24 hours. No repairs needed — we buy as-is.' },
        { '@type': 'HowToStep', 'position': 4, 'name': 'Choose Your Close Date', 'text': 'Accept the offer and pick the closing date that works for you — as fast as 14 days or whenever you\'re ready. You\'re in control.' },
        { '@type': 'HowToStep', 'position': 5, 'name': 'Get Paid', 'text': 'Close with a reputable title company. Walk away with cash in hand — no fees, no commissions, no hassle.' },
      ],
    },
    servicePageSchema({
      name: 'Sell Your House Fast for Cash',
      serviceType: 'Cash home purchase',
      description:
        'Get a no-obligation cash offer within 24 hours and close on your timeline — often in as little as 14 days, with no repairs, fees, or agent commissions.',
      path: '/how-it-works',
    }),
    pageBreadcrumbSchema('How It Works', '/how-it-works'),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-oatmeal/50 to-linen">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-espresso/20" />
              <span className="text-sm font-medium tracking-warm text-driftwood">
                Simple & Transparent
              </span>
              <div className="h-px w-8 bg-espresso/20" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-espresso mb-6">
              How to Sell Your House for Cash: Our 5-Step Process
            </h1>
            <p className="text-lg text-driftwood max-w-2xl mx-auto">
              Selling your house for cash should be simple. Here's our straightforward process — no surprises, no hidden steps, no agent commissions.
            </p>
          </div>
        </Container>
      </section>

      {/* Steps Section */}
      <section className="py-16 md:py-24">
        <Container>
          {/* First 4 steps in 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {steps.slice(0, 4).map((step) => (
              <div
                key={step.number}
                className="card-warm p-8 md:p-10 relative"
              >
                <span className="absolute top-6 right-6 text-sm font-medium text-terracotta bg-terracotta/10 px-3 py-1 rounded-full">
                  Step {step.number}
                </span>
                <div className="text-driftwood mb-6">
                  {step.icon}
                </div>
                <h3 className="font-serif text-2xl font-medium text-espresso mb-4">
                  {step.title}
                </h3>
                <p className="text-driftwood leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Step 5 centered below */}
          <div className="mt-8 lg:mt-12 max-w-md mx-auto">
            <div className="card-warm p-8 md:p-10 relative">
              <span className="absolute top-6 right-6 text-sm font-medium text-terracotta bg-terracotta/10 px-3 py-1 rounded-full">
                Step {steps[4].number}
              </span>
              <div className="text-driftwood mb-6">
                {steps[4].icon}
              </div>
              <h3 className="font-serif text-2xl font-medium text-espresso mb-4">
                {steps[4].title}
              </h3>
              <p className="text-driftwood leading-relaxed">
                {steps[4].description}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-espresso">
        <Container>
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-cream mb-4">
              Our Promise to You
            </h2>
            <p className="text-cream/70 max-w-xl mx-auto">
              When you work with Father & Son Home Buyers, you get a team that treats you like family.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 bg-cream/10 px-5 py-3 rounded-full"
              >
                <svg className="w-5 h-5 text-terracotta flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-cream text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
