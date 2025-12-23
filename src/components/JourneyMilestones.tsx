import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef } from 'react'

type MilestoneType = 'WORK' | 'SCHOOL' | 'LIFE'

export type JourneyMilestone = {
  when: string
  type: MilestoneType
  title: string
  org: string
  description: string
}

const badge: Record<MilestoneType, string> = {
  WORK: 'bg-white/5 text-white ring-1 ring-inset ring-white/10',
  SCHOOL: 'bg-white/5 text-white ring-1 ring-inset ring-white/10',
  LIFE: 'bg-white/5 text-white ring-1 ring-inset ring-white/10',
}

const typeLabel: Record<MilestoneType, string> = {
  WORK: 'Career',
  SCHOOL: 'Education',
  LIFE: 'Life',
}

export function JourneyMilestones({
  items,
}: {
  items?: JourneyMilestone[]
}) {
  const shouldReduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const wrapRef = useRef<HTMLElement | null>(null)
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const rowVh = 42
  const centerY = useMotionValue(-9999)
  const centerYPx = useMotionTemplate`${centerY}px`
  const { scrollYProgress: sectionProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  })
  const headerOpacity = useTransform(sectionProgress, [0, 0.88, 1], [1, 1, 0])

  const syncCenter = useCallback(() => {
    if (shouldReduceMotion) return
    const el = sectionRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight || 1
    // Slightly above center feels more visually centered (accounts for header/typography weight).
    const viewportAnchor = vh * 0.28
    const yInSection = viewportAnchor - rect.top
    const lineInsetPx = (rowVh / 2) * (vh / 100)
    const clamped = clamp(yInSection, lineInsetPx, Math.max(lineInsetPx, rect.height - lineInsetPx))
    centerY.set(clamped)
  }, [centerY, rowVh, shouldReduceMotion])

  useEffect(() => {
    syncCenter()
  }, [syncCenter])

  useMotionValueEvent(scrollY, 'change', () => {
    syncCenter()
  })

  const milestones = useMemo<JourneyMilestone[]>(
    () =>
      items ?? [
        {
          when: 'Jul 2025 – Present',
          type: 'WORK',
          title: 'Software Engineer',
          org: 'WeAreReasonablePeople',
          description:
            'Shipped multiple production LLM integrations using LangChain and Nest, including high-volume document workflows and reusable microservice patterns.',
        },
        {
          when: 'Jan 2025 – Jul 2025',
          type: 'WORK',
          title: 'Freelance Software Engineer',
          org: 'Freelancing',
          description:
            'Delivered client work end to end. Built modern frontends and backends, and shipped integrations with a focus on clarity, performance, and maintainability.',
        },
        {
          when: 'Sep 2024 – May 2025',
          type: 'WORK',
          title: 'Senior Software Engineer',
          org: 'Touch Tree',
          description:
            'Worked on a publication management platform across multiple countries. Led architecture discussions and mentored engineers on domain-driven design.',
        },
        {
          when: 'Dec 2023 – Sep 2024',
          type: 'WORK',
          title: 'Software Engineer',
          org: 'Touch Tree',
          description:
            'Built catalog and management tooling for publishers, including metrics and campaign integrations. Delivered white-label product features.',
        },
        {
          when: 'Feb 2023 – Jul 2023',
          type: 'WORK',
          title: 'Software Engineer',
          org: 'Heisa',
          description:
            'Contributed to web applications and shipped features from concept to production. Built backend services such as chat, notifications, and real-time rooms in Nest.',
        },
        {
          when: 'Aug 2022 – Feb 2023',
          type: 'WORK',
          title: 'Software Engineer',
          org: 'Tripany',
          description:
            'Contributed to e-commerce platforms and telemetry tracking. Built customer-facing product interfaces and supported large product catalogs.',
        },
        {
          when: 'Sep 2023 – Apr 2025',
          type: 'SCHOOL',
          title: 'Software Engineering',
          org: 'Rotterdam University of Applied Science',
          description:
            'Software Engineering coursework through year 3, focused on fundamentals and building real products.',
        },
        {
          when: 'Aug 2020 – Apr 2023',
          type: 'SCHOOL',
          title: 'Software Engineering',
          org: 'Grafisch Lyceum Rotterdam',
          description:
            'Built strong foundations in software engineering through hands-on coursework and projects.',
        },
        {
          when: 'Sep 2014 – Apr 2018',
          type: 'SCHOOL',
          title: 'Media Studies',
          org: 'Grafisch Lyceum Rotterdam',
          description:
            'Developed an eye for composition and communication that carries into how I design and build products.',
        },
      ],
    [items],
  )

  return (
    <section ref={wrapRef} className="mt-28 sm:mt-40">
      <motion.div
        className="sticky top-0 z-30 bg-gradient-to-b from-black via-black/90 to-transparent"
        style={{ opacity: shouldReduceMotion ? 1 : headerOpacity }}
      >
        <div className="relative py-10">
          <div className="flex flex-col items-center text-center">
            <div className="instrument-serif-regular text-lg tracking-tight text-white/60">
              My story
            </div>
            <div className="mt-2 instrument-serif-regular text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl">
              Journey & Milestones
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        ref={sectionRef}
        className="relative hidden lg:block"
        style={{ ['--milestone-center-y' as never]: centerYPx }}
      >
        <div
          className="pointer-events-none absolute left-1/2 z-0 w-px -translate-x-1/2 bg-white/15"
          style={{ top: `${rowVh / 2}vh`, bottom: `${rowVh / 2}vh` }}
        />
        {shouldReduceMotion ? null : (
          <div
            className="pointer-events-none absolute left-1/2 z-[1] w-px -translate-x-1/2"
            style={{
              top: `${rowVh / 2}vh`,
              bottom: `${rowVh / 2}vh`,
              background:
                'linear-gradient(to bottom,' +
                'transparent 0%,' +
                'transparent calc(var(--milestone-center-y) - 220px),' +
                'rgba(255,255,255,0) calc(var(--milestone-center-y) - 220px),' +
                'rgba(255,255,255,0.85) calc(var(--milestone-center-y) - 44px),' +
                'rgba(255,255,255,0.85) calc(var(--milestone-center-y) + 44px),' +
                'rgba(255,255,255,0) calc(var(--milestone-center-y) + 220px),' +
                'transparent 100%)',
            }}
            aria-hidden="true"
          />
        )}
        {milestones.map((m, idx) => (
          <div
            key={`${m.when}-${m.org}-${m.title}-dot`}
            className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2"
            style={{ top: `calc(${idx} * ${rowVh}vh + ${rowVh / 2}vh)` }}
            aria-hidden="true"
          >
            <div className="size-2.5 -translate-y-1/2 rounded-full bg-white" />
          </div>
        ))}
        <div className="grid">
          {milestones.map((m, idx) => {
            const isRight = idx % 2 === 1

            return (
              <div
                key={`${m.when}-${m.org}-${m.title}`}
                className="relative grid grid-cols-12 items-center gap-6"
                style={{ height: `${rowVh}vh` }}
              >
                <motion.div
                  className={[
                    'col-span-5',
                    isRight ? 'col-start-8 text-right' : 'col-start-1 text-left',
                  ].join(' ')}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.55, margin: '0px 0px -25% 0px' }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                  <div
                    className={[
                      'inline-flex items-center gap-3',
                      isRight ? 'justify-end' : '',
                    ].join(' ')}
                  >
                    <div className="text-lg font-semibold tracking-tight text-white">
                      {m.when}
                    </div>
                    <div
                      className={[
                        'rounded-md px-2 py-1 text-[10px] font-semibold tracking-tight',
                        badge[m.type],
                      ].join(' ')}
                    >
                      {typeLabel[m.type]}
                    </div>
                  </div>

                  <div className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {m.title}
                  </div>
                  <div className="mt-1 text-sm tracking-tight text-white/55">
                    {m.org}
                  </div>
                  <div className="mt-4 text-sm leading-relaxed text-white/55">
                    {m.description}
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Mobile fallback: simple stacked list */}
      <div className="mt-10 grid gap-6 lg:hidden">
        {milestones.map((m) => (
          <div
            key={`${m.when}-${m.org}-${m.title}`}
            className="rounded-3xl border border-white/10 bg-black p-8"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-sm font-semibold tracking-tight text-white">
                {m.when}
              </div>
              <div
                className={[
                  'rounded-md px-2 py-1 text-[10px] font-semibold tracking-tight',
                  badge[m.type],
                ].join(' ')}
              >
                {typeLabel[m.type]}
              </div>
            </div>
            <div className="mt-4 text-xl font-semibold tracking-tight text-white">
              {m.title}
            </div>
            <div className="mt-1 text-sm tracking-tight text-white/55">
              {m.org}
            </div>
            <div className="mt-4 text-sm leading-relaxed text-white/60">
              {m.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
