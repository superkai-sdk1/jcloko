import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { mediaSize, mediaUrl, mediaAlt } from '@/lib/media'

type News = Record<string, unknown>
const str = (v: unknown): string => (typeof v === 'string' ? v : '')

const platformBadge: Record<string, string> = {
  telegram: 'Telegram',
  vk: 'ВКонтакте',
}

function formatDate(v: unknown): string {
  if (typeof v !== 'string') return ''
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function NewsCard({ n }: { n: News }) {
  const img = mediaSize(n.heroImage, 'card') || mediaUrl(n.heroImage)
  const origin = str(n.originPlatform)
  const badge = platformBadge[origin]
  const href = `/novosti/${str(n.slug)}`

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-primary/50">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-ink-800">
        {img ? (
          <Image
            src={img}
            alt={mediaAlt(n.heroImage, str(n.title))}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-tatami" />
        )}
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-xs font-medium text-primary-400 backdrop-blur">
            {badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {formatDate(n.publishedAt) && (
          <time className="text-xs uppercase tracking-wide text-muted">{formatDate(n.publishedAt)}</time>
        )}
        <h3 className="mt-2 font-display text-xl font-semibold text-paper">
          <Link href={href} className="transition-colors hover:text-primary-400">
            {str(n.title)}
          </Link>
        </h3>
        {str(n.excerpt) && <p className="mt-2 line-clamp-3 text-sm text-muted">{str(n.excerpt)}</p>}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-400">
          Читать →
        </span>
      </div>
    </article>
  )
}
