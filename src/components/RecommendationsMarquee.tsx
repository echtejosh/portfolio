import { motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../lib/cn'

export type RecommendationItem = {
  name: string
  role: string
  title: string
  quote: string
  shiny?: boolean
}

export function RecommendationsMarquee({
  items,
  className,
}: {
  items: ReadonlyArray<RecommendationItem>
  className?: string
}) {
  const shouldReduceMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const baseRef = useRef<HTMLDivElement | null>(null)
  const [repeatFactor, setRepeatFactor] = useState(1)
  const [baseWidth, setBaseWidth] = useState(0)

  const x = useMotionValue(0)
  const dragOffsetRef = useRef(0)
  const timeOffsetRef = useRef(0)
  const dragRef = useRef<{ active: boolean; startX: number; startOffset: number }>({
    active: false,
    startX: 0,
    startOffset: 0,
  })

  const baseItems = useMemo(() => {
    if (!items.length) return []
    const out: RecommendationItem[] = []
    for (let i = 0; i < repeatFactor; i++) out.push(...items)
    return out
  }, [items, repeatFactor])

  const loopItems = useMemo(() => [...baseItems, ...baseItems], [baseItems])

  useLayoutEffect(() => {
    const container = containerRef.current
    const base = baseRef.current
    if (!container || !base) return

    const compute = () => {
      const containerWidth = container.getBoundingClientRect().width
      const nextBaseWidth = base.getBoundingClientRect().width
      setBaseWidth((prev) => (Math.abs(prev - nextBaseWidth) < 1 ? prev : nextBaseWidth))

      if (!items.length || nextBaseWidth <= 0 || containerWidth <= 0) return

      const target = containerWidth * 1.25
      const perFactor = nextBaseWidth / repeatFactor
      const nextFactor = Math.max(1, Math.ceil(target / Math.max(1, perFactor)))
      setRepeatFactor((prev) => (prev === nextFactor ? prev : nextFactor))
    }

    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(container)
    ro.observe(base)
    window.addEventListener('resize', compute)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', compute)
    }
  }, [items, repeatFactor])

  useEffect(() => {
    if (shouldReduceMotion) return
    if (!baseWidth) return

    let raf = 0
    let last = performance.now()
    const speedPxPerSec = 32

    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now

      timeOffsetRef.current += dt * speedPxPerSec

      const raw = timeOffsetRef.current + dragOffsetRef.current
      const wrapped = ((raw % baseWidth) + baseWidth) % baseWidth
      x.set(-wrapped)

      raf = window.requestAnimationFrame(tick)
    }

    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [baseWidth, shouldReduceMotion, x])

  const card = (r: RecommendationItem, key: string) => (
    <div
      key={key}
      className={cn(
        'relative w-[320px] flex-none overflow-hidden rounded-3xl bg-black p-8',
        r.shiny ? 'shiny-border border border-transparent' : 'border border-white/10',
        'h-[320px]',
        'sm:w-[420px]',
        'sm:h-[360px]',
      )}
    >
      <div className="flex h-full flex-col">
        <div>
          <div className="instrument-serif-regular text-2xl leading-[1.05] tracking-tight text-white sm:text-3xl">
            {r.title}
          </div>
          <blockquote className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white/70">
            “{r.quote}”
          </blockquote>
        </div>

        <div className="mt-auto pt-6">
          <div className="text-sm font-semibold tracking-tight text-white">
            {r.name}
          </div>
          <div className="mt-1 text-sm tracking-tight text-white/55">
            {r.role}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className={cn('relative', className)}>
      <div ref={containerRef} className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-black to-transparent" />

        {shouldReduceMotion ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {items.map((r) => card(r, r.name))}
          </div>
        ) : (
          <div
            className={cn('py-2', 'cursor-grab select-none active:cursor-grabbing')}
            onPointerDown={(e) => {
              dragRef.current.active = true
              dragRef.current.startX = e.clientX
              dragRef.current.startOffset = dragOffsetRef.current
              try {
                ; (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
              } catch {
                // ignore
              }
            }}
            onPointerMove={(e) => {
              if (!dragRef.current.active) return
              const dx = e.clientX - dragRef.current.startX
              dragOffsetRef.current = dragRef.current.startOffset - dx
            }}
            onPointerUp={(e) => {
              dragRef.current.active = false
              try {
                ; (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId)
              } catch {
                // ignore
              }
            }}
            onPointerCancel={() => {
              dragRef.current.active = false
            }}
            onPointerLeave={() => {
              dragRef.current.active = false
            }}
          >
            <motion.div className="flex w-max gap-6 will-change-transform" style={{ x }}>
              {loopItems.map((r, idx) => card(r, `${r.name}-${idx}`))}
            </motion.div>

            <div
              ref={baseRef}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 -z-10 flex w-max gap-6 py-2 opacity-0"
            >
              {baseItems.map((r, idx) => card(r, `${r.name}-measure-${idx}`))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
