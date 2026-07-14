import React from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { navLinks } from '@/lib/nav'

type Socials = { telegram?: string; vk?: string; youtube?: string; rutube?: string }
type Contacts = { phone?: string; email?: string; address?: string }

export function Footer({
  clubName = 'Клуб дзюдо «Локомотив»',
  tagline,
  contacts,
  socials,
  footerText,
}: {
  clubName?: string
  tagline?: string
  contacts?: Contacts
  socials?: Socials
  footerText?: string
}) {
  const year = new Date().getFullYear()
  const socialEntries = Object.entries(socials ?? {}).filter(([, v]) => Boolean(v)) as [
    string,
    string,
  ][]
  const socialLabels: Record<string, string> = {
    telegram: 'Telegram',
    vk: 'ВКонтакте',
    youtube: 'YouTube',
    rutube: 'RuTube',
  }

  return (
    <footer className="border-t border-line bg-ink-800">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-accent font-display text-xl font-bold text-white">
                Л
              </span>
              <span className="font-display text-lg font-bold uppercase tracking-wide text-paper">
                {clubName}
              </span>
            </div>
            {tagline && <p className="mt-4 max-w-sm text-sm text-muted">{tagline}</p>}
            {footerText && <p className="mt-3 max-w-sm text-sm text-muted">{footerText}</p>}
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-paper">
              Разделы
            </h3>
            <ul className="mt-4 space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted transition-colors hover:text-paper">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-paper">
              Контакты
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {contacts?.phone && (
                <li>
                  <a href={`tel:${contacts.phone.replace(/[^+\d]/g, '')}`} className="hover:text-paper">
                    {contacts.phone}
                  </a>
                </li>
              )}
              {contacts?.email && (
                <li>
                  <a href={`mailto:${contacts.email}`} className="hover:text-paper">
                    {contacts.email}
                  </a>
                </li>
              )}
              {contacts?.address && <li>{contacts.address}</li>}
            </ul>
            {socialEntries.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-3">
                {socialEntries.map(([key, url]) => (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary-400 hover:text-primary"
                    >
                      {socialLabels[key] ?? key}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {clubName}. Все права защищены.</p>
          <Link href="/politika" className="hover:text-paper">
            Политика конфиденциальности
          </Link>
        </div>
      </Container>
    </footer>
  )
}
