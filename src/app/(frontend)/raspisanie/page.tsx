import React from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { BlockRenderer } from '@/components/blocks'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Расписание' }

export default function SchedulePage() {
  return (
    <>
      <PageHeader eyebrow="Тренировки" title="Расписание" subtitle="Занятия по возрастам и уровням подготовки." />
      <BlockRenderer blocks={[{ blockType: 'scheduleTable', showAll: true, heading: 'Расписание тренировок' }]} />
    </>
  )
}
