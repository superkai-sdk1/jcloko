import React from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { BlockRenderer } from '@/components/blocks'
import { getPageHeader } from '@/lib/pageHeader'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Расписание' }

export default async function SchedulePage() {
  const h = await getPageHeader('schedule')
  return (
    <>
      <PageHeader {...h} />
      <BlockRenderer blocks={[{ blockType: 'scheduleTable', showAll: true, heading: 'Расписание тренировок' }]} />
    </>
  )
}
