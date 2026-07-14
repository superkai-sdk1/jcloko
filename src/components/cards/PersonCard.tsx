import React from 'react'
import Link from 'next/link'
import { Img } from '@/components/ui/Img'
import { mediaUrl, mediaAlt, mediaSize, mediaFocal } from '@/lib/media'

type Person = Record<string, unknown>
const str = (v: unknown): string => (typeof v === 'string' ? v : '')

function PersonShell({
  photo,
  name,
  primary,
  secondary,
  href,
}: {
  photo: unknown
  name: string
  primary?: string
  secondary?: string
  href?: string
}) {
  const img = mediaSize(photo, 'card') || mediaUrl(photo)
  const Wrapper = href ? Link : 'div'
  const wrapperProps = href ? { href } : {}
  return (
    <Wrapper
      {...(wrapperProps as { href: string })}
      className="group block h-full overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-primary/50"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-ink-800">
        {img ? (
          <Img
            src={img}
            alt={mediaAlt(photo, name)}
            fill
            focal={mediaFocal(photo)}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-tatami">
            <span className="font-display text-5xl font-bold text-line">{name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent" aria-hidden />
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold uppercase text-paper">{name}</h3>
        {primary && <p className="mt-1 text-sm text-primary-400">{primary}</p>}
        {secondary && <p className="mt-0.5 text-sm text-muted">{secondary}</p>}
      </div>
    </Wrapper>
  )
}

export function CoachCard({ c }: { c: Person }) {
  return (
    <PersonShell
      photo={c.photo}
      name={str(c.name)}
      primary={str(c.title) || undefined}
      secondary={str(c.rank) || undefined}
      href={c.id != null ? `/trenery/${c.id}` : undefined}
    />
  )
}

export function AthleteCard({ a }: { a: Person }) {
  const year = typeof a.birthYear === 'number' ? String(a.birthYear) : ''
  return (
    <PersonShell
      photo={a.photo}
      name={str(a.name)}
      primary={str(a.rank) || undefined}
      secondary={[year && `${year} г.р.`, str(a.weightCategory)].filter(Boolean).join(' · ') || undefined}
    />
  )
}
