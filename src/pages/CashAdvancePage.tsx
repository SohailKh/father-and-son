import { Link } from 'react-router-dom';
import { Container } from '../components/layout';
import { CTASection } from '../components/sections';
import { useSEO } from '../hooks/useSEO';
import {
  usePageSchema,
  servicePageSchema,
  pageBreadcrumbSchema,
} from '../lib/schema';

const eligibilityItems = [
  {
    title: 'Signed purchase agreement',
    description: 'We need to be under contract before any advance is provided.',
  },
  {
    title: 'Clear path to closing',
    description: 'Title, property condition, and timeline all need to be in order.',
  },
  {
    title: 'Advance amount based on expected net',
    description: 'The advance is capped as a percentage of your expected seller proceeds.',
  },
];

const useCases = [
  { label: 'Moving costs', icon: '🚚' },
  { label: 'Security deposits', icon: '🏠' },
  { label: 'Urgent repairs', icon: '🔧' },
  { label: 'Catching up on bills', icon: '📋' },
  { label: 'Storage fees', icon: '📦' },
  { label: 'Travel expenses', icon: '✈️' },
];

export function CashAdvancePage() {
  useSEO({
    title: 'Cash Advance Before Closing | Father & Son Home Buyers',
    description: 'Need cash before your home closes? Father & Son Home Buyers offers cash advances to qualifying sellers in Southern California. Learn how it works.',
    canonical: 'https://fathersonhomes.com/cash-advance',
  });

  // The differentiator no competitor leads with — give it a real Service entity.
  usePageSchema([
    servicePageSchema({
      name: 'Cash Advance Before Closing',
      serviceType: 'Cash advance to home sellers before closing',
      description:
        'Father & Son Home Buyers can advance eligible sellers cash before their home sale closes — for moving costs, deposits, urgent repairs, or bills that will not wait for closing day.',
      path: '/cash-advance',
    }),
    pageBreadcrumbSchema('Cash Advance', '/cash-advance'),
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
                For Eligible Sellers
              </span>
              <div className="h-px w-8 bg-espresso/20" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-espresso mb-6">
              Cash Advance
            </h1>
            <p className="text-lg text-driftwood max-w-2xl mx-auto">
              After we're under contract, we may be able to provide an advance so you can handle immediate expenses while we work toward closing.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Description */}
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-espresso mb-6">
                Designed for real-life transitions
              </h2>
              <p className="text-driftwood leading-relaxed mb-8">
                Life doesn't pause while you wait for closing day. Our cash advance option is designed for sellers who need to handle immediate expenses—whether it's moving, storage, travel, deposits, or critical home needs.
              </p>

              {/* Use Cases */}
              <div className="mb-8">
                <h3 className="font-serif text-xl font-medium text-espresso mb-4">
                  What can you use it for?
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {useCases.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 bg-oatmeal/50 px-4 py-3 rounded-lg"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm text-espresso">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link
                to="/contact"
                className="btn-terracotta px-8 py-3 rounded-md text-sm font-medium inline-flex items-center justify-center gap-2"
              >
                See if I Qualify
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Right: Eligibility */}
            <div>
              <div className="card-warm p-8 md:p-10">
                <h3 className="font-serif text-2xl font-medium text-espresso mb-6">
                  Eligibility Requirements
                </h3>
                <div className="space-y-6">
                  {eligibilityItems.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-8 h-8 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-terracotta" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-espresso mb-1">{item.title}</h4>
                        <p className="text-sm text-driftwood">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Transparency Note */}
                <div className="mt-8 pt-6 border-t border-espresso/10">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-driftwood">
                      <strong className="text-espresso">Full transparency:</strong> We'll explain the numbers and any conditions in writing before you accept. No surprises, no hidden terms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-oatmeal/30">
        <Container>
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-espresso mb-4">
              How the Cash Advance Works
            </h2>
            <p className="text-driftwood max-w-2xl mx-auto">
              A simple, transparent process from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-serif text-xl font-medium text-terracotta">1</span>
              </div>
              <h3 className="font-serif text-lg font-medium text-espresso mb-2">Sign Agreement</h3>
              <p className="text-sm text-driftwood">We sign the purchase agreement and confirm eligibility</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-serif text-xl font-medium text-terracotta">2</span>
              </div>
              <h3 className="font-serif text-lg font-medium text-espresso mb-2">Review Terms</h3>
              <p className="text-sm text-driftwood">We explain the advance amount and any conditions in writing</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-serif text-xl font-medium text-terracotta">3</span>
              </div>
              <h3 className="font-serif text-lg font-medium text-espresso mb-2">Receive Funds</h3>
              <p className="text-sm text-driftwood">Once approved, funds are typically provided quickly</p>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-espresso mb-4">
              Common Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="card-warm p-6">
              <h3 className="font-serif text-lg font-medium text-espresso mb-2">
                Is it a loan? Do I pay interest?
              </h3>
              <p className="text-driftwood">
                It's not set up like a traditional personal loan. Any advance terms are disclosed in writing as part of the deal.
              </p>
            </div>

            <div className="card-warm p-6">
              <h3 className="font-serif text-lg font-medium text-espresso mb-2">
                What if the sale doesn't close?
              </h3>
              <p className="text-driftwood">
                If the transaction doesn't go through, the cash advance does need to be returned. This is spelled out clearly upfront before you accept any advance.
              </p>
            </div>
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

      <CTASection />
    </>
  );
}
