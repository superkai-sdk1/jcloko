import React from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { ContactForm } from '@/components/blocks/ContactForm'
import { getSiteSettings } from '@/lib/queries'
import { getPageHeader } from '@/lib/pageHeader'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Контакты' }

const str = (v: unknown): string => (typeof v === 'string' ? v : '')

export default async function ContactsPage() {
  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null
  try {
    settings = await getSiteSettings()
  } catch {
    settings = null
  }
  const contacts = (settings?.contacts ?? {}) as Record<string, unknown>

  return (
    <>
      <PageHeader {...(await getPageHeader('contacts'))} />
      <Section tone="ink" pattern>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl uppercase text-paper">Как нас найти</h2>
              <dl className="mt-6 space-y-5">
                {str(contacts.phone) && (
                  <div>
                    <dt className="text-sm uppercase tracking-wide text-muted">Телефон</dt>
                    <dd className="mt-1 text-lg text-paper">
                      <a href={`tel:${str(contacts.phone).replace(/[^+\d]/g, '')}`} className="hover:text-primary-400">
                        {str(contacts.phone)}
                      </a>
                    </dd>
                  </div>
                )}
                {str(contacts.email) && (
                  <div>
                    <dt className="text-sm uppercase tracking-wide text-muted">Email</dt>
                    <dd className="mt-1 text-lg text-paper">
                      <a href={`mailto:${str(contacts.email).trim()}`} className="hover:text-primary-400">
                        {str(contacts.email).trim()}
                      </a>
                    </dd>
                  </div>
                )}
                {str(contacts.address) && (
                  <div>
                    <dt className="text-sm uppercase tracking-wide text-muted">Адрес</dt>
                    <dd className="mt-1 text-lg text-paper">{str(contacts.address)}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
              <h2 className="font-display text-2xl uppercase text-paper">Оставить заявку</h2>
              <p className="mt-2 text-sm text-muted">Мы перезвоним и расскажем о тренировках.</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
