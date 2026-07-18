import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { getPageHeader } from '@/lib/pageHeader'
import { getScheduleEntries, getHalls } from '@/lib/queries'
import { ScheduleView, type SchedEntry, type HallOpt } from '@/components/site/ScheduleView'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Расписание' }

const str = (v: unknown): string => (typeof v === 'string' ? v : '')

export default async function SchedulePage() {
  const [h, rawEntries, rawHalls] = await Promise.all([getPageHeader('schedule'), getScheduleEntries(), getHalls()])

  const halls: HallOpt[] = (rawHalls as unknown as Record<string, unknown>[]).map((x) => ({
    slug: str(x.slug),
    name: str(x.name),
    city: str(x.city),
  }))

  const entries: SchedEntry[] = (rawEntries as unknown as Record<string, unknown>[]).map((e) => {
    const coach = e.coach as Record<string, unknown> | undefined
    const hall = e.hallLink as Record<string, unknown> | undefined
    return {
      id: String(e.id),
      group: str(e.group),
      day: str(e.dayOfWeek),
      start: str(e.startTime),
      end: str(e.endTime),
      coach: coach && typeof coach === 'object' ? str(coach.name) : undefined,
      hallSlug: hall && typeof hall === 'object' ? str(hall.slug) : undefined,
      hallName: hall && typeof hall === 'object' ? str(hall.name) : undefined,
      hallCity: hall && typeof hall === 'object' ? str(hall.city) : undefined,
      ageGroup: str(e.ageGroup),
    }
  })

  return (
    <>
      <PageHeader {...h} />
      <Section tone="surface">
        <Container>
          <Suspense fallback={<p className="text-muted">Загрузка расписания…</p>}>
            <ScheduleView entries={entries} halls={halls} />
          </Suspense>
        </Container>
      </Section>
    </>
  )
}
