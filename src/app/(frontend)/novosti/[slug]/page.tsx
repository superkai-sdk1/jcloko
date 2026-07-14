import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { RichText } from '@/components/RichText'
import { getNewsBySlug } from '@/lib/queries'
import { mediaUrl, mediaAlt } from '@/lib/media'

export const dynamic = 'force-dynamic'

const str = (v: unknown): string => (typeof v === 'string' ? v : '')

function formatDate(v: unknown): string {
  if (typeof v !== 'string') return ''
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getNewsBySlug(slug)
  if (!post) return {}
  const img = mediaUrl(post.heroImage)
  const description = str(post.excerpt) || undefined
  return {
    title: str(post.title),
    description,
    openGraph: {
      type: 'article',
      title: str(post.title),
      description,
      ...(img ? { images: [{ url: img }] } : {}),
    },
  }
}

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getNewsBySlug(slug)
  if (!post) notFound()

  const img = mediaUrl(post.heroImage)

  return (
    <article>
      <div className="relative border-b border-line bg-ink-800">
        {img && (
          <div className="relative h-[42vh] min-h-72 w-full overflow-hidden">
            <Image src={img} alt={mediaAlt(post.heroImage, str(post.title))} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink to-ink/20" aria-hidden />
          </div>
        )}
        <Container className={img ? '-mt-24 pb-10' : 'py-14'}>
          <div className="relative">
            <Link href="/novosti" className="text-sm font-medium text-primary-400 hover:text-primary">
              ← Все новости
            </Link>
            {formatDate(post.publishedAt) && (
              <time className="mt-4 block text-sm uppercase tracking-wide text-muted">{formatDate(post.publishedAt)}</time>
            )}
            <h1 className="mt-2 max-w-3xl text-3xl font-bold uppercase text-paper sm:text-5xl">{str(post.title)}</h1>
          </div>
        </Container>
      </div>

      <Container className="max-w-3xl py-12">
        {str(post.excerpt) && <p className="mb-6 text-lg text-muted">{str(post.excerpt)}</p>}
        <RichText data={post.content as never} />
      </Container>
    </article>
  )
}
