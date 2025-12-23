import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../lib/cn'

type LogoItem = {
  name: string
  src?: string
  invert?: boolean
  size?: 'md' | 'lg'
}

export function LogoMarquee({
  title,
  items,
  variant = 'cards',
  fullBleed = false,
  chrome = 'soft',
  className,
}: {
  title: string
  items: ReadonlyArray<LogoItem>
  variant?: 'cards' | 'text'
  fullBleed?: boolean
  chrome?: 'soft' | 'none'
  className?: string
}) {
  const shouldReduceMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const baseRef = useRef<HTMLDivElement | null>(null)
  const [repeatFactor, setRepeatFactor] = useState(1)
  const [baseWidth, setBaseWidth] = useState(0)

  const baseItems = useMemo(() => {
    if (items.length === 0) return []
    const out: LogoItem[] = []
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
      setBaseWidth((prev) =>
        Math.abs(prev - nextBaseWidth) < 1 ? prev : nextBaseWidth,
      )

      if (!items.length || nextBaseWidth <= 0 || containerWidth <= 0) return

      // Ensure one "base" is wider than the viewport to avoid empty gaps during the loop.
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

  const wrapperClassName = (() => {
    if (variant !== 'text') {
      return cn('rounded-3xl border border-white/10 bg-white/[0.03] p-6', className)
    }

    const base = fullBleed
      ? 'relative left-1/2 w-screen -translate-x-1/2'
      : 'rounded-3xl border border-white/10 px-6 py-6'

    if (chrome === 'none') {
      return cn('py-10', base, className)
    }

    return cn(
      'border-y border-white/10 bg-black py-6',
      fullBleed ? base : cn(base, 'bg-white/[0.03]'),
      className,
    )
  })()

  const edgeFadeClassName = fullBleed ? 'from-black' : 'from-black/80'

  return (
    <div className={wrapperClassName}>
      <div
        className={cn(
          'mx-auto w-full max-w-6xl px-4 sm:px-6',
          fullBleed ? '' : 'px-0',
        )}
      >
        <div className="text-sm tracking-tight text-white/60">
          {title}
        </div>
      </div>

      <div ref={containerRef} className="relative mt-4 overflow-hidden">
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r to-transparent',
            edgeFadeClassName,
          )}
        />
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l to-transparent',
            edgeFadeClassName,
          )}
        />

        {shouldReduceMotion ? (
          <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-2 sm:px-6">
            {items.map((item) => (
              <div
                key={item.name}
                className="flex items-center rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white/70"
              >
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.name}
                    className={cn(
                      item.size === 'lg' ? 'h-7 w-auto opacity-80 grayscale' : 'h-6 w-auto opacity-80 grayscale',
                      item.invert ? 'invert' : '',
                    )}
                    draggable={false}
                    loading="lazy"
                  />
                ) : (
                  item.name
                )}
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className={cn(
              'flex w-max will-change-transform',
              variant === 'text' ? 'gap-14 py-3' : 'gap-6 py-2',
            )}
            initial={{ x: 0 }}
            animate={{ x: baseWidth ? -baseWidth : 0 }}
            transition={{
              duration: baseWidth ? Math.max(14, baseWidth / 55) : 24,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            {loopItems.map((item, idx) => (
              <div
                key={`${item.name}-${idx}`}
                className={cn(
                  'flex flex-none items-center',
                  variant === 'text'
                    ? 'px-0'
                    : 'rounded-2xl border border-white/10 bg-black/35 px-4 py-2',
                )}
              >
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.name}
                    className={cn(
                      'mt-0.5',
                      variant === 'text'
                        ? item.size === 'lg'
                          ? 'h-11 w-auto opacity-80 grayscale'
                          : 'h-9 w-auto opacity-80 grayscale'
                        : item.size === 'lg'
                          ? 'h-9 w-auto opacity-80 grayscale'
                          : 'h-7 w-auto opacity-80 grayscale',
                      item.invert ? 'invert' : '',
                    )}
                    draggable={false}
                    loading="lazy"
                  />
                ) : variant === 'text' ? (
                  <div className="text-2xl font-semibold tracking-tight text-white/70 sm:text-3xl">
                    {item.name}
                  </div>
                ) : (
                  <div className="text-xs font-medium tracking-wide text-white/70">
                    {item.name}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Hidden measurement row for base width (not animated). */}
        <div
          ref={baseRef}
          aria-hidden
          className={cn(
            'pointer-events-none absolute left-0 top-0 -z-10 opacity-0',
            'flex w-max',
            variant === 'text' ? 'gap-14 py-3' : 'gap-6 py-2',
          )}
        >
          {baseItems.map((item, idx) => (
            <div
              key={`${item.name}-measure-${idx}`}
              className={cn(
                'flex flex-none items-center',
                variant === 'text'
                  ? 'px-0'
                  : 'rounded-2xl border border-white/10 bg-black/35 px-4 py-2',
              )}
            >
              {item.src ? (
                <img
                  src={item.src}
                  alt=""
                  className={cn(
                    'mt-0.5',
                    variant === 'text'
                      ? item.size === 'lg'
                        ? 'h-11 w-auto opacity-80 grayscale'
                        : 'h-9 w-auto opacity-80 grayscale'
                      : item.size === 'lg'
                        ? 'h-9 w-auto opacity-80 grayscale'
                        : 'h-7 w-auto opacity-80 grayscale',
                    item.invert ? 'invert' : '',
                  )}
                  draggable={false}
                  loading="lazy"
                />
              ) : variant === 'text' ? (
                <div className="text-2xl font-semibold tracking-tight text-white/70 sm:text-3xl">
                  {item.name}
                </div>
              ) : (
                <div className="text-xs font-medium tracking-wide text-white/70">
                  {item.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
