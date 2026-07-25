import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/layout';
import { CTASection } from '../components/sections';
import { useSEO } from '../hooks/useSEO';
import { useAddressAutocomplete } from '../hooks/useAddressAutocomplete';
import { submitLead } from '../lib/submitLead';
import {
  usePageSchema,
  instantOfferBreadcrumbSchema,
  instantOfferWebAppSchema,
  faqPageSchema,
} from '../lib/schema';
import {
  CONDITION_OPTIONS,
  SITUATION_OPTIONS,
  findCityByName,
  type Condition,
  type SituationKey,
} from '../lib/instantOffer';
import { countyHubs } from '../lib/counties';

const BED_CHOICES = [1, 2, 3, 4, 5];
const BATH_CHOICES = [1, 2, 3, 4];

/** Best-effort city extraction from a hand-typed address ("123 Main St, Anaheim, CA"). */
function cityFromTypedAddress(address: string): string {
  const parts = address.split(',').map((p) => p.trim());
  for (const part of parts.slice(1)) {
    if (findCityByName(part)) return part;
  }
  return '';
}

const FAQS = [
  {
    question: "Why don't you show an instant number on screen?",
    answer:
      "Because automated estimates are guesses. Online tools price your home off broad averages — they can't see your street, your lot, or what your house actually needs. Rather than flash a number we might not be able to stand behind, we look at your specific property and send you a real cash offer, usually within 24 hours. A real number from a local buyer beats an algorithm's ballpark every time.",
  },
  {
    question: 'What is my house worth in cash versus on the open market?',
    answer:
      'A cash, as-is offer is typically below what a fully fixed-up home might list for — but the comparison is rarely apples to apples. A cash sale has no agent commissions (5–6%), no closing costs, no repair bills, no staging, and no months of carrying costs while you wait for a buyer whose financing might fall through. For many sellers, the net difference is far smaller than the sticker difference, and the speed and certainty are worth it.',
  },
  {
    question: 'Am I committing to anything by requesting an offer?',
    answer:
      'No. Requesting your offer is free and carries zero obligation — if the number does not work for you, you simply walk away. No fees, no pressure, no follow-up games.',
  },
  {
    question: 'Can I really get cash before closing?',
    answer:
      "Often, yes — it's the thing most cash buyers won't do. Once we're under contract, eligible sellers can receive a cash advance to cover moving costs, deposits, storage, or urgent bills before the sale is final. Every term is put in writing before you accept anything.",
  },
  {
    question: 'What happens after I request my offer?',
    answer:
      "We review your property details, research your neighborhood, and usually reach out the same day — always within 24 hours — with a real cash offer. There are no fees, no repairs, and no showings, and you pick the closing date: as fast as 14 days, or whenever works for you.",
  },
];

const STEPS = ['Address', 'Size', 'Condition', 'Situation'] as const;

