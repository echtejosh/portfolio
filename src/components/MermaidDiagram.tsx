import mermaid from 'mermaid'
import { useEffect, useId, useMemo, useState } from 'react'
import { cn } from '../lib/cn'

let mermaidInitialized = false

function normalizeMermaidSvg(rawSvg: string) {
  // Keep the SVG responsive and avoid awkward sizing differences across browsers.
  if (!rawSvg.includes('<svg')) return rawSvg

  let svg = rawSvg

  // Ensure preserveAspectRatio exists.
  if (svg.includes('preserveAspectRatio=')) {
    svg = svg.replace(/preserveAspectRatio="[^"]*"/, 'preserveAspectRatio="xMidYMin meet"')
  } else {
    svg = svg.replace('<svg', '<svg preserveAspectRatio="xMidYMin meet"')
  }

  // Prefer responsive sizing (CSS still enforces `w-full` / `h-auto`).
  if (svg.includes(' width="')) {
    svg = svg.replace(/ width="[^"]*"/, ' width="100%"')
  } else {
    svg = svg.replace('<svg', '<svg width="100%"')
  }

  return svg
}

export function MermaidDiagram({
  definition,
  className,
}: {
  definition: string
  className?: string
}) {
  const reactId = useId()
  const diagramId = useMemo(() => `mmd-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`, [reactId])
  const [svg, setSvg] = useState<string>('')

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        flowchart: {
          curve: 'linear',
        },
        theme: 'base',
        themeVariables: {
          darkMode: true,
          background: 'transparent',
          fontFamily: 'inherit',
          // Surfaces
          primaryColor: 'rgba(255,255,255,0.02)',
          secondaryColor: 'rgba(255,255,255,0.02)',
          tertiaryColor: 'rgba(255,255,255,0.02)',
          // Text
          primaryTextColor: 'rgba(255,255,255,0.88)',
          secondaryTextColor: 'rgba(255,255,255,0.75)',
          // Borders/lines
          primaryBorderColor: 'rgba(255,255,255,0.12)',
          lineColor: 'rgba(255,255,255,0.22)',
          // Edge label pill
          edgeLabelBackground: 'rgba(0,0,0,0.92)',
          labelBackground: 'rgba(0,0,0,0.92)',
        },
        securityLevel: 'strict',
      })
      mermaidInitialized = true
    }

    let cancelled = false
    ;(async () => {
      try {
        // Validate first to avoid returning Mermaid's "Syntax error" SVG.
        await mermaid.parse(definition)
        const result = await mermaid.render(diagramId, definition)
        if (cancelled) return
        setSvg(normalizeMermaidSvg(result.svg))
      } catch {
        if (cancelled) return
        setSvg('')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [definition, diagramId])

  if (!svg) {
    return (
      <pre
        className={cn(
          'w-full overflow-x-auto rounded-3xl border border-white/10 bg-black p-6 text-xs text-white/70 sm:p-8 sm:text-sm',
          className,
        )}
      >
        <code className="whitespace-pre">{definition}</code>
      </pre>
    )
  }

  return (
    <div
      className={cn(
        'w-full rounded-3xl border border-white/10 bg-black p-6 text-white/80 sm:p-8',
        'text-center',
        className,
      )}
    >
      <div
        className={cn(
          'inline-block w-full max-w-[640px] align-top',
          '[&>svg]:inline-block [&>svg]:h-auto [&>svg]:w-full [&>svg]:max-w-full',
        )}
        // Mermaid returns sanitized SVG according to securityLevel.
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  )
}
