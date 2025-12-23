import { NavLink as RRNavLink } from 'react-router-dom'
import { cn } from '../lib/cn'

export function NavLink({
  to,
  children,
  onClick,
}: {
  to: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <RRNavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'rounded-full px-3 py-2 text-sm transition',
          'text-white/70 hover:text-white hover:bg-white/10',
          isActive &&
            'text-white bg-white/5 ring-1 ring-inset ring-white/10',
        )
      }
    >
      {children}
    </RRNavLink>
  )
}
