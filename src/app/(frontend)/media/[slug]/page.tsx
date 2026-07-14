import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/motion/Reveal'
import { RichText } from '@/components/RichText'
import { getMediaGalleryBySlug } from '@/lib/queries'
import { mediaUrl, mediaAlt } from '@/lib/media'
import { toEmbedUrl } from '@/lib/embed'

export const dynamic = 'force-dynamic'

const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])
const kindLabel: Record<string, string> = { photo: 'Фотогалерея', film: 'Фильм', interview: 'Интервью' }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const g = await getMediaGalleryBySlug(slug)
  return g ? { title: str(g.title) } : {}
}

export default async function GalleryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const gallery = await getMediaGalleryBySlug(slug)
  if (!gallery) notFound()

  const kind = str(gallery.kind)
  const photos = arr(gallery.photos)
  const videos = arr(gallery.videos)

  return (
    <>
      <PageHeader eyebrow={kindLabel[kind] || 'Медиа'} title={str(gallery.title)} />
      <Section tone="ink">
        <Container>
          <Link href="/media" className="text-sm font-medium text-primary-400 hover:text-primary">
            ← Все материалы
          </Link>

          {gallery.description ? (
            <div className="mt-6 max-w-3xl">
              <RichText data={gallery.description} />
            </div>
          ) : null}

          {kind === 'photo' && photos.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((p, i) => {
                const url = mediaUrl(p)
                if (!url) return null
                return (
                  <Reveal key={i} delay={i * 0.03}>
                    <div className="relative aspect-square overflow-hidden rounded-lg border border-line">
                      <Image
                        src={url}
                        alt={mediaAlt(p, str(gallery.title))}
                        fill
                        sizes="(max-width:640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </Reveal>
                )
              })}
            </div>
          )}

          {(kind === 'film' || kind === 'interview') && videos.length > 0 && (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {videos.map((v, i) => {
                const vid = v as Record<string, unknown>
                const url = str(vid.url)
                if (!url) return null
                return (
                  <Reveal key={i} delay={i * 0.05}>
                    <div>
                      <div className="relative aspect-video overflow-hidden rounded-xl border border-line bg-black">
                        <iframe
                          src={toEmbedUrl(str(vid.provider), url)}
                          title={str(vid.title) || str(gallery.title)}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                          className="absolute inset-0 h-full w-full"
                        />
                      </div>
                      {str(vid.title) && <p className="mt-2 text-sm text-muted">{str(vid.title)}</p>}
                    </div>
                  </Reveal>
                )
              })}
            </div>
          )}

          {((kind === 'photo' && photos.length === 0) ||
            ((kind === 'film' || kind === 'interview') && videos.length === 0)) && (
            <p className="mt-8 text-muted">Материалы скоро появятся.</p>
          )}
        </Container>
      </Section>
    </>
  )
}
