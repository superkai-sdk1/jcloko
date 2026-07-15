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
 * Аккуратная горизонтальная карусель премиум-карточек (scroll-snap, свайп на
 * телефоне). Карточки НЕ накладываются: ровные отступы, при наведении карточка
 * приподнимается, рамка/тень подсвечиваются, картинка мягко увеличивается.
 */
export function CardScroller({
  items,
  aspect = '3 / 4',
  seeAllHref,
  seeAllLabel = 'Показать все',
  cardWidth = 'w-52',
}: {
  items: DeckItem[]
  aspect?: string
  seeAllHref?: string
  seeAllLabel?: string
  cardWidth?: string
}) {
  if (items.length === 0) return null

  const card = (it: DeckItem) => (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-line bg-surface shadow-lg shadow-black/20 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-2xl hover:shadow-black/50">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: aspect }}>
        {it.img ? (
          <Img
            src={it.img}
            alt={it.title}
            fill
            focal={it.focal}
            className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className="h-full w-full bg-tatami bg-ink-800" />
        )}
        {/* затемнение снизу для читаемости подписи */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" aria-hidden />
        {it.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-0.5 text-[11px] font-medium text-primary-400 backdrop-blur">
            {it.badge}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <span className="mb-2 block h-0.5 w-8 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100" aria-hidden />
          <h3 className="font-display text-[15px] font-semibold uppercase leading-tight text-paper">{it.title}</h3>
          {it.subtitle && <p className="mt-1 text-xs font-medium text-primary-400">{it.subtitle}</p>}
        </div>
      </div>
    </article>
  )

  return (
    <div className="relative">
      <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 pt-1 sm:gap-5">
        {items.map((it) => (
          <div key={it.key} className={cn('shrink-0 snap-start', cardWidth)}>
            {it.href ? (
              <Link href={it.href} className="block h-full cursor-pointer">
                {card(it)}
              </Link>
            ) : (
              card(it)
            )}
          </div>
        ))}
      </div>

      {seeAllHref && (
        <div className="mt-6">
          <Button href={seeAllHref} variant="outline" size="md">
            {seeAllLabel} →
          </Button>
        </div>
      )}
    </div>
  )
}
