import type { CSSProperties } from 'react'
import { useMemo } from 'react'

type SkillGroup = {
  title: string
  items: ReadonlyArray<string>
}

type SkillChip = {
  label: string
  group: string
}

function hashString(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffleInPlace<T>(arr: T[], rand: () => number) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function spanForLabel(label: string) {
  const len = label.length
  if (len <= 7) return 2
  if (len <= 12) return 3
  if (len <= 18) return 4
  return 5
}

type Placement = {
  key: string
  label: string
  colStart: number
  rowStart: number
  colSpan: number
}

export function SkillsScatterGrid({
  groups,
  seed = 'skills',
}: {
  groups: ReadonlyArray<SkillGroup>
  seed?: string
}) {
  const { placements, rows, cols, rowHeight } = useMemo(() => {
    const flattened: SkillChip[] = groups.flatMap((g) =>
      g.items.map((label) => ({ label, group: g.title })),
    )

    const rng = mulberry32(hashString(seed))
    shuffleInPlace(flattened, rng)

    const cols = 12
    const rows = 10
    const rowHeight = 46
    const occupied = new Set<string>()

    const tryPlace = (chip: SkillChip, attempt: number) => {
      const maxColSpan = Math.max(2, Math.min(cols, spanForLabel(chip.label)))
      const colSpan = Math.max(
        2,
        Math.min(maxColSpan, Math.floor(2 + rng() * Math.max(1, maxColSpan - 1))),
      )
      const maxColStart = Math.max(1, cols - colSpan + 1)
      const colStart = 1 + Math.floor(rng() * maxColStart)
      const rowStart = 1 + Math.floor(rng() * rows)

      const cells: string[] = []
      for (let c = colStart; c < colStart + colSpan; c += 1) {
        cells.push(`${rowStart}:${c}`)
      }

      const collides = cells.some((k) => occupied.has(k))
      if (collides) return null

      for (const k of cells) occupied.add(k)

      return {
        key: `${chip.group}:${chip.label}:${attempt}`,
        label: chip.label,
        colStart,
        rowStart,
        colSpan,
      } satisfies Placement
    }

    const placements: Placement[] = []
    for (let i = 0; i < flattened.length; i += 1) {
      const chip = flattened[i]
      let placed: Placement | null = null
      for (let attempt = 0; attempt < 160; attempt += 1) {
        placed = tryPlace(chip, attempt)
        if (placed) break
      }
      if (!placed) {
        // Fallback: place sequentially if we're out of good slots.
        const colSpan = Math.min(cols, spanForLabel(chip.label))
        const rowStart = 1 + (i % rows)
        const colStart = 1 + ((i * 3) % Math.max(1, cols - colSpan + 1))
        placed = {
          key: `${chip.group}:${chip.label}:fallback`,
          label: chip.label,
          colStart,
          rowStart,
          colSpan,
        }
      }
      placements.push(placed)
    }

    return { placements, rows, cols, rowHeight }
  }, [groups, seed])

  const backgroundStyle = {
    '--grid-cols': String(cols),
    '--grid-row': `${rowHeight}px`,
  } as CSSProperties

  return (
    <div className="rounded-3xl border border-white/10 bg-black p-6 sm:p-8 lg:p-10">
      <div
        className={[
          'relative overflow-hidden rounded-2xl border border-white/5 bg-black/30',
          'bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]',
          '[background-size:calc(100%/var(--grid-cols))_var(--grid-row)]',
        ].join(' ')}
        style={backgroundStyle}
      >
        <div
          className="grid grid-cols-12"
          style={{ gridTemplateRows: `repeat(${rows}, ${rowHeight}px)` }}
        >
          {placements.map((p) => (
            <div
              key={p.key}
              className="relative"
              style={{
                gridColumn: `${p.colStart} / span ${p.colSpan}`,
                gridRow: `${p.rowStart}`,
              }}
            >
              <div className="pointer-events-none absolute inset-0 flex items-center px-3">
                <div
                  className={[
                    'pointer-events-auto select-none rounded-full px-3 py-1.5',
                    'text-xs tracking-tight text-white/70',
                    'bg-white/5 ring-1 ring-inset ring-white/10',
                    'transition hover:bg-white/10 hover:text-white',
                  ].join(' ')}
                  data-cursor="interactive"
                >
                  {p.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
    </div>
  )
}
