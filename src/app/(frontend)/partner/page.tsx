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
const logoOf = (p: P): string | null => mediaUrl(p.pageLogo) || mediaUrl(p.logo)

/** Обёртка ячейки: ссылка (если задана) + маркировка «Реклама» (erid). */
function CellLink({ p, children }: { p: P; children: React.ReactNode }) {
  const href = resolvePartnerHref(p as never)
  const external = href ? isExternalHref(href) : false
  const body = href ? (
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
  )
  return (
    <AdTooltip className="block h-full w-full" erid={str(p.erid) || null} advertiser={str(p.advertiserInfo) || null}>
      {body}
    </AdTooltip>
  )
}

/** Белый «чип» с логотипом — так любой логотип виден на любой теме. */
function LogoChip({ src, alt, big = false }: { src: string | null; alt: string; big?: boolean }) {
  return (
    <div className={cn('flex items-center justify-center rounded-xl bg-white', big ? 'p-8' : 'p-6')}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className={cn('w-auto max-w-full object-contain', big ? 'max-h-28' : 'max-h-16')} />
      ) : (
        <span className="font-display text-lg font-bold uppercase text-ink/70">{alt}</span>
      )}
    </div>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(240px,1fr)]">
              {/* Генеральный партнёр — крупная выделенная ячейка */}
              {general && (
                <Reveal variant="scale" className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
                  <div className="h-full">
                    <CellLink p={general}>
                      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary-400/50 bg-gradient-to-br from-primary/12 via-surface to-surface p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-primary-400 hover:shadow-2xl sm:p-8">
                        <span className="absolute right-4 top-4 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
                          Генеральный партнёр
                        </span>
                        <LogoChip src={logoOf(general)} alt={mediaAlt(general.pageLogo || general.logo, str(general.name))} big />
                        <div className="mt-6 flex flex-1 flex-col">
                          <h2 className="font-display text-2xl font-bold uppercase text-paper sm:text-3xl">{str(general.name)}</h2>
                          {str(general.description) && (
                            <p className="mt-3 max-w-2xl leading-relaxed text-paper/80">{str(general.description)}</p>
                          )}
                          {resolvePartnerHref(general as never) && (
                            <span className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-semibold uppercase tracking-wide text-primary-400">
                              Перейти
                              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                            </span>
                          )}
                        </div>
                      </article>
                    </CellLink>
                  </div>
                </Reveal>
              )}

              {/* Остальные партнёры */}
              {rest.map((p, i) => (
                <Reveal key={String(p.id)} delay={(i % 3) * 0.05} className="h-full">
                  <CellLink p={p}>
                    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/50 hover:shadow-xl hover:shadow-black/30">
                      <LogoChip src={logoOf(p)} alt={mediaAlt(p.pageLogo || p.logo, str(p.name))} />
                      <div className="mt-4 flex flex-1 flex-col">
                        <h3 className="font-display text-lg font-semibold uppercase text-paper">{str(p.name)}</h3>
                        {str(p.description) && (
                          <p className="mt-1.5 line-clamp-4 text-sm leading-relaxed text-muted">{str(p.description)}</p>
                        )}
                      </div>
                    </article>
                  </CellLink>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
