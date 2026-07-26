import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Analytics } from './components/Analytics';

// Eager-load HomePage (above the fold, most traffic)
import { HomePage } from './pages';

// Lazy-load all other pages for smaller initial bundle
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage').then(m => ({ default: m.AboutUsPage })));
const ServiceAreasPage = lazy(() => import('./pages/ServiceAreasPage').then(m => ({ default: m.ServiceAreasPage })));
const FAQPage = lazy(() => import('./pages/FAQPage').then(m => ({ default: m.FAQPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const CashAdvancePage = lazy(() => import('./pages/CashAdvancePage').then(m => ({ default: m.CashAdvancePage })));
const InstantOfferPage = lazy(() => import('./pages/InstantOfferPage').then(m => ({ default: m.InstantOfferPage })));
const CityPage = lazy(() => import('./pages/CityPage').then(m => ({ default: m.CityPage })));
const CountyHubPage = lazy(() => import('./pages/CountyHubPage').then(m => ({ default: m.CountyHubPage })));
const SituationPage = lazy(() => import('./pages/SituationPage').then(m => ({ default: m.SituationPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Analytics />
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="how-it-works" element={<HowItWorksPage />} />
            <Route path="about-us" element={<AboutUsPage />} />
            <Route path="service-areas" element={<ServiceAreasPage />} />
            <Route path="service-areas/:slug" element={<CountyHubPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="cash-advance" element={<CashAdvancePage />} />
            <Route path="instant-offer" element={<InstantOfferPage />} />
            <Route path="locations/:slug" element={<CityPage />} />
            <Route path="situations/:slug" element={<SituationPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogPostPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="terms-of-service" element={<TermsOfServicePage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
