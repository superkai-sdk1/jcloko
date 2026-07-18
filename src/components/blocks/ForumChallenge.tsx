import React from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/Reveal'
import { getGeneralPartner } from '@/lib/queries'
import { mediaUrl } from '@/lib/media'
import { resolvePartnerHref, isExternalHref } from '@/lib/partnerLink'
import { ThemedLogo } from '@/components/ui/ThemedLogo'

type Block = Record<string, unknown>
const str = (v: unknown): string => (typeof v === 'string' ? v : '')

const SLIDES = [
  { src: '/forum/slide-1.jpg', caption: 'Клубный турнир «Вызов Локомотива»' },
  { src: '/forum/slide-2.jpg', caption: 'История турнира: 2021–2023' },
  { src: '/forum/slide-3.jpg', caption: 'История турнира: 2024' },
  { src: '/forum/slide-4.jpg', caption: '2025 — слово президента Федерации дзюдо России' },
  { src: '/forum/slide-5.jpg', caption: 'Кавказский инвестиционный форум' },
  { src: '/forum/slide-6.jpg', caption: 'Программа на 26 мая' },
  { src: '/forum/slide-7.jpg', caption: 'Освещение в СМИ' },
]

const FACTS = [
  { k: 'Дата', v: '26 мая 2025' },
  { k: 'Город', v: 'Минеральные Воды' },
  { k: 'Площадка', v: 'МВЦ «МинводыЭКСПО»' },
  { k: 'Формат', v: '«Стенка на стенку»' },
]

const DEFAULT_INTRO =
  'Клубный турнир по дзюдо «Вызов Локомотива» проходит в рамках крупнейших деловых площадок страны — Петербургского международного экономического форума (ПМЭФ), а с 2025 года — Кавказского инвестиционного форума (КИФ). За несколько лет турнир вырос из товарищеского вызова в международное событие с участием клубов России, Европы, Азии и Латинской Америки.'

export async function ForumChallenge({ b }: { b: Block }) {
  const eyebrow = str(b.eyebrow) || 'ПМЭФ · Кавказский инвестиционный форум'
  const heading = str(b.heading) || 'Вызов Локомотива'
  const intro = str(b.intro) || DEFAULT_INTRO
  const showSlides = b.showSlides !== false

  let gp: Record<string, unknown> | null = null
  try {
    gp = await getGeneralPartner()
  } catch {
    gp = null
  }
  const gpLogo = gp ? mediaUrl(gp.logo) : null
  const gpLogoLight = gp ? mediaUrl(gp.logoLight) : null
  const gpName = gp ? str(gp.name) : ''
  const gpHref = gp ? resolvePartnerHref(gp as never) : null
  const gpExternal = gpHref ? isExternalHref(gpHref) : false

  const logoImg = gpLogo ? (
    <ThemedLogo dark={gpLogo} light={gpLogoLight} alt={gpName || 'Генеральный партнёр'} className="h-20 w-auto object-contain lg:h-28" />
  ) : null

  return (
    <>
      {/* ── Шапка форума ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-line bg-ink-800 bg-tatami">
        <Container className="py-14 lg:py-20">
          {/* Логотип генерального партнёра — крупно, по центру, в выделенной панели */}
          {logoImg && (
            <div className="mb-12 flex justify-center">
              <div className="relative inline-flex flex-col items-center gap-5 rounded-2xl border border-primary-400/50 bg-ink/70 px-10 py-8 shadow-2xl shadow-primary/10 ring-1 ring-inset ring-white/5 backdrop-blur sm:px-14">
                <span className="font-display text-xs font-semibold uppercase tracking-[0.24em] text-primary-400">
                  Генеральный партнёр
                </span>
                {gpHref ? (
                  <Link href={gpHref} {...(gpExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="transition-transform duration-300 hover:scale-105">
                    {logoImg}
                  </Link>
                ) : (
                  logoImg
                )}
              </div>
            </div>
          )}

          <span className="inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">
            <span className="h-px w-6 bg-accent" aria-hidden />
            {eyebrow}
          </span>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold uppercase text-paper sm:text-5xl lg:text-6xl">{heading}</h1>
          <p className="mt-5 max-w-3xl text-lg text-muted">{intro}</p>

          {/* Ключевые факты */}
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.k} className="rounded-xl border border-line bg-surface/50 p-4">
                <div className="font-display text-xs font-semibold uppercase tracking-wide text-primary-400">{f.k}</div>
                <div className="mt-1.5 text-sm font-medium text-paper">{f.v}</div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── Презентация (слайды) ─────────────────────────────────────────── */}
      {showSlides && (
        <Section tone="ink">
          <Container className="max-w-4xl">
            <Reveal>
              <h2 className="mb-8 font-display text-2xl font-bold uppercase text-paper sm:text-3xl">Презентация турнира</h2>
            </Reveal>
            <div className="space-y-6">
              {SLIDES.map((s, i) => (
                <Reveal key={s.src} delay={(i % 2) * 0.05}>
                  <figure className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lg shadow-black/20">
                    <a href={s.src} target="_blank" rel="noopener noreferrer" className="block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.src}
                        alt={s.caption}
                        width={1500}
                        height={844}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        className="aspect-video w-full object-cover"
                      />
                    </a>
                    <figcaption className="flex items-center gap-3 border-t border-line px-4 py-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-accent font-display text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-sm text-muted">{s.caption}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}
