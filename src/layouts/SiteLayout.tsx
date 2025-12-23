import { Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Menu } from 'iconoir-react'
import { Container } from '../components/Container'
import { CustomCursor } from '../components/CustomCursor'
import { ScrollToTopButton } from '../components/ScrollToTopButton'
import { SiteMenuDrawer } from '../components/SiteMenuDrawer'
import { WorkTogetherFooter } from '../components/WorkTogetherFooter'
import { site } from '../site'

export function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-full relative">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
      >
        Skip to content
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <Container className="pointer-events-auto pt-2 sm:pt-3">
          <div className="flex items-center justify-between gap-6">
            <Link
              to="/"
              className="text-sm font-semibold tracking-tight text-white transition hover:text-white/80"
            >
              {site.name}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              data-cursor="interactive"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className="group rounded-2xl p-3 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6 text-white/80 transition group-hover:text-white" />
            </button>
          </div>
        </Container>
      </header>

      <main id="content">
        <Outlet />
      </main>

      <SiteMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <WorkTogetherFooter />

      <ScrollToTopButton />
      <CustomCursor />
    </div>
  )
}
