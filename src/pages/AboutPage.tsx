import { ArrowUpRight } from 'iconoir-react'
import { Container } from '../components/Container'
import { site } from '../site'

const highlights = [
  {
    title: 'Craftsmanship first',
    description:
      'I care about clarity and correctness. Software that reads well, behaves predictably, and stays maintainable as it scales.',
  },
  {
    title: 'Backend at heart',
    description:
      'Systems design, boundaries, data flows, and reliability are where I go deepest, even when I’m working across the stack.',
  },
  {
    title: 'AI that ships',
    description:
      'I enjoy turning models into real workflows: the right data, the right constraints, and outputs that stay useful and traceable.',
  },
] as const

export function AboutPage() {
  return (
    <section className="relative">
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <div className="absolute inset-0 bg-[radial-gradient(45%_45%_at_30%_25%,rgba(255,255,255,0.10),transparent_60%)]" />
      </div>

      <Container className="relative pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="instrument-serif-regular text-lg tracking-tight text-white/60">
              About me
            </div>
            <h1 className="instrument-serif-regular mt-3 text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl">
              Hi there,
            </h1>

            <div className="mt-6 grid gap-4 text-sm leading-relaxed text-white/70 sm:text-base">
              <p>
                I&apos;m Joshua Agripo, a software engineer based in the Netherlands. I
                take pride in creating applications that are intentional, closely aligned
                with their purpose, and genuinely pleasant to use and maintain for both
                clients and fellow engineers.
              </p>
              <p>
                For me, engineering is more than making things work. It&apos;s
                about understanding the problem, getting to its core, and
                designing systems that stay readable as they grow. I enjoy going
                deep on a subject, starting from first principles, challenging
                assumptions, and turning that understanding into something real.
              </p>
              <p>
                Every product I ship reflects the virtues I care about: clarity,
                quality, and thoughtfulness. Each delivery is a
                testament to refinement over time, and a standard I want others
                to feel confident building on.
              </p>
            </div>
            <div className="mt-6">
              <a
                href={site.links.resume}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black px-4 py-2 text-sm tracking-tight text-white/70 transition hover:bg-white/[0.05] hover:text-white"
              >
                View resume
                <ArrowUpRight className="h-4 w-4 text-white/60 transition group-hover:text-white" />
              </a>
            </div>
          </div>

        </div>

        <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-12">
            <div className="instrument-serif-regular text-lg tracking-tight text-white/60">
              Focus
            </div>
            <div className="instrument-serif-regular mt-2 text-3xl leading-[1.05] tracking-tight text-white sm:text-4xl">
              What I optimize for
            </div>
          </div>

          <div className="lg:col-span-12">
            <div className="border-y border-white/10">
              <div className="divide-y divide-white/10 lg:grid lg:auto-cols-fr lg:grid-flow-col lg:divide-y-0 lg:divide-x lg:divide-white/10">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="group px-6 py-8 transition hover:bg-white/[0.02] lg:px-8"
                  >
                    <div className="text-sm font-semibold tracking-tight text-white">
                      {item.title}
                    </div>
                    <div className="mt-3 text-sm leading-relaxed text-white/65">
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 lg:mt-20">
          <div className="instrument-serif-regular text-lg tracking-tight text-white/60">
            Personal
          </div>
          <div className="instrument-serif-regular mt-2 text-3xl leading-[1.05] tracking-tight text-white sm:text-4xl">
            Outside of work
          </div>
          <div className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            Outside of coding, I enjoy reading, playing piano, cooking, making art, and sharing thoughtful conversations with friends—especially those that wander into science and ideas.
          </div>
          <div className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            I’m particularly drawn to books on psychology and neuroscience. Recent favorites include <span className="italic">The Body Keeps the Score</span> by Bessel van der Kolk, which explores trauma and the brain, and <span className="italic">Delivered from Distraction</span> by Edward M. Hallowell and John J. Ratey, a deep dive into neuroscience and medicine.
          </div>
        </div>
      </Container>
    </section>
  )
}
