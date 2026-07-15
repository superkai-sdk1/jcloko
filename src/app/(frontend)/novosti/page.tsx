import React from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { getPageHeader } from '@/lib/pageHeader'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/motion/Reveal'
import { NewsCard } from '@/components/cards/NewsCard'
import { getNews } from '@/lib/queries'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Новости' }

export default async function NewsPage() {
  const [news, h] = await Promise.all([getNews(30), getPageHeader('news')])
  return (
    <>
      <PageHeader {...h} />
      <Section tone="ink">
        <Container>
          {news.length === 0 ? (
            <p className="text-muted">Пока новостей нет.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((n, i) => (
                <Reveal key={String(n.id)} delay={i * 0.04}>
                  <NewsCard n={n as never} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
