import { useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion'

export type JourneyItem = {
  when: string
  title: string
  subtitle: string
  role: string
  details: string
}

function clampIndex(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

const defaultItems: JourneyItem[] = [
  {
    when: 'Jul 2025 – Present · 6 mos',
    title: 'WeAreReasonablePeople',
    subtitle: 'Software Engineer',
    role: 'Software Engineer',
    details:
      'Built and shipped multiple production LLM integrations end‑to‑end using LangChain and Nest. Delivered high‑volume document workflows and reusable microservice patterns that cut delivery time.',
  },
  {
    when: 'Sep 2024 – May 2025 · 9 mos',
    title: 'Touch Tree',
    subtitle: 'Senior Software Engineer',
    role: 'Senior Software Engineer',
    details:
      'Worked on a large-scale publication management platform across multiple countries. Mentored engineers and led domain-driven architecture discussions to shorten delivery timelines.',
  },
  {
    when: 'Dec 2023 – Sep 2024 · 10 mos',
    title: 'Touch Tree',
    subtitle: 'Software Engineer',
    role: 'Software Engineer',
    details:
      'Built catalog and management tooling for publishers, including metrics and campaign integrations; delivered white‑label product features and improved deployment cycle time.',
  },
  {
    when: 'Feb 2023 – Jul 2023 · 6 mos',
    title: 'Heisa',
    subtitle: 'Software Engineer',
    role: 'Software Engineer',
    details:
      'Contributed to web applications and shipped features from concept to production; built backend services such as chat, notifications, and real‑time rooms in Nest.',
  },
  {
    when: 'Aug 2022 – Feb 2023 · 7 mos',
    title: 'Tripany',
    subtitle: 'Software Engineer',
    role: 'Software Engineer',
    details:
      'Contributed to e‑commerce platforms, telemetry tracking for machinery, and backend endpoints; built customer‑facing product interfaces and supported large product catalogs.',
  },
]

export function JourneyTimeline({
  items = defaultItems,
  heading = 'My journey',
  meta = 'Rotterdam, Netherlands · Available',
  accent = '#0000FF',
  stickyTopClassName = 'top-40 sm:top-44',
}: {
  items?: JourneyItem[]
  heading?: string
  meta?: string
  accent?: string
  stickyTopClassName?: string
}) {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const nextProgressRef = useRef(0)
  const [progress, setProgress] = useState(0)

  // Each dot gets ~one viewport of scroll.
  const totalHeight = useMemo(() => `${items.length * 100}vh`, [items.length])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const [activeIndex, setActiveIndex] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    nextProgressRef.current = p
    if (rafRef.current == null) {
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null
        setProgress(nextProgressRef.current)
      })
    }

    const raw = Math.floor(p * items.length)
    const idx = clampIndex(raw, 0, items.length - 1)
    setActiveIndex((prev) => (prev === idx ? prev : idx))
  })

  const active = items[activeIndex]

  const scrollToIndex = (idx: number) => {
    const el = sectionRef.current
    if (!el) return
    setActiveIndex(idx)
    const top = window.scrollY + el.getBoundingClientRect().top
    window.scrollTo({
      top: top + idx * window.innerHeight,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <div ref={sectionRef} className="relative" style={{ height: totalHeight }}>
      <div className={['sticky', stickyTopClassName].join(' ')}>
        <div className="flex items-end justify-between gap-6">
          <div className="text-sm tracking-tight text-white/60">{heading}</div>
          <div className="text-xs text-white/50">{meta}</div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="grid">
              {items.map((item, idx) => {
                const isActive = idx === activeIndex
                const isLast = idx === items.length - 1
                const fill = clampIndex(progress * items.length - idx, 0, 1)
                const isPast = idx < activeIndex

                return (
                  <button
                    key={item.when}
                    type="button"
                    onClick={() => scrollToIndex(idx)}
                    className={[
                      'group relative flex w-full gap-5 text-left',
                      isLast ? '' : 'pb-10',
                    ].join(' ')}
                  >
                    <div className="relative w-5 flex-none">
                      {!isLast ? (
                        <>
                          <div className="absolute left-1/2 top-4 bottom-[-3rem] w-px -translate-x-1/2 bg-white/20" />
                          <div
                            className="absolute left-1/2 top-4 bottom-[-3rem] w-px -translate-x-1/2"
                            style={{
                              backgroundColor: accent,
                              transform: `translateX(-0.5px) scaleY(${fill})`,
                              transformOrigin: 'top',
                            }}
                          />
                        </>
                      ) : null}
                      <div className="absolute left-1/2 top-2 -translate-x-1/2">
                        <div
                          className={[
                            'relative size-2 rounded-full transition',
                            isActive || isPast
                              ? ''
                              : 'bg-white/40 group-hover:bg-white/60',
                          ].join(' ')}
                          style={
                            isActive || isPast
                              ? { backgroundColor: accent }
                              : undefined
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-1">
                      <div className="text-xs text-white/55">{item.when}</div>
                      <div
                        className={[
                          'text-sm font-medium transition',
                          isActive
                            ? 'text-white'
                            : 'text-white/75 group-hover:text-white',
                        ].join(' ')}
                      >
                        {item.title}
                        <span className="text-white/55"> — {item.subtitle}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.when}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="text-xs text-white/55">{active.when}</div>
                  <div className="text-xs text-white/55">{active.role}</div>
                </div>

                <div className="mt-2 text-2xl tracking-tight text-white sm:text-3xl">
                  {active.title}
                </div>
                <div className="mt-2 text-sm text-white/65">{active.subtitle}</div>

                <p className="mt-6 text-sm leading-relaxed text-white/70 sm:text-base">
                  {active.details}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 text-xs text-white/45">
              Scroll to advance to the next dot.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
