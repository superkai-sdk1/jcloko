import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/motion/Reveal'
import { KbrMap, type Hall } from '@/components/site/KbrMap'
import { loadHallsWithSchedule } from '@/lib/hallMap'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Залы',
  description: 'Спортзалы клуба дзюдо «Локомотив» на карте Кабардино-Балкарии — адреса и расписание.',
}

export default async function HallsPage() {
  const halls: Hall[] = await loadHallsWithSchedule()

  return (
    <>
      <PageHeader
        eyebrow="Где мы тренируем"
        title="Наши залы"
        subtitle="Спортзалы клуба на карте Кабардино-Балкарии. Нажмите точку, чтобы увидеть адрес и перейти к расписанию зала."
      />

      <Section tone="ink">
        <Container>
          {halls.length === 0 ? (
            <p className="text-muted">Список залов скоро появится.</p>
          ) : (
            <>
              <Reveal>
                <KbrMap halls={halls} />
              </Reveal>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {halls.map((h, i) => (
                  <Reveal key={h.id} delay={(i % 3) * 0.05} className="h-full">
                    <Link
                      href={h.slug ? `/zaly/${h.slug}` : '/zaly'}
                      className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/50 hover:shadow-xl hover:shadow-black/30"
                    >
                      {h.city && (
                        <div className="font-display text-[11px] font-semibold uppercase tracking-wide text-primary-400">{h.city}</div>
                      )}
                      <h3 className="mt-0.5 font-display text-lg font-semibold uppercase leading-tight text-paper">{h.name}</h3>
                      <p className="mt-1.5 flex items-start gap-1.5 text-sm text-muted">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden>
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {h.address}
                      </p>
                      {h.note && <p className="mt-1 text-xs text-muted">{h.note}</p>}
                      <span className="mt-auto pt-4 inline-flex items-center gap-1.5 font-display text-sm font-semibold uppercase tracking-wide text-primary-400">
                        Подробнее о зале
                        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </Container>
      </Section>
    </>
  )
}
