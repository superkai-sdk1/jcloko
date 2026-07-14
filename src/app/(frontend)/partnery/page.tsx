import React from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { BlockRenderer } from '@/components/blocks'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Партнёры' }

export default function PartnersPage() {
  return (
    <>
      <PageHeader eyebrow="Поддержка" title="Партнёры" subtitle="Компании и организации, которые помогают клубу." />
      <BlockRenderer blocks={[{ blockType: 'partnersStrip', showAll: true }]} />
    </>
  )
}
