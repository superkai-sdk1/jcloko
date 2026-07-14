import React from 'react'
import { Img } from '@/components/ui/Img'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { RichText } from '@/components/RichText'
import { getCoachById } from '@/lib/queries'
import { mediaUrl, mediaAlt, mediaFocal } from '@/lib/media'

export const dynamic = 'force-dynamic'

const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const c = await getCoachById(id)
  return c ? { title: str(c.name) } : {}
}

export default async function CoachDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const coach = await getCoachById(id)
  if (!coach) notFound()

  const photo = mediaUrl(coach.photo)
  const specs = arr(coach.specializations)

  return (
    <Section tone="ink" pattern>
      <Container>
        <Link href="/o-klube" className="text-sm font-medium text-primary-400 hover:text-primary">
          ← Тренерский состав
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-14">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-line bg-ink-800">
            {photo ? (
              <Img
                src={photo}
                alt={mediaAlt(coach.photo, str(coach.name))}
                fill
                priority
                focal={mediaFocal(coach.photo)}
                className="object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-tatami">
                <span className="font-display text-7xl font-bold text-line">
                  {str(coach.name).charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold uppercase text-paper sm:text-5xl">{str(coach.name)}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {str(coach.title) && (
                <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-sm text-primary-400">
                  {str(coach.title)}
                </span>
              )}
              {str(coach.rank) && (
                <span className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-muted">
                  {str(coach.rank)}
                </span>
              )}
            </div>

            {specs.length > 0 && (
              <div className="mt-6">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-paper">
                  Специализации
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {specs.map((s, i) => {
                    const sp = s as Record<string, unknown>
                    return (
                      <li
                        key={i}
                        className="rounded-md border border-line bg-surface px-3 py-1.5 text-sm text-paper"
                      >
                        {str(sp.value)}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {coach.bio ? (
              <div className="mt-8">
                <RichText data={coach.bio} />
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  )
}
