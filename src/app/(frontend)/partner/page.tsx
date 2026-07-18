import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/motion/Reveal'
import { AdTooltip } from '@/components/AdTooltip'
import { getPartners } from '@/lib/queries'
import { mediaUrl, mediaAlt } from '@/lib/media'
import { resolvePartnerHref, isExternalHref } from '@/lib/partnerLink'
import { cn } from '@/utils/cn'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Партнёры',
  description: 'Партнёры и спонсоры клуба дзюдо «Локомотив» — логотипы и описания.',
}

type P = Record<string, unknown>
const str = (v: unknown): string => (typeof v === 'string' ? v : '')
// На белых чипах предпочитаем видимую (тёмную/цветную) версию логотипа.
const logoOf = (p: P): string | null => mediaUrl(p.pageLogo) || mediaUrl(p.logoLight) || mediaUrl(p.logo)

/** Обёртка ячейки: ссылка (если задана) + маркировка «Реклама» (erid). */
function Cell({ p, span, children }: { p: P; span?: string; children: React.ReactNode }) {
  const href = resolvePartnerHref(p as never)
  const external = href ? isExternalHref(href) : false
  const card = (
    <AdTooltip className="block h-full w-full" erid={str(p.erid) || null} advertiser={str(p.advertiserInfo) || null}>
      {href ? (
        <Link
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="block h-full"
          aria-label={str(p.name) || 'Партнёр'}
        >
          {children}
        </Link>
      ) : (
        <div className="h-full">{children}</div>
      )}
    </AdTooltip>
  )
  return <Reveal className={cn('h-full', span)}>{card}</Reveal>
}

/* ── Плитки Bento ───────────────────────────────────────────────────────── */

/** Крупная плитка генерального партнёра (2×2). Лого светлое → на тёмной панели. */
function FeaturedTile({ p }: { p: P }) {
  const logo = (mediaUrl(p.logo) || logoOf(p)) as string | null
  const href = resolvePartnerHref(p as never)
  return (
    <article className="group relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-3xl border border-primary-400/50 bg-surface shadow-xl shadow-black/25 transition-transform duration-300 ease-out hover:scale-[1.015] lg:min-h-0">
      <span className="absolute left-5 top-5 z-10 rounded-full border border-accent/50 bg-accent/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent backdrop-blur">
        Генеральный партнёр
      </span>
      <div className="flex flex-1 items-center justify-center bg-[#0e1b14] p-10">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={mediaAlt(p.logo, str(p.name))} className="max-h-24 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105 lg:max-h-36" />
        ) : (
          <span className="font-display text-2xl font-bold uppercase text-paper">{str(p.name)}</span>
        )}
      </div>
      <div className="p-6 sm:p-7">
        <h2 className="font-display text-xl font-bold uppercase text-paper sm:text-2xl">{str(p.name)}</h2>
        {str(p.description) && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{str(p.description)}</p>}
        {href && (
          <span className="mt-3 inline-flex items-center gap-1.5 font-display text-sm font-semibold uppercase tracking-wide text-primary-400">
            Перейти на сайт
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        )}
      </div>
    </article>
  )
}

/** Широкая плитка (2×1): лого слева, текст справа. */
function WideTile({ p }: { p: P }) {
  const logo = logoOf(p)
  return (
    <article className="group flex h-full min-h-[200px] overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 ease-out hover:scale-[1.015] hover:border-primary-400/50 lg:min-h-0">
      <div className="flex w-2/5 shrink-0 items-center justify-center bg-white p-5">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={mediaAlt(p.pageLogo || p.logo, str(p.name))} className="max-h-16 w-auto max-w-full object-contain lg:max-h-20" />
        ) : (
          <span className="font-display text-base font-bold uppercase text-ink/70">{str(p.name)}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
        <h3 className="font-display text-lg font-semibold uppercase text-paper">{str(p.name)}</h3>
        {str(p.description) && <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted">{str(p.description)}</p>}
      </div>
    </article>
  )
}

/** Обычная плитка (1×1): лого сверху, текст снизу. */
function SmallTile({ p }: { p: P }) {
  const logo = logoOf(p)
  return (
    <article className="group flex h-full min-h-[220px] flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 ease-out hover:scale-[1.02] hover:border-primary-400/50 lg:min-h-0">
      <div className="flex h-[46%] shrink-0 items-center justify-center bg-white p-4">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={mediaAlt(p.pageLogo || p.logo, str(p.name))} className="max-h-14 w-auto max-w-full object-contain" />
        ) : (
          <span className="font-display text-sm font-bold uppercase text-ink/70">{str(p.name)}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-semibold uppercase leading-tight text-paper">{str(p.name)}</h3>
        {str(p.description) && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{str(p.description)}</p>}
      </div>
    </article>
  )
}

export default async function PartnerPage() {
  const partners = (await getPartners()) as unknown as P[]
  const general = partners.find((p) => p.isGeneralPartner === true) ?? null
  const rest = partners.filter((p) => p !== general)

  return (
    <>
      <PageHeader
        eyebrow="Поддержка"
        title="Наши партнёры"
        subtitle="Компании и организации, которые помогают клубу развивать дзюдо."
      />

      <Section tone="ink">
        <Container>
          {partners.length === 0 ? (
            <p className="text-muted">Список партнёров скоро появится.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[240px] lg:[grid-auto-flow:row_dense]">
              {general && (
                <Cell p={general} span="sm:col-span-2 lg:col-span-2 lg:row-span-2">
                  <FeaturedTile p={general} />
                </Cell>
              )}
              {rest.map((p, i) =>
                // Первую обычную плитку делаем широкой (2×1) — чтобы ровно заполнить
                // ряд рядом с крупной ячейкой ген. партнёра.
                i === 0 ? (
                  <Cell key={String(p.id)} p={p} span="sm:col-span-2 lg:col-span-2">
                    <WideTile p={p} />
                  </Cell>
                ) : (
                  <Cell key={String(p.id)} p={p}>
                    <SmallTile p={p} />
                  </Cell>
                ),
              )}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