export function InstantOfferPage() {
  useSEO({
    title: "What's My House Worth in Cash? | Father & Son Home Buyers",
    description:
      'Tell us about your Southern California house in 60 seconds and get a real cash offer within 24 hours from Father & Son Home Buyers. No fees, no obligation.',
    canonical: 'https://fathersonhomes.com/instant-offer',
  });

  usePageSchema([
    instantOfferBreadcrumbSchema(),
    instantOfferWebAppSchema(),
    faqPageSchema(FAQS),
  ]);

  // Wizard state
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [addressError, setAddressError] = useState('');
  const [beds, setBeds] = useState<number | null>(null);
  const [baths, setBaths] = useState<number | null>(null);
  const [condition, setCondition] = useState<Condition | null>(null);
  const [situation, setSituation] = useState<SituationKey | null>(null);
  const [detailsComplete, setDetailsComplete] = useState(false);

  // Contact (full-offer) state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gateErrors, setGateErrors] = useState<{ name?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const addressInputRef = useAddressAutocomplete({
    onPlaceSelected: (selectedAddress, selectedCity) => {
      setAddress(selectedAddress);
      setCity(selectedCity);
      setAddressError('');
    },
  });

  useEffect(() => {
    if (addressInputRef.current && addressInputRef.current.value !== address) {
      addressInputRef.current.value = address;
    }
  }, [address]);

  const handleAddressNext = () => {
    if (!address.trim()) {
      setAddressError('Enter your property address to get started');
      return;
    }
    if (!city) setCity(cityFromTypedAddress(address));
    setStep(1);
  };

  const handleDetailsComplete = () => {
    if (beds === null || baths === null || condition === null || situation === null) return;
    setDetailsComplete(true);
  };

  const formatPhoneInput = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const conditionLabel = CONDITION_OPTIONS.find((c) => c.value === condition)?.label;

  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);

    const errors: { name?: string; phone?: string } = {};
    if (!name.trim() || name.trim().length < 2) errors.name = 'Please enter your full name';
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) errors.phone = 'Please enter a valid 10-digit phone number';
    setGateErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    const situationLabel = SITUATION_OPTIONS.find((s) => s.value === situation)?.label;
    const result = await submitLead({
      address,
      city: city || undefined,
      name,
      phone,
      situation: situationLabel,
      source: 'instant-offer',
      beds: beds !== null ? (beds >= 5 ? '5+' : String(beds)) : undefined,
      baths: baths !== null ? (baths >= 4 ? '4+' : String(baths)) : undefined,
      condition: conditionLabel,
    });
    setIsSubmitting(false);
    setSubmitStatus({ type: result.success ? 'success' : 'error', message: result.message });
  };

  const pillClass = (active: boolean) =>
    `px-4 py-2.5 rounded-full text-sm font-medium border transition-warm ${
      active
        ? 'bg-espresso text-cream border-espresso'
        : 'bg-white text-driftwood border-espresso/15 hover:border-terracotta/50 hover:text-espresso'
    }`;

  return (
    <>
      {/* Hero + offer request flow */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-oatmeal/50 to-linen">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-espresso/20" />
              <span className="text-sm font-medium tracking-warm text-driftwood">
                Free · 60 Seconds · No Obligation
              </span>
              <div className="h-px w-8 bg-espresso/20" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-espresso mb-6">
              What's My House Worth in Cash?
            </h1>
            <p className="text-lg text-driftwood max-w-2xl mx-auto">
              Answer four quick questions about your Southern California home and
              we'll send you a real cash offer within 24 hours — a number priced
              by a local buyer who knows your neighborhood, not an algorithm's
              guess. Zero fees, zero obligation.
            </p>
          </div>

          {/* The flow: form panel + status panel */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left: multi-step form */}
            <div className="bg-white rounded-2xl shadow-warm-lg p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-xl font-medium text-espresso">
                  Tell us about your home
                </h2>
                <span className="text-xs text-driftwood">
                  Step {Math.min(step + 1, STEPS.length)} of {STEPS.length}
                </span>
              </div>

              {/* Progress dots */}
              <div className="flex gap-2 mb-8" aria-hidden="true">
                {STEPS.map((label, i) => (
                  <div
                    key={label}
                    className={`h-1.5 flex-1 rounded-full ${
                      i <= step ? 'bg-terracotta' : 'bg-espresso/10'
                    }`}
                  />
                ))}
              </div>

              {step === 0 && (
                <div>
                  <label htmlFor="offer-address" className="block text-sm font-medium text-driftwood mb-2">
                    Property Address *
                  </label>
                  <input
                    ref={addressInputRef}
                    id="offer-address"
                    name="address"
                    placeholder="1234 W Example Ave, Anaheim, CA"
                    defaultValue={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (addressError) setAddressError('');
                    }}
                    autoComplete="off"
                    className={`input-warm w-full h-12 text-base ${addressError ? 'border-red-400' : ''}`}
                  />
                  {addressError && <p className="mt-1 text-xs text-red-500">{addressError}</p>}
                  <button
                    type="button"
                    onClick={handleAddressNext}
                    className="btn-terracotta w-full h-12 mt-6 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    Continue
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  <p className="mt-4 text-xs text-driftwood text-center">
                    We only use your address to evaluate your home. No spam, ever.
                  </p>
                </div>
              )}

              {step === 1 && (
                <div>
                  <p className="block text-sm font-medium text-driftwood mb-3">Bedrooms</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {BED_CHOICES.map((n) => (
                      <button
                        key={n}
                        type="button"
                        aria-pressed={beds === n}
                        onClick={() => setBeds(n)}
                        className={pillClass(beds === n)}
                      >
                        {n === 5 ? '5+' : n}
                      </button>
                    ))}
                  </div>
                  <p className="block text-sm font-medium text-driftwood mb-3">Bathrooms</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {BATH_CHOICES.map((n) => (
                      <button
                        key={n}
                        type="button"
                        aria-pressed={baths === n}
                        onClick={() => setBaths(n)}
                        className={pillClass(baths === n)}
                      >
                        {n === 4 ? '4+' : n}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(0)} className="btn-secondary h-12 px-6 rounded-md text-sm font-medium">
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={beds === null || baths === null}
                      onClick={() => setStep(2)}
                      className="btn-terracotta flex-1 h-12 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <p className="block text-sm font-medium text-driftwood mb-3">
                    How would you describe the condition?
                  </p>
                  <div className="space-y-3 mb-8">
                    {CONDITION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={condition === opt.value}
                        onClick={() => setCondition(opt.value)}
                        className={`w-full text-left p-4 rounded-lg border transition-warm ${
                          condition === opt.value
                            ? 'border-terracotta bg-terracotta/5'
                            : 'border-espresso/15 hover:border-terracotta/50'
                        }`}
                      >
                        <span className="block text-sm font-medium text-espresso">{opt.label}</span>
                        <span className="block text-xs text-driftwood mt-0.5">{opt.hint}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary h-12 px-6 rounded-md text-sm font-medium">
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={condition === null}
                      onClick={() => setStep(3)}
                      className="btn-terracotta flex-1 h-12 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <p className="block text-sm font-medium text-driftwood mb-3">
                    What's behind the sale? <span className="text-driftwood/60">(helps us shape the offer around what you need)</span>
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {SITUATION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={situation === opt.value}
                        onClick={() => setSituation(opt.value)}
                        className={pillClass(situation === opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="btn-secondary h-12 px-6 rounded-md text-sm font-medium">
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={situation === null}
                      onClick={handleDetailsComplete}
                      className="btn-terracotta flex-1 h-12 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Almost Done
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: offer status panel */}
            <div className="bg-espresso rounded-2xl shadow-warm-lg p-8 md:p-10 text-cream flex flex-col justify-center">
              {!detailsComplete ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-cream/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h2 className="font-serif text-2xl font-medium mb-3">
                    Your real cash offer
                  </h2>
                  <p className="text-cream/70 text-sm leading-relaxed">
                    Answer the questions on the left and tell us where to send
                    your offer. We price every home individually — no automated
                    ballparks — and get you a real number within 24 hours.
                  </p>
                </div>
              ) : submitStatus?.type === 'success' ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="font-serif text-2xl font-medium mb-3">You're all set!</h2>
                  <p className="text-cream/80 mb-6">{submitStatus.message}</p>
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
                <div>
                  <p className="text-sm font-medium tracking-warm text-terracotta mb-2">
                    Last step
                  </p>
                  <h2 className="font-serif text-3xl font-medium mb-4">
                    Where should we send your offer?
                  </h2>
                  <p className="text-cream/70 text-sm leading-relaxed mb-2">
                    We have what we need about the
                    {beds !== null && baths !== null
                      ? ` ${beds >= 5 ? '5+' : beds} bed / ${baths >= 4 ? '4+' : baths} bath`
                      : ''}{' '}
                    {conditionLabel ? `${conditionLabel.toLowerCase()} ` : ''}home
                    {city ? ` in ${city}` : ''}. We'll review it personally and
                    text you a real cash offer — usually the same day, always
                    within 24 hours.
                  </p>
                  <p className="text-cream/70 text-xs leading-relaxed mb-6">
                    And remember — once we're under contract, eligible sellers can
                    get a <Link to="/cash-advance" className="text-terracotta hover:underline">cash advance before closing</Link>{' '}
                    for moving costs, deposits, or urgent bills. Most buyers won't do that.
                  </p>

                  {submitStatus?.type === 'error' && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
                      <p className="text-sm text-red-300">{submitStatus.message}</p>
                    </div>
                  )}

                  <form onSubmit={handleGateSubmit} className="space-y-4">
                    <input type="text" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
                    <div>
                      <label htmlFor="offer-name" className="block text-sm font-medium text-cream/80 mb-2">
                        Name *
                      </label>
                      <input
                        id="offer-name"
                        name="name"
                        placeholder="John Smith"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (gateErrors.name) setGateErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        className={`input-warm w-full h-12 text-base ${gateErrors.name ? 'border-red-400' : ''}`}
                      />
                      {gateErrors.name && <p className="mt-1 text-xs text-red-300">{gateErrors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="offer-phone" className="block text-sm font-medium text-cream/80 mb-2">
                        Phone — where we text your offer *
                      </label>
                      <input
                        id="offer-phone"
                        name="phone"
                        type="tel"
                        placeholder="(949) 555-1234"
                        value={phone}
                        onChange={(e) => {
                          setPhone(formatPhoneInput(e.target.value));
                          if (gateErrors.phone) setGateErrors((prev) => ({ ...prev, phone: undefined }));
                        }}
                        className={`input-warm w-full h-12 text-base ${gateErrors.phone ? 'border-red-400' : ''}`}
                      />
                      {gateErrors.phone && <p className="mt-1 text-xs text-red-300">{gateErrors.phone}</p>}
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
                          Sending...
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
                    <p className="text-[11px] text-cream/50 leading-relaxed">
                      By submitting, you consent to receive calls, texts, and emails
                      from Father &amp; Son Home Buyers about your property. Message
                      &amp; data rates may apply. Opt out anytime. Requesting an
                      offer is free and carries no obligation.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* How your offer is priced — the transparency section */}
      <section className="py-16 md:py-20">
        <Container size="narrow">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-espresso mb-4">
              How We Price Your Cash Offer
            </h2>
            <p className="text-driftwood max-w-2xl mx-auto">
              No black box, no algorithm. Here's exactly what goes into your number.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Your Local Market',
                body: 'We start from what homes like yours actually sell for in your neighborhood — we buy across Orange County, LA County, and the Inland Empire, and we know these streets.',
              },
              {
                step: '02',
                title: 'Your Specific Property',
                body: 'Size, condition, and what the home genuinely needs. A house that needs a roof is priced like one — and a well-kept home gets credit for it.',
              },
              {
                step: '03',
                title: 'Cash-Sale Terms',
                body: 'An as-is cash sale trades some price for speed, certainty, and zero fees or repairs. We put a real number on that trade and stand behind it through closing.',
              },
            ].map((item) => (
              <div key={item.step} className="card-warm p-8 text-center">
                <div className="font-serif text-5xl font-medium text-terracotta/30 mb-4">{item.step}</div>
                <h3 className="font-serif text-xl font-medium text-espresso mb-3">{item.title}</h3>
                <p className="text-driftwood text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-driftwood text-center mt-8 max-w-2xl mx-auto">
            The offer you receive is a real number we intend to close on — not a
            teaser that shrinks after an inspection. See{' '}
            <Link to="/how-it-works" className="text-terracotta font-medium hover:underline">
              exactly how our process works
            </Link>
            , and walk away at any point if it's not right for you.
          </p>
        </Container>
      </section>

      {/* SEO prose + internal links */}
      <section className="py-16 md:py-20 bg-oatmeal/30">
        <Container size="narrow">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-espresso mb-6 text-center">
            A Real Answer to "What's My House Worth?"
          </h2>
          <div className="space-y-4 text-driftwood leading-relaxed">
            <p>
              Online home-value tools usually answer a different question than the
              one you're asking. They estimate what a fully fixed-up version of
              your home might list for — then leave you to subtract commissions,
              closing costs, repairs, and months of waiting on your own. If you're
              weighing a fast, as-is sale, what you actually want to know is
              simpler: <em>what would someone pay me in cash, as it sits, and how
              soon?</em>
            </p>
            <p>
              That's the question this page answers — with a real offer, not an
              algorithm's guess. Father &amp; Son Home Buyers is a local,
              family-owned cash buyer serving{' '}
              {countyHubs.map((hub, i) => (
                <span key={hub.slug}>
                  <Link
                    to={`/service-areas/${hub.slug}`}
                    className="text-terracotta font-medium hover:underline"
                  >
                    {hub.proseName}
                  </Link>
                  {i < countyHubs.length - 2 ? ', ' : i === countyHubs.length - 2 ? ', and ' : ''}
                </span>
              ))}
              . We buy houses in any condition — inherited homes, rentals with
              tenants, properties in pre-foreclosure, houses that need work — and
              every offer is priced by us personally, from real knowledge of your
              market.
            </p>
            <p>
              Tell us about your home above and we'll get you a real number within
              24 hours — no fees, no repairs, no showings, and a closing date you
              choose.
            </p>
          </div>
        </Container>
      </section>

      {/* FAQ (backs the FAQPage schema) */}
      <section className="py-16 md:py-20">
        <Container size="narrow">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-espresso mb-4">
              Getting Your Cash Offer: Common Questions
            </h2>
            <p className="text-driftwood">
              Straight answers about how the offer works.
            </p>
          </div>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.question} className="card-warm p-6">
                <h3 className="font-serif text-lg font-medium text-espresso mb-2">{faq.question}</h3>
                <p className="text-driftwood leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
