import { LeadForm } from '../components/sections';
import { useSEO } from '../hooks/useSEO';
import {
  usePageSchema,
  contactPageSchema,
  pageBreadcrumbSchema,
} from '../lib/schema';

export function ContactPage() {
  useSEO({
    title: 'Get Your Cash Offer — Contact Father & Son Home Buyers',
    description: 'Ready to sell your Southern California home for cash? Contact Father & Son Home Buyers today. Get a fair, no-obligation offer within 24 hours.',
    canonical: 'https://fathersonhomes.com/contact',
  });

  usePageSchema([contactPageSchema(), pageBreadcrumbSchema('Contact', '/contact')]);

  return (
    <>
      <LeadForm as="h1" />
    </>
  );
}
