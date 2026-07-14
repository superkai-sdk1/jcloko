import React from 'react'
import Link from 'next/link'
import { Img } from '@/components/ui/Img'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export type DeckItem = {
  key: string
  href?: string
  img: string | null
  title: string
  subtitle?: string
  badge?: string
  focal?: string
}

/**
 * Горизонтальная «колода» карточек: карточки накладываются друг на друга
 * (отрицательный отступ), при наведении выплывают вверх и увеличиваются.
 * На телефоне — свайп-скролл. Плюс кнопка «Показать все».
 */
export function CardScroller({
  items,
  aspect = '3 / 4',
  seeAllHref,
  seeAllLabel = 'Показать все',
  cardWidth = 'w-44',
}: {
  items: DeckItem[]
  aspect?: string
  seeAllHref?: string
  seeAllLabel?: string
  cardWidth?: string
}) {
  if (items.length === 0) return null

  const wrapperClass = cn(
    'group/card relative -ml-8 shrink-0 snap-start first:ml-0 cursor-pointer',
    'transition-[transform] duration-300 ease-out hover:z-30 hover:-translate-y-3 hover:scale-[1.06] focus-visible:z-30',
    cardWidth,
  )

  const inner = (it: DeckItem) => (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xl ring-1 ring-black/5 transition-shadow duration-300 group-hover/card:shadow-2xl">
      <div className="relative w-full" style={{ aspectRatio: aspect }}>
        {it.img ? (
          <Img src={it.img} alt={it.title} fill focal={it.focal} className="object-cover" />
        ) : (
          <div className="h-full w-full bg-tatami bg-ink-800" />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/55 to-transparent p-4 pt-12">
          <div className="font-display text-sm font-semibold uppercase leading-tight text-paper">{it.title}</div>
          {it.subtitle && (
            <div className="mt-0.5 max-h-0 overflow-hidden text-xs text-primary-400 opacity-0 transition-all duration-300 group-hover/card:max-h-10 group-hover/card:opacity-100">
              {it.subtitle}
            </div>
          )}
        </div>
        {it.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-0.5 text-[11px] font-medium text-primary-400 backdrop-blur">
            {it.badge}
          </span>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <div className="no-scrollbar -mx-1 flex snap-x overflow-x-auto px-1 pb-8 pt-6">
        {items.map((it) =>
          it.href ? (
            <Link key={it.key} href={it.href} className={wrapperClass}>
              {inner(it)}
            </Link>
          ) : (
            <div key={it.key} className={wrapperClass}>
              {inner(it)}
            </div>
          ),
        )}
      </div>

      {seeAllHref && (
        <div className="mt-2">
          <Button href={seeAllHref} variant="outline" size="md">
            {seeAllLabel} →
          </Button>
        </div>
      )}
    </div>
  )
}
