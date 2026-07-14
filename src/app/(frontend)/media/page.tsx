import React from 'react'
import Image from 'next/image'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
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
  const galleries = await getMediaGalleries()
  return (
    <>
      <PageHeader eyebrow="Галерея" title="Медиа" subtitle="Фотографии, фильмы и интервью клуба." />
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
                    <article className="group overflow-hidden rounded-xl border border-line bg-surface">
                      <div className="relative aspect-video overflow-hidden bg-ink-800">
                        {cover ? (
                          <Image src={cover} alt={mediaAlt(g.coverImage, str(g.title))} fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
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
                    </article>
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
