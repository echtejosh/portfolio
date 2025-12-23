import { Link } from 'react-router-dom'
import { Container } from '../components/Container'

const posts = [
  {
    title: 'Building a Scalable Pipeline for Technical Manual Processing',
    slug: '/blog/scalable-pipeline',
    date: '2025',
    summary:
      "A deep-dive into designing a reliable, scalable pipeline for extracting and validating data from technical manuals. Learn how checkpointed stages, clear model responsibilities, and human-in-the-loop validation create robust and debuggable LLM pipelines.",
    tags: ['AI', 'Pipelines', 'Validation', 'Architecture'],
  },
] as const

export function BlogPage() {
  return (
    <section className="relative">
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <div className="absolute inset-0 bg-[radial-gradient(45%_45%_at_30%_25%,rgba(255,255,255,0.10),transparent_60%)]" />
      </div>

      <Container className="relative pt-28 pb-20 sm:pt-32 sm:pb-28">
        <div className="instrument-serif-regular text-lg tracking-tight text-white/60">
          Blog
        </div>
        <div className="instrument-serif-regular mt-2 text-3xl leading-[1.05] tracking-tight text-white sm:text-4xl">
          Notes from building in production
        </div>
        <div className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
          Short, practical write‑ups on shipping systems, AI, and product
          decisions.
        </div>

        <div className="mt-10 border-t border-white/10">
          <div className="divide-y divide-white/10">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={post.slug}
                className="group grid gap-4 py-8 transition hover:bg-white/[0.02] lg:grid-cols-12 lg:items-start lg:gap-8"
              >
                <div className="lg:col-span-3">
                  <div className="text-xs tracking-tight text-white/55">
                    {post.date}
                  </div>
                </div>
                <div className="lg:col-span-6">
                  <div className="text-base font-semibold tracking-tight text-white">
                    {post.title}
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-white/65">
                    {post.summary}
                  </div>
                </div>
                <div className="lg:col-span-3 lg:flex lg:justify-end">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full bg-white/5 px-3 py-1.5 text-xs tracking-tight text-white/70 ring-1 ring-inset ring-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
