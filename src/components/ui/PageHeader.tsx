import React from 'react'
import { Container } from './Container'

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="relative overflow-hidden border-b border-line bg-ink-800 bg-tatami">
      <Container className="py-16 lg:py-24">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">
            <span className="h-px w-6 bg-accent" aria-hidden />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-3 text-4xl font-bold uppercase text-paper sm:text-5xl lg:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-muted">{subtitle}</p>}
      </Container>
    </div>
  )
}
