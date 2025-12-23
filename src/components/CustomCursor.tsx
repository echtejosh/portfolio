import { motion, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

type CursorMode = 'default' | 'interactive'

export function CustomCursor() {
  const shouldReduceMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState<CursorMode>('default')
  const [pressed, setPressed] = useState(false)

  const dotX = useSpring(0, { stiffness: 700, damping: 45, mass: 0.4 })
  const dotY = useSpring(0, { stiffness: 700, damping: 45, mass: 0.4 })

  const ringX = useSpring(0, { stiffness: 420, damping: 38, mass: 0.6 })
  const ringY = useSpring(0, { stiffness: 420, damping: 38, mass: 0.6 })

  const selectors = useMemo(
    () =>
      [
        'a',
        'button',
        '[role="button"]',
        '[data-cursor="interactive"]',
        'input',
        'textarea',
        'select',
      ].join(','),
    [],
  )

  useEffect(() => {
    if (shouldReduceMotion) return

    const finePointer = window.matchMedia?.('(pointer: fine)').matches ?? true
    if (!finePointer) return

    setEnabled(true)

    const onMove = (e: PointerEvent) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      ringX.set(e.clientX)
      ringY.set(e.clientY)
    }

    const onDown = () => {
      setPressed(true)
    }

    const onUp = () => {
      setPressed(false)
    }

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null
      if (!target) return
      if (target.closest(selectors)) setMode('interactive')
      else setMode('default')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointerover', onOver)
    }
  }, [dotX, dotY, ringX, ringY, selectors, shouldReduceMotion])

  if (!enabled) return null

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[100]"
        style={{ left: dotX, top: dotY }}
      >
        <div className="h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[99]"
        style={{
          left: ringX,
          top: ringY,
          scale: (mode === 'interactive' ? 1.25 : 1) * (pressed ? 0.92 : 1),
        }}
      >
        <div
          className={[
            'cursor-ring',
            'h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full',
            'border border-white/40',
            'transition-[transform,opacity] duration-150 ease-out',
            mode === 'interactive' ? 'opacity-100' : 'opacity-70',
          ].join(' ')}
        />
      </motion.div>
    </>
  )
}
