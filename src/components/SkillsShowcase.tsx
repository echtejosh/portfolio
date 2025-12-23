import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'

type SkillGroup = {
  title: string
  items: ReadonlyArray<string>
}

const copyByTitle: Record<string, { headline: string; summary: string }> = {
  Frontend: {
    headline: 'Interfaces that feel effortless',
    summary:
      'I care about clarity, speed, and small details that make products feel calm and reliable.',
  },
  Backend: {
    headline: 'Systems that stay dependable',
    summary:
      'I build APIs and services with clean boundaries, pragmatic data layers, and long-term maintainability in mind.',
  },
  AI: {
    headline: 'AI that ships, not demos',
    summary:
      'I integrate models into real workflows with the right constraints, observability, and guardrails.',
  },
  Infrastructure: {
    headline: 'Delivery that scales with the team',
    summary:
      'I set up deployments and automation so shipping stays boring, repeatable, and fast.',
  },
}

const listVariants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { when: 'beforeChildren', staggerChildren: 0.04, delayChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
}

export function SkillsShowcase({
  items,
}: {
  items: ReadonlyArray<SkillGroup>
}) {
  const shouldReduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)

  const safeIndex = Math.min(Math.max(0, activeIndex), Math.max(0, items.length - 1))
  const active = items[safeIndex]

  const activeCopy = useMemo(() => {
    const title = active?.title ?? ''
    return (
      copyByTitle[title] ?? {
        headline: 'A toolbox that flexes',
        summary:
          'I use a small set of tools well, and expand when the problem calls for it.',
      }
    )
  }, [active?.title])

  return (
    <div className="rounded-3xl border border-white/10 bg-black p-8 lg:p-10">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="text-sm tracking-tight text-white/60">Areas</div>
          <div className="mt-5 grid gap-2">
            {items.map((g, idx) => {
              const isActive = idx === safeIndex
              return (
                <button
                  key={g.title}
                  type="button"
                  data-cursor="interactive"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onFocus={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(idx)}
                  className={[
                    'group rounded-2xl px-4 py-3 text-left transition',
                    'ring-1 ring-inset',
                    isActive
                      ? 'bg-white/5 ring-white/10'
                      : 'bg-transparent ring-white/5 hover:bg-white/[0.03] hover:ring-white/10',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="instrument-serif-regular text-2xl tracking-tight text-white">
                      {g.title}
                    </div>
                    <div
                      className={[
                        'text-xs tracking-tight',
                        isActive ? 'text-white/60' : 'text-white/35',
                      ].join(' ')}
                    >
                      {g.items.length}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="lg:col-span-8">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={active?.title ?? 'skills'}
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="instrument-serif-regular text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl">
                {activeCopy.headline}
              </div>
              <div className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
                {activeCopy.summary}
              </div>

              <motion.div
                className="mt-8 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3"
                key={active?.title ?? 'skills-list'}
                variants={shouldReduceMotion ? undefined : listVariants}
                initial={shouldReduceMotion ? undefined : 'hidden'}
                animate={shouldReduceMotion ? undefined : 'show'}
              >
                {active?.items.map((tool) => (
                  <motion.div
                    key={tool}
                    variants={shouldReduceMotion ? undefined : itemVariants}
                    className="flex items-center gap-2 text-sm tracking-tight text-white/70"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                    <span>{tool}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
