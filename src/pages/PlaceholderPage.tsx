import { Container } from '../components/Container'
import { Button } from '../components/Button'

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <Container className="py-16">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-soft">
        <div className="text-sm text-white/60">Coming soon</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          {title}
        </h1>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-white/70">
          This page is wired into the navigation so the layout stays consistent
          while the content is being built.
        </p>
        <div className="mt-6">
          <Button
            variant="secondary"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to top
          </Button>
        </div>
      </div>
    </Container>
  )
}
