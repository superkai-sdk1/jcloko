import React from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/motion/Reveal'
import { DocCard } from '@/components/site/DocCard'
import { getDocuments } from '@/lib/queries'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Документы',
  description: 'Официальные документы и сведения об организации — просмотр и скачивание.',
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const num = (v: unknown): number | null => (typeof v === 'number' ? v : null)

export default async function DocumentsPage() {
  const docs = (await getDocuments()) as unknown as Record<string, unknown>[]

  return (
    <>
      <PageHeader
        eyebrow="О клубе"
        title="Документы"
        subtitle="Официальные документы и сведения об организации — можно посмотреть онлайн или скачать."
      />
      <Section tone="ink">
        <Container className="max-w-4xl">
          {docs.length === 0 ? (
            <p className="text-muted">Документы скоро появятся.</p>
          ) : (
            <div className="space-y-4">
              {docs.map((d, i) => (
                <Reveal key={String(d.id)} delay={(i % 4) * 0.04}>
                  <DocCard
                    title={str(d.title)}
                    description={str(d.description)}
                    url={str(d.url)}
                    filename={str(d.filename)}
                    mimeType={str(d.mimeType)}
                    filesize={num(d.filesize)}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
