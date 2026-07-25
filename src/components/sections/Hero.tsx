import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../layout/Container';
import { useAddressAutocomplete } from '../../hooks/useAddressAutocomplete';
import { submitLead } from '../../lib/submitLead';
import { validateLeadForm, hasErrors, type ValidationErrors } from '../../lib/validateLead';

// Self-hosted hero image for faster loading & better Core Web Vitals
const HERO_IMAGE = '/hero-home.jpg';

export function Hero() {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    name: '',
    phone: '',
    email: '',
    situation: '',
    timeline: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const addressInputRef = useAddressAutocomplete({
    onPlaceSelected: (selectedAddress, city) => {
      setFormData((prev) => ({ ...prev, address: selectedAddress, city }));
      setErrors((prev) => ({ ...prev, address: undefined }));
    },
  });

  // Sync input value when address state changes
  useEffect(() => {
    if (addressInputRef.current && addressInputRef.current.value !== formData.address) {
      addressInputRef.current.value = formData.address;
    }
  }, [formData.address]);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'phone' ? formatPhone(value) : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);

    const validationErrors = validateLeadForm(formData);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) return;

    setIsSubmitting(true);
    const result = await submitLead({ ...formData, source: 'hero' });
    setIsSubmitting(false);

    setSubmitStatus({ type: result.success ? 'success' : 'error', message: result.message });

    if (result.success) {
      setFormData({ address: '', city: '', name: '', phone: '', email: '', situation: '', timeline: '' });
      if (addressInputRef.current) addressInputRef.current.value = '';
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Southern California home exterior — we buy houses for cash in OC, LA, and the Inland Empire"
          className="w-full h-full object-cover"
          width={1200}
          height={800}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/80 via-espresso/60 to-espresso/40" />
      </div>

      <Container size="wide" className="relative z-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="bg-espresso/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-white">
            {/* Logo Badge */}
            <div className="mb-6 flex justify-center">
              <img
                src="/logo.png"
                alt="Father & Son Home Buyers logo — cash home buyers in Southern California"
                className="h-40 w-auto rounded-lg shadow-lg"
                width={512}
                height={512}
                loading="eager"
                decoding="async"
              />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/20 px-3 py-1.5 rounded-full">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Local Family-Owned
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/20 px-3 py-1.5 rounded-full">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No Hidden Fees
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/20 px-3 py-1.5 rounded-full">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Sell As-Is
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/20 px-3 py-1.5 rounded-full">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                We Buy Houses
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-snug mb-4">
              Father &amp; Son Home Buyers — Sell Your House for Cash in Southern California
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-white/90 mb-4 leading-relaxed">
              Get a fair, transparent cash offer within 24 hours. Close in as little as 14 days — or on your schedule. No fees. No pressure. No games.
            </p>

            {/* Tagline */}
            <p className="text-base italic text-white/80 mb-5 border-l-2 border-terracotta pl-3">
              "From our family to yours — a better way to sell"
            </p>

            {/* Bullet Points */}
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-terracotta flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Cash offer within 24 hours — sell as-is</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-terracotta flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>We handle cleanout — leave what you don't want</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-terracotta flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Zero fees, zero commissions</span>
              </li>
            </ul>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
            {submitStatus?.type === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-medium text-espresso mb-3">
                  Thank You!
                </h2>
                <p className="text-driftwood mb-6">
                  {submitStatus.message}
                </p>
                <a
                  href="tel:+19495412003"
                  className="btn-terracotta px-6 py-3 rounded-md text-sm font-medium inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call or Text (949) 541-2003
                </a>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="font-serif text-2xl md:text-3xl font-medium text-espresso mb-2">
                    Get Your Cash Offer
                  </h2>
                  <p className="text-driftwood">
                    Tell us about your property. No obligation — just a fair offer.
                  </p>
                </div>

                {submitStatus?.type === 'error' && (
                  <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{submitStatus.message}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot for spam */}
                  <input type="text" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

                  <div>
                    <label htmlFor="hero-address" className="block text-sm font-medium text-driftwood mb-2">
                      Property Address *
                    </label>
                    <input
                      ref={addressInputRef}
                      id="hero-address"
                      name="address"
                      placeholder="123 Main St, Santa Ana, CA"
                      defaultValue={formData.address}
                      onChange={handleChange}
                      autoComplete="off"
                      className={`input-warm w-full h-12 text-base ${errors.address ? 'border-red-400' : ''}`}
                    />
                    {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                  </div>

                  <div>
                    <label htmlFor="hero-name" className="block text-sm font-medium text-driftwood mb-2">
                      Your Name *
                    </label>
                    <input
                      id="hero-name"
                      name="name"
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={handleChange}
                      className={`input-warm w-full h-12 text-base ${errors.name ? 'border-red-400' : ''}`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="hero-phone" className="block text-sm font-medium text-driftwood mb-2">
                      Phone Number *
                    </label>
                    <input
                      id="hero-phone"
                      name="phone"
                      type="tel"
                      placeholder="(949) 555-1234"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`input-warm w-full h-12 text-base ${errors.phone ? 'border-red-400' : ''}`}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="hero-email" className="block text-sm font-medium text-driftwood mb-2">
                      Email Address <span className="text-driftwood/60">(Optional)</span>
                    </label>
                    <input
                      id="hero-email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-warm w-full h-12 text-base ${errors.email ? 'border-red-400' : ''}`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="hero-situation" className="block text-sm font-medium text-driftwood mb-2">
                        Property Situation
                      </label>
                      <select
                        id="hero-situation"
                        name="situation"
                        value={formData.situation}
                        onChange={handleChange}
                        className="input-warm w-full h-12 text-base"
                      >
                        <option value="">Select situation</option>
                        <option value="selling">Ready to Sell</option>
                        <option value="inherited">Inherited Property</option>
                        <option value="foreclosure">Facing Foreclosure</option>
                        <option value="divorce">Divorce</option>
                        <option value="relocating">Relocating</option>
                        <option value="repairs">Needs Repairs</option>
                        <option value="tenant">Problem Tenants</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="hero-timeline" className="block text-sm font-medium text-driftwood mb-2">
                        Timeline to Sell
                      </label>
                      <select
                        id="hero-timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="input-warm w-full h-12 text-base"
                      >
                        <option value="">Select timeline</option>
                        <option value="asap">ASAP</option>
                        <option value="30-60">30–60 days</option>
                        <option value="60+">60+ days</option>
                        <option value="unsure">Not sure yet</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-terracotta w-full h-12 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Get My Cash Offer
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-4 text-xs text-driftwood text-center">
                  By submitting this form, you consent to receive calls, texts, and emails from Father & Son Home Buyers regarding your property. Message & data rates may apply. You can opt out at any time.
                </p>

                <p className="mt-3 text-sm text-driftwood text-center">
                  Prefer a quicker start?{' '}
                  <Link to="/instant-offer" className="text-terracotta font-medium hover:underline">
                    Request your cash offer in 60 seconds
                  </Link>
                  .
                </p>
              </>
            )}

            {/* Trust Signals */}
            <div className="mt-6 pt-6 border-t border-espresso/10">
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2 text-sm text-driftwood">
                  <svg className="w-5 h-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  24-Hour Offer
                </div>
                <div className="flex items-center gap-2 text-sm text-driftwood">
                  <svg className="w-5 h-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  No Obligation
                </div>
                <div className="flex items-center gap-2 text-sm text-driftwood">
                  <svg className="w-5 h-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  No Hidden Fees
                </div>
                <div className="flex items-center gap-1.5 text-sm text-driftwood">
                  <span className="flex text-yellow-400 text-xs">★★★★★</span>
                  <span>5.0 on Google</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
