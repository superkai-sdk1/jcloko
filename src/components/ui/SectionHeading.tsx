import React from 'react'
import { cn } from '@/utils/cn'

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">
          <span className="h-px w-6 bg-accent" aria-hidden />
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl uppercase text-paper sm:text-4xl lg:text-5xl">{title}</h2>
      {subtitle && (
        <p className={cn('max-w-2xl text-muted', align === 'center' && 'mx-auto')}>{subtitle}</p>
      )}
    </div>
  )
}
