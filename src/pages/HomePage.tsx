import type { ReactNode } from 'react'
import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'iconoir-react'
import { Container } from '../components/Container'
import { Tag } from '../components/Tag'
import { LogoMarquee } from '../components/LogoMarquee'
import { JourneyMilestones } from '../components/JourneyMilestones'
import { RecommendationsMarquee } from '../components/RecommendationsMarquee'
import { SkillsColumns } from '../components/SkillsColumns'
import { site } from '../site'

function ScrollNameHero() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const circleRef = useRef<HTMLDivElement | null>(null)
  const shouldReduceMotion = useReducedMotion()

  const circleGlow = useMotionValue(1)
  const circleAngle = useMotionValue(0)
  const arcRotate = useTransform(circleAngle, (a) => a + 4)
  const ringHighlight =
    'conic-gradient(from -36deg,' +
    'rgba(255,255,255,0) 0deg,' +
    'rgba(255,255,255,0.10) 8deg,' +
    'rgba(255,255,255,0.45) 16deg,' +
    'rgba(255,255,255,0.95) 24deg,' +
    'rgba(255,255,255,0.95) 36deg,' +
    'rgba(255,255,255,0.45) 48deg,' +
    'rgba(255,255,255,0.10) 60deg,' +
    'rgba(255,255,255,0) 72deg,' +
    'rgba(255,255,255,0) 360deg)'

  const onPointerMove = (e: React.PointerEvent) => {
    if (shouldReduceMotion) return
    const el = circleRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy

    const deg = (Math.atan2(dy, dx) * 180) / Math.PI
    const cssDeg = (deg + 90 + 360) % 360
    circleAngle.set(cssDeg)
  }

  return (
    <section ref={sectionRef} className="relative h-screen bg-black">
      <div
        className="sticky top-0 relative flex h-screen items-center"
        onPointerMove={onPointerMove}
      >
        {/* Email removed from hero */}
        {/* Removed top name block */}
        <div className="pointer-events-none absolute left-0 top-1/2 z-20 w-full -translate-y-1/2">
          <Container>
            <div className="max-w-[900px] text-left text-[clamp(2rem,4.2vw,4.5rem)] font-semibold leading-[1.02] tracking-tight text-white font-sans">
              I build reliable and capable systems with intention and purpose.
            </div>
          </Container>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 z-20 w-full">
          <Container className="pb-6">
            <div className="flex items-end justify-between gap-8">
              <div className="grid gap-1 text-sm tracking-tight text-white/65">
                <div>{site.role}</div>
                <div>{site.location}</div>
                <div>{site.availability}</div>
              </div>
              <div className="grid gap-1 text-right text-sm tracking-tight text-white/65">
                <Link to="/about" className="pointer-events-auto transition hover:text-white">
                  About me
                </Link>
                <Link to="/blog" className="pointer-events-auto transition hover:text-white">
                  Read my blog
                </Link>
                <a href="#contact" className="pointer-events-auto transition hover:text-white">
                  Contact me
                </a>
              </div>
            </div>
          </Container>
        </div>
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={{
            x: '-50%',
            y: '-50%',
          }}
          aria-hidden="true"
        >
          <motion.div ref={circleRef} className="relative size-[70vmin]">
            <div className="absolute inset-0 rounded-full border border-white/15" />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                opacity: circleGlow,
                background: ringHighlight,
                rotate: arcRotate,
                WebkitMaskImage:
                  'radial-gradient(closest-side, transparent calc(100% - 2px), #000 calc(100% - 2px), #000 100%)',
                maskImage:
                  'radial-gradient(closest-side, transparent calc(100% - 2px), #000 calc(100% - 2px), #000 100%)',
              }}
            />
          </motion.div>
        </motion.div>
        {/* Motto moved to top-right; keep center clear for the ring */}

      </div>
    </section>
  )
}

