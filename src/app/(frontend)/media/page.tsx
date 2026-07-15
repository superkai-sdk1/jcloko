import React from 'react'
import { Img } from '@/components/ui/Img'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { getPageHeader } from '@/lib/pageHeader'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/motion/Reveal'
import { getMediaGalleries } from '@/lib/queries'
import { mediaSize, mediaUrl, mediaAlt } from '@/lib/media'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Медиа' }

const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const kindLabel: Record<string, string> = { photo: 'Фото', film: 'Фильм', interview: 'Интервью' }

export default async function MediaPage() {
  const [galleries, h] = await Promise.all([getMediaGalleries(), getPageHeader('media')])
  return (
    <>
      <PageHeader {...h} />
      <Section tone="ink">
        <Container>
          {galleries.length === 0 ? (
            <p className="text-muted">Материалы скоро появятся.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleries.map((g, i) => {
                const cover = mediaSize(g.coverImage, 'card') || mediaUrl(g.coverImage)
                const isVideo = str(g.kind) !== 'photo'
                return (
                  <Reveal key={String(g.id)} delay={i * 0.04}>
                    <Link
                      href={`/media/${str(g.slug)}`}
                      className="group block overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-primary/50"
                    >
                      <div className="relative aspect-video overflow-hidden bg-ink-800">
                        {cover ? (
                          <Img src={cover} alt={mediaAlt(g.coverImage, str(g.title))} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="h-full w-full bg-tatami" />
                        )}
                        {isVideo && (
                          <span className="absolute inset-0 grid place-items-center">
                            <span className="grid h-14 w-14 place-items-center rounded-full bg-accent/90 text-white">▶</span>
                          </span>
                        )}
                        <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-xs font-medium text-primary-400 backdrop-blur">
                          {kindLabel[str(g.kind)] || 'Медиа'}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-lg font-semibold text-paper">{str(g.title)}</h3>
                      </div>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
