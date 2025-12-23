import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Container } from './Container'
import { site } from '../site'
import { cn } from '../lib/cn'

const pageLinks = [
  { label: 'Home', to: '/' },
  { label: 'About me', to: '/about' },
  { label: 'Work', to: '/work' },
  { label: 'Blog', to: '/blog' },
] as const

export function SiteMenuDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const location = useLocation()
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, open])

  useEffect(() => {
    if (!open) return
    closeButtonRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <div
      className={cn(
        'fixed inset-0 z-[60]',
        open ? '' : 'pointer-events-none',
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-black/60 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          'absolute inset-y-0 right-0 w-screen bg-black transition-transform duration-500 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
          <div className="absolute inset-0 bg-[radial-gradient(45%_45%_at_70%_25%,rgba(255,255,255,0.10),transparent_60%)]" />
        </div>

        <Container className="relative flex h-full flex-col pt-6 pb-10 sm:pt-10">
          <div className="flex items-center justify-between">
            <div className="text-sm tracking-tight text-white/60">
              Menu
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              data-cursor="interactive"
              tabIndex={open ? 0 : -1}
              className="rounded-2xl px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Close
            </button>
          </div>

          <div className="mt-12 grid gap-8">
            <div className="grid gap-4">
              {pageLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  data-cursor="interactive"
                  tabIndex={open ? 0 : -1}
                  className="instrument-serif-regular text-5xl leading-[1.0] tracking-tight text-white/90 transition hover:text-white sm:text-6xl"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-2 grid gap-2 text-sm tracking-tight text-white/60">
              <a
                href={site.links.github}
                target="_blank"
                rel="noreferrer"
                tabIndex={open ? 0 : -1}
                className="w-fit transition hover:text-white"
              >
                GitHub
              </a>
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noreferrer"
                tabIndex={open ? 0 : -1}
                className="w-fit transition hover:text-white"
              >
                LinkedIn
              </a>
              <a
                href={site.links.resume}
                target="_blank"
                rel="noreferrer"
                tabIndex={open ? 0 : -1}
                className="w-fit transition hover:text-white"
              >
                Resume
              </a>
              <a
                href={site.links.email}
                tabIndex={open ? 0 : -1}
                className="w-fit transition hover:text-white"
              >
                Email
              </a>
            </div>
          </div>

          <div className="mt-auto pt-12">
            <div className="text-sm text-white/45">
              {site.location} · {site.availability}
            </div>
          </div>
        </Container>
      </aside>
    </div>
  )
}
