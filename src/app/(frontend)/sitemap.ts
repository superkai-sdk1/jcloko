import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'https://jcloko.ru'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['', '/o-klube', '/raspisanie', '/novosti', '/media', '/partnery', '/kontakty', '/politika']
  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.6,
  }))

  try {
    const payload = await getPayloadClient()

    const news = await payload.find({
      collection: 'news',
      where: { status: { equals: 'published' } },
      limit: 500,
      depth: 0,
    })
    for (const n of news.docs) {
      if (typeof n.slug === 'string') {
        entries.push({
          url: `${BASE}/novosti/${n.slug}`,
          lastModified: typeof n.updatedAt === 'string' ? new Date(n.updatedAt) : undefined,
        })
      }
    }

    const media = await payload.find({
      collection: 'media-galleries',
      where: { status: { equals: 'published' } },
      limit: 500,
      depth: 0,
    })
    for (const g of media.docs) {
      if (typeof g.slug === 'string') entries.push({ url: `${BASE}/media/${g.slug}` })
    }
  } catch {
    // БД недоступна (например, при сборке) — отдаём только статические маршруты
  }

  return entries
}
