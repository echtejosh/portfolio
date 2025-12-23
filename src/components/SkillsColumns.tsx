import { motion, useReducedMotion } from 'framer-motion'

type SkillGroup = {
  title: string
  items: ReadonlyArray<string>
}

export function SkillsColumns({ groups }: { groups: ReadonlyArray<SkillGroup> }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="border-y border-white/10">
      <div className="divide-y divide-white/10 lg:grid lg:auto-cols-fr lg:grid-flow-col lg:divide-y-0 lg:divide-x lg:divide-white/10">
        {groups.map((g, idx) => (
          <motion.div
            key={g.title}
            className="group px-6 py-8 transition hover:bg-white/[0.02] lg:px-8"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 0 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: 0.55,
              ease: 'easeOut',
              delay: shouldReduceMotion ? 0 : Math.min(0.4, idx * 0.08),
            }}
          >
            <div className="text-sm font-semibold tracking-tight text-white">{g.title}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded-full bg-white/5 px-3 py-1.5 text-xs tracking-tight text-white/70 ring-1 ring-inset ring-white/10"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
