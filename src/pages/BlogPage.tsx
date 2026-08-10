import { Link } from 'react-router-dom';
import { Container } from '../components/layout';
import { CTASection } from '../components/sections';
import { useSEO } from '../hooks/useSEO';
import {
  usePageSchema,
  blogIndexSchema,
  blogBreadcrumbSchema,
} from '../lib/schema';
import { blogPosts } from '../lib/blog-posts';

export function BlogPage() {
  useSEO({
    title: 'Blog | Home Selling Tips for SoCal | Father & Son',
    description:
      'Practical advice for Southern California homeowners facing foreclosure, inherited properties, as-is sales, and more. From Father & Son Home Buyers.',
    canonical: 'https://fathersonhomes.com/blog',
  });

  usePageSchema([blogIndexSchema(blogPosts), blogBreadcrumbSchema()]);

  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-oatmeal/50 to-linen">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-espresso/20" />
              <span className="text-sm font-medium tracking-warm text-driftwood">
                Resources & Guides
              </span>
              <div className="h-px w-8 bg-espresso/20" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-espresso mb-6">
              Helpful Guides for Southern California Homeowners
            </h1>
            <p className="text-lg text-driftwood max-w-2xl mx-auto">
              Straightforward answers to the questions homeowners ask most when they need to sell quickly, fairly, or in a difficult situation.
            </p>
          </div>
        </Container>
      </section>

      {/* Posts Grid */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="card-warm flex flex-col">
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-medium tracking-warm text-terracotta bg-terracotta/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-driftwood/60">{post.readTime}</span>
                  </div>
                  <h2 className="font-serif text-xl font-medium text-espresso mb-3 leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-sm text-driftwood leading-relaxed flex-1 mb-6">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-driftwood/60">{post.date}</span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-sm font-medium text-terracotta hover:underline flex items-center gap-1"
                    >
                      Read more
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
