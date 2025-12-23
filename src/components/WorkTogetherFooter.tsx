import { site } from '../site'
import { Link } from 'react-router-dom'
import { Container } from './Container'

const nav = [
  { label: 'Home', to: '/' },
  { label: 'About me', to: '/about' },
  { label: 'Work', to: '/work' },
  { label: 'Blog', to: '/blog' },
] as const

function FooterLink({
  href,
  children,
  ...props
}: {
  href: string
  children: React.ReactNode
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      {...props}
      className="text-sm tracking-tight text-white/60 transition hover:text-white"
    >
      {children}
    </a>
  )
}

export function WorkTogetherFooter() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="border-t border-white/10 pt-14 pb-7 sm:pb-8">
      <Container className="pb-16 pt-10 sm:pb-20 sm:pt-14">
        <div className="text-left text-[clamp(3rem,9vw,9rem)] font-semibold leading-[0.9] tracking-tight text-white/90">
          Let&apos;s connect
        </div>
      </Container>

      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-4">
            <div className="text-sm font-semibold tracking-tight text-white">
              Contact
            </div>
            <div className="mt-4 grid gap-3">
              <FooterLink href={site.links.email}>joshuaagripo@gmail.com</FooterLink>
              <FooterLink href={site.links.phone}>+31 6 44753422</FooterLink>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:flex lg:justify-end lg:gap-24 xl:gap-32">
            <div>
              <div className="text-sm font-semibold tracking-tight text-white">
                Explore
              </div>
              <div className="mt-4 grid gap-2">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="text-sm tracking-tight text-white/60 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold tracking-tight text-white">
                Links
              </div>
              <div className="mt-4 grid gap-3">
                <FooterLink href={site.links.github} target="_blank" rel="noreferrer">
                  GitHub
                </FooterLink>
                <FooterLink href={site.links.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </FooterLink>
                <FooterLink href={site.links.resume} target="_blank" rel="noreferrer">
                  Resume
                </FooterLink>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6">
          <div className="flex flex-col gap-2 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <div>© {year} {site.name}. All rights reserved.</div>
            <div>{site.location} · {site.availability}</div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
