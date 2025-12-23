import { Container } from '../components/Container'

const experience = [
  {
    when: 'Jul 2025 – Present',
    org: 'WeAreReasonablePeople',
    role: 'Software Engineer',
    bullets: [
      'Shipped production LLM integrations end-to-end using LangChain and Nest.',
      'Built high-volume document workflows, including OEM manual processing for roughly 200 to 800 manuals and around 10.000 to 50.000 spare parts and components.',
      'Developed reusable microservice patterns to shorten delivery time.',
    ],
  },
  {
    when: 'Sep 2024 – May 2025',
    org: 'Touch Tree',
    role: 'Senior Software Engineer',
    bullets: [
      'Worked on a large-scale publication management platform across multiple countries.',
      'Mentored engineers and supported domain-driven architecture efforts.',
    ],
  },
  {
    when: 'Dec 2023 – Sep 2024',
    org: 'Touch Tree',
    role: 'Software Engineer',
    bullets: [
      'Built catalog and management tooling for publishers, including metrics and campaign integrations.',
      'Improved delivery foundations for shipping and maintainability.',
    ],
  },
  {
    when: 'Feb 2023 – Jul 2023',
    org: 'Heisa',
    role: 'Software Engineer Intern',
    bullets: [
      'Built internal tooling and automations that improved delivery workflows.',
      'Supported product features across frontend and backend systems.',
    ],
  },
  {
    when: 'Aug 2022 – Feb 2023',
    org: 'DLT Media',
    role: 'Software Engineer Intern',
    bullets: [
      'Delivered UI updates and API improvements for publishing tools.',
      'Helped streamline content workflows with practical automation.',
    ],
  },
] as const

export function WorkPage() {
  return (
    <section className="relative">
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <div className="absolute inset-0 bg-[radial-gradient(45%_45%_at_30%_25%,rgba(255,255,255,0.10),transparent_60%)]" />
      </div>

      <Container className="relative pt-28 pb-20 sm:pt-32 sm:pb-28">
        <div className="instrument-serif-regular text-lg tracking-tight text-white/60">
          Work
        </div>
        <div className="instrument-serif-regular mt-2 text-3xl leading-[1.05] tracking-tight text-white sm:text-4xl">
          Experience
        </div>
        <div className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
          A complete list of roles and responsibilities, presented in the same
          format as curated work.
        </div>

        <div className="mt-10 border-t border-white/10">
          <div className="divide-y divide-white/10">
            {experience.map((item) => (
              <div
                key={`${item.when}-${item.org}-${item.role}`}
                className="group grid gap-4 py-8 transition hover:bg-white/[0.02] lg:grid-cols-12 lg:items-start lg:gap-8"
              >
                <div className="lg:col-span-4">
                <div className="text-base font-semibold tracking-tight text-white">
                  {item.org}
                </div>
                <div className="mt-2 text-sm tracking-tight text-white/70">
                  {item.role}
                </div>
                  <div className="mt-2 text-xs tracking-tight text-white/55">
                    {item.when}
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <ul className="grid list-disc gap-2 pl-5 text-sm leading-relaxed text-white/65">
                    {item.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
