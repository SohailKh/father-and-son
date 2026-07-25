import { Link } from 'react-router-dom';
import { Container } from '../layout/Container';

export function MeetTheFamily() {
  return (
    <section className="py-16 md:py-24 bg-[#c5d5e4]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium tracking-warm text-espresso/70 bg-white/50 px-3 py-1 rounded-full">
                Meet The Family
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-espresso mb-6">
              Ahmad &amp; Dustin Hajiali
            </h2>
            <p className="text-espresso/80 leading-relaxed mb-6">
              We're not a faceless corporation — we're a local, family-owned father-and-son team. Ahmad brings 20+ years in construction and renovation; Dustin has worked in real estate since 17 and has taken part in more than 4,000 transactions.
            </p>
            <p className="text-espresso/70 leading-relaxed mb-8">
              Between us, we can evaluate any property honestly and walk you through every step. We believe every seller deserves honesty and respect — that's why transparency is at the heart of everything we offer.
            </p>
            <Link
              to="/about-us"
              className="inline-flex items-center gap-1 text-sm font-medium text-espresso underline underline-offset-4 mb-8 hover:text-terracotta"
            >
              Read our full story &amp; bios →
            </Link>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="btn-terracotta px-6 py-3 rounded-md text-sm font-medium inline-flex items-center justify-center"
              >
                Get Your Cash Offer
              </Link>
              <a
                href="tel:+19495412003"
                className="btn-secondary bg-white/80 border-espresso/20 px-6 py-3 rounded-md text-sm font-medium inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call or Text (949) 541-2003
              </a>
            </div>
          </div>

          {/* Father & Son Photo */}
          <div className="relative">
            <img
              src="/father-son-team.jpg"
              alt="Father & Son Home Buyers team photo — family-owned cash home buyers in Southern California"
              className="w-full rounded-2xl shadow-warm-lg object-cover"
              width={800}
              height={1202}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
