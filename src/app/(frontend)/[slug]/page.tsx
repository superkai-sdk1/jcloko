import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/queries'
import { BlockRenderer } from '@/components/blocks'

export const dynamic = 'force-dynamic'

// Зарезервированные под выделенные роуты слаги — их не обслуживает CMS-catch-all
const reserved = new Set(['novosti', 'raspisanie', 'media', 'partnery', 'kontakty', 'politika', 'api'])

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) return {}
  return {
    title: (page.metaTitle as string) || (page.title as string),
    description: (page.metaDescription as string) || undefined,
  }
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (reserved.has(slug)) notFound()

  const page = await getPageBySlug(slug)
  if (!page) notFound()

  return <BlockRenderer blocks={page.layout} />
}
