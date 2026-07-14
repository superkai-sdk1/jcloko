import React from 'react'
import { getPageBySlug } from '@/lib/queries'
import { BlockRenderer } from '@/components/blocks'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const page = await getPageBySlug('glavnaya')

  if (page && Array.isArray(page.layout) && page.layout.length > 0) {
    return <BlockRenderer blocks={page.layout} />
  }

  // Фолбэк, пока в CMS не собрана «Главная»
  return (
    <Section tone="ink" pattern className="flex min-h-[70vh] items-center">
      <Container className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 font-display text-sm font-semibold uppercase tracking-[0.16em] text-primary-400">
          Клуб дзюдо
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-5xl font-bold uppercase leading-none text-paper sm:text-7xl">
          Локомотив
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
          Сила, дисциплина, движение вперёд. Соберите главную страницу из блоков в админке.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/kontakty" variant="accent" size="lg">Записаться</Button>
          <Button href="/raspisanie" variant="outline" size="lg">Расписание</Button>
        </div>
      </Container>
    </Section>
  )
}
