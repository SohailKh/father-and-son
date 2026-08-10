import { useSEO } from '../hooks/useSEO';
import {
  usePageSchema,
  homeLocalBusinessSchema,
  serviceAreaSchema,
} from '../lib/schema';
import {
  Hero,
  ValueProps,
  HowItWorks,
  WhySellToUs,
  CashAdvance,
  MeetTheFamily,
  Testimonials,
  ServiceAreas,
  SituationsGrid,
  CTASection,
} from '../components/sections';

export function HomePage() {
  useSEO({
    title: 'Father & Son Home Buyers | Sell Your House Fast for Cash',
    description: 'Get a fair cash offer within 24 hours from Father & Son Home Buyers. No repairs, no fees, no agents. Serving Orange County, LA & the Inland Empire.',
    canonical: 'https://fathersonhomes.com/',
  });

  // The business node points areaServed at #serviceArea, so the Place node has
  // to ship on this page too for the reference to resolve.
  usePageSchema([homeLocalBusinessSchema(), serviceAreaSchema()]);

  return (
    <>
      <Hero />
      <ValueProps />
      <HowItWorks />
      <WhySellToUs />
      <SituationsGrid />
      <CashAdvance />
      <MeetTheFamily />
      <Testimonials />
      <ServiceAreas />
      <CTASection />
    </>
  );
}