function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: string
  title: ReactNode
  description?: string
  align?: 'left' | 'center'
}) {
  const isCentered = align === 'center'
  return (
    <div
      className={[
        'flex flex-col gap-2',
        isCentered ? 'items-center text-center' : '',
      ].join(' ')}
    >
      <div className="instrument-serif-regular text-lg tracking-tight text-white/60">
        {eyebrow}
      </div>
      <div className="instrument-serif-regular text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl">
        {title}
      </div>
      {description ? (
        <div
          className={[
            'mt-2 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-white/65 sm:text-base',
            isCentered ? 'mx-auto' : '',
          ].join(' ')}
        >
          {description}
        </div>
      ) : null}
    </div>
  )
}

const metricsListVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const metricsItemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
}

export function HomePage() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <>
      <ScrollNameHero />
      <div data-after-hero className="h-px" aria-hidden="true" />

      <section className="bg-black/70 pt-10 pb-6 sm:pt-12 sm:pb-8">
        <Container className="pt-6 pb-6 sm:pt-8 sm:pb-8">
          <motion.div
            className="grid gap-6 text-center sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-start sm:gap-8"
            variants={shouldReduceMotion ? undefined : metricsListVariants}
            initial={shouldReduceMotion ? undefined : 'hidden'}
            whileInView={shouldReduceMotion ? undefined : 'show'}
            viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.4 }}
          >
            <motion.div className="grid gap-2 text-center" variants={shouldReduceMotion ? undefined : metricsItemVariants}>
              <div className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                3–4
              </div>
              <div className="text-xs tracking-tight text-white/55">
                Years experience
              </div>
            </motion.div>
            <motion.div
              className="hidden h-full w-px bg-white/10 sm:block"
              variants={shouldReduceMotion ? undefined : metricsItemVariants}
            />
            <motion.div className="grid gap-2 text-center" variants={shouldReduceMotion ? undefined : metricsItemVariants}>
              <div className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                30+
              </div>
              <div className="text-xs tracking-tight text-white/55">
                Projects
              </div>
            </motion.div>
            <motion.div
              className="hidden h-full w-px bg-white/10 sm:block"
              variants={shouldReduceMotion ? undefined : metricsItemVariants}
            />
            <motion.div className="grid gap-2 text-center" variants={shouldReduceMotion ? undefined : metricsItemVariants}>
              <div className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                ∞
              </div>
              <div className="text-xs tracking-tight text-white/55">
                Lines of code
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      <section className="relative">
        <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
          <div className="absolute inset-0 bg-[radial-gradient(45%_45%_at_30%_25%,rgba(255,255,255,0.10),transparent_60%)]" />
        </div>

        <Container className="relative pb-20 sm:pb-28">
          <motion.div
            className="mt-10 grid gap-16 lg:grid-cols-12 lg:gap-16"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.6 }}
          >
            <div className="lg:col-span-6">
              <SectionTitle
                eyebrow="Introduction"
                title={
                  <>
                    I build{' '}
                    <span className="accent-gradient-text">
                      clean, fast, human-friendly
                    </span>{' '}
                    web experiences.
                  </>
                }
                description={`I'm a software engineer with 3–4 years shipping production applications end‑to‑end and leading product development. I build frontends, backends, and AI pipelines.\n\nI care about the products I create from concept to production with a focus on clarity, performance, and reliability.`}
              />
              <div className="mt-6">
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black px-4 py-2 text-sm tracking-tight text-white/70 transition hover:bg-white/[0.05] hover:text-white"
                >
                  Check out my about me
                  <ArrowUpRight className="h-4 w-4 text-white/60 transition group-hover:text-white" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 lg:flex lg:items-center">
              <div className="relative w-full rounded-3xl border border-white/10 bg-black p-8">
                <div className="text-sm tracking-tight text-white/60">Quote</div>
                <blockquote className="instrument-serif-regular-italic mt-6 text-xl leading-snug tracking-tight text-white sm:text-2xl">
                  “We are what we repeatedly do; excellence, then, is not an act but a habit.”
                </blockquote>
                <div className="mt-4 text-sm text-white/50">— Aristotle</div>
              </div>
            </div>

            {/* Timeline removed temporarily.
                Reuse by importing `JourneyTimeline` from `src/components/JourneyTimeline.tsx`. */}
          </motion.div>

          <LogoMarquee
            className="my-20 sm:my-24"
            title=""
            items={site.workedWith}
            variant="text"
            fullBleed
            chrome="none"
          />

          <motion.div
            className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-12 lg:items-stretch lg:gap-10"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.6 }}
          >
            <div className="lg:col-span-12">
              <SectionTitle
                eyebrow="Principles"
                title="Focus & strength"
                description="Focus is choosing what matters, then finishing it with care. Strength is building foundations that hold, and integrations that let the work grow."
                align="center"
              />
            </div>

            <div className="lg:col-span-6 h-full">
              <div className="h-full rounded-3xl border border-white/10 bg-black p-8">
                <div className="text-sm tracking-tight text-white/60">
                  Focus
                </div>
                <div className="mt-2 text-base font-semibold tracking-tight text-white">
                  End-to-end shipping
                </div>
                <div className="mt-2 text-sm leading-relaxed text-white/65">
                  I take features from concept to production across frontend and backend. I build
                  clear UIs, reliable APIs, and pragmatic data layers with strong performance and
                  accessibility. I care deeply about how people use the products I ship, and I
                  try to find the fine line between functional and beautiful.
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 h-full">
              <div className="h-full rounded-3xl border border-white/10 bg-black p-8">
                <div className="text-sm tracking-tight text-white/60">
                  Strength
                </div>
                <div className="mt-2 text-base font-semibold tracking-tight text-white">
                  Architecture and AI integrations
                </div>
                <div className="mt-2 text-sm leading-relaxed text-white/65">
                  My strength is building architecture that scales, plus AI integrations that
                  ship. I care about clean boundaries, domain-driven design, and reusable
                  patterns that shorten delivery time while keeping systems maintainable.
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-24 grid gap-6 lg:mt-28 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-12">
              <SectionTitle
                eyebrow="Skills"
                title={
                  <>
                    A toolbox that <span className="accent-gradient-text">flexes</span>
                  </>
                }
                description="I build frontends, backends, and AI pipelines. These are the stacks I reach for most often."
                align="center"
              />
            </div>

            <div className="lg:col-span-12">
              <SkillsColumns groups={site.skills} />
            </div>
          </div>

          <JourneyMilestones />
        </Container>
      </section>

      <Container className="pb-24 sm:pb-32">
        <div className="pt-8 sm:pt-10">
          <SectionTitle
            eyebrow="Work"
            title={
              <>
                <span className="accent-gradient-text">Curated</span> work
              </>
            }
            description="A set of projects that I'm able to disclose publicly."
          />

          <div className="mt-12 border-t border-white/10">
            <div className="divide-y divide-white/10">
              {site.featured.map((item, idx) => (
                <motion.div
                  key={item.title}
                  className="group grid gap-4 py-8 transition hover:bg-white/[0.02] lg:grid-cols-12 lg:items-start lg:gap-8"
                  initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: idx * 0.06 }}
                  viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.35 }}
                >
                  <div className="lg:col-span-4">
                    <div className="text-base font-semibold tracking-tight text-white">
                      {item.title}
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <p className="text-sm leading-relaxed text-white/65">
                      {item.description}
                    </p>
                  </div>

                  <div className="lg:col-span-3 lg:flex lg:justify-start">
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-20 sm:mt-24">
            <SectionTitle
              eyebrow="Testimonials"
              title="What people say"
              description="A few words from people I have worked with."
              align="center"
            />

            <div className="relative left-1/2 mt-10 w-screen -translate-x-1/2">
              <RecommendationsMarquee items={site.recommendations} />
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
