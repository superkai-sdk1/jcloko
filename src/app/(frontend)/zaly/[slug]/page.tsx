import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/motion/Reveal'
import { Img } from '@/components/ui/Img'
import { KbrMap, type Hall } from '@/components/site/KbrMap'
import { getHallBySlug, getScheduleForHall } from '@/lib/queries'
import { mediaUrl, mediaAlt } from '@/lib/media'

export const dynamic = 'force-dynamic'

const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const num = (v: unknown): number | undefined => (typeof v === 'number' ? v : undefined)

const dayLabels: Record<string, string> = {
  mon: 'Понедельник', tue: 'Вторник', wed: 'Среда', thu: 'Четверг',
  fri: 'Пятница', sat: 'Суббота', sun: 'Воскресенье',
}
const dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const hall = (await getHallBySlug(slug)) as unknown as Record<string, unknown> | null
  if (!hall) return {}
  return { title: `${str(hall.name)} — зал`, description: `${str(hall.city)}, ${str(hall.address)}. Расписание и контакты зала клуба дзюдо «Локомотив».` }
}

export default async function HallPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const hall = (await getHallBySlug(slug)) as unknown as Record<string, unknown> | null
  if (!hall) notFound()

  const entries = (await getScheduleForHall(hall.id as string | number)) as unknown as Record<string, unknown>[]
  const byDay = dayOrder
    .map((d) => ({ day: d, items: entries.filter((e) => str(e.dayOfWeek) === d) }))
    .filter((g) => g.items.length > 0)

  const photo = mediaUrl(hall.photo)
  const coach = hall.coach as Record<string, unknown> | undefined
  const coachName = coach && typeof coach === 'object' ? str(coach.name) : ''

  const mapHall: Hall = {
    id: String(hall.id),
    name: str(hall.name),
    city: str(hall.city),
    address: str(hall.address),
    note: str(hall.note),
    slug: str(hall.slug),
    mapX: num(hall.mapX),
    mapY: num(hall.mapY),
  }

  const contacts: { label: string; value: string; href?: string }[] = [
    { label: 'Адрес', value: str(hall.address) },
    ...(str(hall.phone) ? [{ label: 'Телефон', value: str(hall.phone), href: `tel:${str(hall.phone).replace(/[^+\d]/g, '')}` }] : []),
    ...(str(hall.note) ? [{ label: 'Вместимость', value: str(hall.note) }] : []),
    ...(coachName ? [{ label: 'Тренер', value: coachName }] : []),
  ]

  return (
    <>
      <PageHeader eyebrow={str(hall.city) || 'Залы'} title={str(hall.name)} subtitle={str(hall.address)} />

      <Section tone="ink">
        <Container>
          <Link href="/zaly" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-paper">
            ← Все залы
          </Link>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            {/* Инфо о зале */}
            <Reveal>
              <div className="space-y-6">
                {photo && (
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line">
                    <Img src={photo} alt={mediaAlt(hall.photo, str(hall.name))} fill className="object-cover" />
                  </div>
                )}

                {str(hall.description) && (
                  <p className="whitespace-pre-line leading-relaxed text-paper/85">{str(hall.description)}</p>
                )}

                <div className="rounded-2xl border border-line bg-surface p-5">
                  <h2 className="font-display text-lg font-semibold uppercase text-paper">Контакты</h2>
                  <dl className="mt-4 space-y-3">
                    {contacts.map((c) => (
                      <div key={c.label}>
                        <dt className="text-xs uppercase tracking-wide text-muted">{c.label}</dt>
                        <dd className="mt-0.5 text-paper">
                          {c.href ? (
                            <a href={c.href} className="hover:text-primary-400">{c.value}</a>
                          ) : (
                            c.value
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <a
                    href={`https://yandex.ru/maps/?text=${encodeURIComponent(`${str(hall.city)}, ${str(hall.address)}, Кабардино-Балкария`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line px-5 font-display text-sm font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-surface-2"
                  >
                    Маршрут на карте →
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Карта с этим залом */}
            <Reveal delay={0.08}>
              <div>
                <KbrMap halls={[mapHall]} initialActiveId={mapHall.id} />
                <p className="mt-3 text-center text-xs text-muted">Зал на карте Кабардино-Балкарии</p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Расписание зала */}
      <Section tone="surface">
        <Container>
          <h2 className="mb-8 font-display text-2xl font-bold uppercase text-paper sm:text-3xl">Расписание зала</h2>
          {byDay.length === 0 ? (
            <p className="text-muted">Расписание для этого зала пока не заполнено.</p>
          ) : (
            <div className="space-y-8">
              {byDay.map((group) => (
                <div key={group.day}>
                  <h3 className="mb-3 font-display text-xl uppercase text-primary-400">{dayLabels[group.day]}</h3>
                  <div className="overflow-hidden rounded-xl border border-line">
                    {group.items.map((e) => {
                      const ec = e.coach as Record<string, unknown> | undefined
                      return (
                        <div key={String(e.id)} className="flex flex-wrap items-center gap-x-6 gap-y-1 border-b border-line bg-ink px-5 py-3 last:border-0">
                          <span className="w-28 font-display text-lg font-semibold tabular-nums text-paper">
                            {str(e.startTime)}
                            {str(e.endTime) ? `–${str(e.endTime)}` : ''}
                          </span>
                          <span className="min-w-40 flex-1 text-paper">{str(e.group)}</span>
                          {str(e.ageGroup) && <span className="text-sm text-muted">{str(e.ageGroup)}</span>}
                          {ec && typeof ec === 'object' && str(ec.name) && <span className="text-sm text-muted">{str(ec.name)}</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
