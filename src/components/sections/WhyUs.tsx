import { Container } from '../layout/Container';

// Self-hosted image for faster loading
const FATHER_SON_IMAGE = '/why-us-team.jpg';

export function WhyUs() {
  return (
    <section id="why-us" className="py-16 md:py-20 lg:py-24">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Image */}
          <div className="lg:col-span-5 relative group">
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-warm-lg">
              <img
                src={FATHER_SON_IMAGE}
                alt="Father and son team — local cash home buyers serving Southern California"
                className="img-warm w-full h-full object-cover object-top"
                width={800}
                height={1200}
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Label below image */}
            <p className="text-sm text-driftwood mt-4 text-center">
              Est. 2015 · Family Owned
            </p>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-espresso/20" />
              <span className="text-sm font-medium tracking-warm text-driftwood">
                About Us
              </span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-espresso mb-6">
              Family-Owned. <em className="text-terracotta">Local</em> Experts.
            </h2>

            <div className="space-y-4 text-driftwood leading-relaxed mb-10">
              <p className="drop-cap">
                We're not a faceless corporation or a tech startup. Father & Son Home Buyers is a
                family business built on trust, transparency, and treating every homeowner like family.
              </p>
              <p>
                Since 2015, we've helped hundreds of Southern California homeowners sell their properties
                quickly and hassle-free. Whether you're facing foreclosure, dealing with an inherited
                property, going through divorce, or simply need to sell fast—we're here to help with
                compassion and professionalism.
              </p>
            </div>

            {/* Testimonial */}
            <div className="card-featured bg-oatmeal rounded-lg p-6 md:p-8">
              <blockquote className="font-serif text-lg md:text-xl leading-relaxed mb-4 text-espresso italic">
                "Sold my parents' home in just 2 weeks after they passed. The team was
                compassionate, professional, and made everything so easy during a difficult time."
              </blockquote>
              <cite className="text-sm font-medium text-driftwood not-italic block">
                — Maria R., Anaheim, CA
              </cite>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
