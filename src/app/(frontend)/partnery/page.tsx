import React from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { BlockRenderer } from '@/components/blocks'
import { getPageHeader } from '@/lib/pageHeader'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Партнёры' }

export default async function PartnersPage() {
  const h = await getPageHeader('partners')
  return (
    <>
      <PageHeader {...h} />
      <BlockRenderer blocks={[{ blockType: 'partnersStrip', showAll: true }]} />
    </>
  )
}
