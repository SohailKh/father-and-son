import { useParams, Link } from 'react-router-dom';
import { Container } from '../components/layout';
import { CTASection } from '../components/sections';
import { RichText, RichSpan } from '../components/ui';
import { useSEO } from '../hooks/useSEO';
import {
  usePageSchema,
  blogPostingSchema,
  blogPostBreadcrumbSchema,
} from '../lib/schema';
import { getPostBySlug, blogPosts } from '../lib/blog-posts';
import { getSituationBySlug } from '../lib/situations';
import { getCityBySlug } from '../lib/cities';
import { TEAM } from '../lib/reviews';

/** Every post is written by the son — the named author on all article schema. */
const AUTHOR = TEAM[1];

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  useSEO({
    title: post
      ? post.seoTitle ?? `${post.title} | Father & Son`
      : 'Post Not Found | Father & Son',
    description: post?.seoDescription ?? post?.description ?? 'Post not found.',
    canonical: post ? `https://fathersonhomes.com/blog/${post.slug}` : undefined,
  });

  // One BlogPosting node for this article, plus its breadcrumb trail.
  usePageSchema(
    post ? [blogPostingSchema(post), blogPostBreadcrumbSchema(post)] : []
  );

  if (!post) {
    return (
      <section className="py-24">
        <Container size="narrow">
          <div className="text-center">
            <h1 className="font-serif text-4xl font-medium text-espresso mb-4">Post Not Found</h1>
            <p className="text-driftwood mb-8">That article couldn't be found.</p>
            <Link to="/blog" className="btn-terracotta px-8 py-3 rounded-md text-sm font-medium inline-flex items-center gap-2">
              View All Articles
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const relatedSituation = post.relatedSituationSlug
    ? getSituationBySlug(post.relatedSituationSlug)
    : undefined;
  const relatedCities = (post.relatedCitySlugs ?? [])
    .map((s) => getCityBySlug(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <>
      {/* Article Hero */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-oatmeal/50 to-linen">
        <Container size="narrow">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-driftwood mb-8">
            <Link to="/blog" className="hover:text-terracotta transition-warm">Blog</Link>
            <span>/</span>
            <span className="text-espresso line-clamp-1">{post.title}</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium tracking-warm text-terracotta bg-terracotta/10 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-driftwood/60">{post.readTime}</span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-espresso mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-driftwood mb-6">{post.description}</p>

          {/* Named author byline — the article's E-E-A-T signal, matching the
              author in this page's BlogPosting schema. */}
          <div className="flex items-center gap-3">
            <img
              src={AUTHOR.photo}
              alt={AUTHOR.photoAlt}
              className="w-11 h-11 rounded-full object-cover"
              width={44}
              height={44}
              loading="lazy"
              decoding="async"
            />
            <p className="text-sm text-driftwood/80">
              By{' '}
              <Link to="/about-us" className="font-medium text-espresso hover:text-terracotta transition-warm">
                {AUTHOR.name}
              </Link>
              , {AUTHOR.role}
              <span className="block text-driftwood/60">Published {post.date}</span>
            </p>
          </div>
        </Container>
      </section>

      {/* Article Body */}
      <section className="py-12 md:py-16">
        <Container size="narrow">
          <div className="prose-warm">
            {post.sections.map((section, i) => (
              <div key={i} className="mb-8">
                {section.heading && (
                  <h2 className="font-serif text-2xl font-medium text-espresso mb-4 mt-10 first:mt-0">
                    {section.heading}
                  </h2>
                )}
                {section.body && <RichText text={section.body} />}
                {section.bullets && (
                  <ul className="space-y-3 mb-4">
                    {section.bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start gap-3 text-driftwood leading-relaxed">
                        <svg className="w-5 h-5 text-terracotta flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>
                          {bullet.lead && (
                            <strong className="font-medium text-espresso">{bullet.lead}: </strong>
                          )}
                          <RichSpan text={bullet.text} />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.outro && <RichText text={section.outro} />}
              </div>
            ))}
          </div>

          {/* Author bio — Google expects money-topic content to come from a
              real, identifiable person with stated experience. */}
          <div className="mt-12 p-6 bg-oatmeal/30 rounded-lg border border-espresso/10">
            <div className="flex flex-col sm:flex-row gap-5">
              <img
                src={AUTHOR.photo}
                alt={AUTHOR.photoAlt}
                className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                width={80}
                height={80}
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="text-xs font-medium tracking-warm text-driftwood/60 mb-1">
                  About the author
                </p>
                <h3 className="font-serif text-lg font-medium text-espresso mb-2">
                  {AUTHOR.name} &middot;{' '}
                  <span className="text-driftwood text-base">{AUTHOR.role}</span>
                </h3>
                <p className="text-sm text-driftwood leading-relaxed mb-3">{AUTHOR.bio}</p>
                <Link
                  to="/about-us"
                  className="text-sm font-medium text-terracotta hover:underline inline-flex items-center gap-1"
                >
                  Meet the father &amp; son behind Father &amp; Son Home Buyers
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Related situation landing page — reciprocal link to the
              conversion-focused page for this topic. */}
          {relatedSituation && (
            <div className="mt-12 p-6 bg-terracotta/5 rounded-lg border border-terracotta/20">
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-terracotta flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-serif text-lg font-medium text-espresso mb-1">
                    Ready to sell, not just read?
                  </h3>
                  <p className="text-driftwood text-sm mb-3">
                    See exactly how we help homeowners in this situation and get a fair cash offer.
                  </p>
                  <Link
                    to={`/situations/${relatedSituation.slug}`}
                    className="text-sm font-medium text-terracotta hover:underline inline-flex items-center gap-1"
                  >
                    {relatedSituation.name}: how we help
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* City pages relevant to this article's topic — gives the location
              pages internal links from blog content. */}
          {relatedCities.length > 0 && (
            <div className="mt-8">
              <h3 className="font-serif text-lg font-medium text-espresso mb-3">
                We Buy Houses in These Cities
              </h3>
              <div className="flex flex-wrap gap-3">
                {relatedCities.map((city) => (
                  <Link
                    key={city.slug}
                    to={`/locations/${city.slug}`}
                    className="text-sm font-medium text-terracotta bg-terracotta/5 border border-terracotta/20 px-4 py-2 rounded-full hover:bg-terracotta/10 transition-warm"
                  >
                    Sell fast in {city.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA Card */}
          <div className="mt-12 p-8 bg-oatmeal/40 rounded-lg border border-espresso/10">
            <h3 className="font-serif text-2xl font-medium text-espresso mb-3">
              Ready to Talk to a Local Cash Buyer?
            </h3>
            <p className="text-driftwood mb-6 text-sm">
              Father & Son Home Buyers serves Orange County, LA County, and the Inland Empire. Get a fair cash offer within 24 hours — no repairs, no fees, no obligation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="btn-terracotta px-6 py-3 rounded-md text-sm font-medium inline-flex items-center justify-center gap-2"
              >
                Get My Cash Offer
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href="tel:+19495412003"
                className="btn-secondary px-6 py-3 rounded-md text-sm font-medium inline-flex items-center justify-center gap-2"
              >
                Call (949) 541-2003
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* More Articles */}
      {otherPosts.length > 0 && (
        <section className="py-12 md:py-16 bg-oatmeal/20">
          <Container>
            <h2 className="font-serif text-2xl font-medium text-espresso mb-8">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {otherPosts.map((p) => (
                <article key={p.slug} className="card-warm p-8">
                  <span className="text-xs font-medium tracking-warm text-terracotta bg-terracotta/10 px-3 py-1 rounded-full">
                    {p.category}
                  </span>
                  <h3 className="font-serif text-lg font-medium text-espresso mt-4 mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-driftwood mb-4 line-clamp-2">{p.description}</p>
                  <Link
                    to={`/blog/${p.slug}`}
                    className="text-sm font-medium text-terracotta hover:underline flex items-center gap-1"
                  >
                    Read article
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CTASection />
    </>
  );
}
