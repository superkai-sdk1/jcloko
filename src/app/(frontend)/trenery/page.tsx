import React from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { getPageHeader } from '@/lib/pageHeader'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/motion/Reveal'
import { CoachCard } from '@/components/cards/PersonCard'
import { getCoaches } from '@/lib/queries'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Тренеры' }

export default async function CoachesPage() {
  const [coaches, h] = await Promise.all([getCoaches(), getPageHeader('coaches')])
  return (
    <>
      <PageHeader {...h} />
      <Section tone="ink">
        <Container>
          {coaches.length === 0 ? (
            <p className="text-muted">Информация скоро появится.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {coaches.map((c, i) => (
                <Reveal key={String(c.id)} delay={i * 0.04}>
                  <CoachCard c={c as never} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
