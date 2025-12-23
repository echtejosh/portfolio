import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export function Tag({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/75',
        className,
      )}
    >
      {children}
    </span>
  )
}
