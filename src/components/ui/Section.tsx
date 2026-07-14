import React from 'react'
import { cn } from '@/utils/cn'

type Tone = 'ink' | 'ink-800' | 'surface' | 'surface-2'

const toneClass: Record<Tone, string> = {
  ink: 'bg-ink',
  'ink-800': 'bg-ink-800',
  surface: 'bg-surface',
  'surface-2': 'bg-surface-2',
}

export function Section({
  id,
  tone = 'ink',
  pattern = false,
  className,
  children,
}: {
  id?: string
  tone?: Tone
  pattern?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative py-16 sm:py-20 lg:py-28',
        toneClass[tone],
        pattern && 'bg-tatami',
        className,
      )}
    >
      {children}
    </section>
  )
}
