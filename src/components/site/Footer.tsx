import React from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { navLinks, type NavItem } from '@/lib/nav'
import { MadeInRussia } from '@/components/site/MadeInRussia'

type Socials = { telegram?: string; vk?: string; youtube?: string; rutube?: string }
type Contacts = { phone?: string; email?: string; address?: string }

export function Footer({
  clubName = 'Клуб дзюдо «Локомотив»',
  logoUrl,
  tagline,
  contacts,
  socials,
  footerText,
  navItems = navLinks,
  linksHeading = 'Разделы',
  contactsHeading = 'Контакты',
  rightsText = 'Все права защищены.',
}: {
  clubName?: string
  logoUrl?: string | null
  tagline?: string
  contacts?: Contacts
  socials?: Socials
  footerText?: string
  navItems?: NavItem[]
  linksHeading?: string
  contactsHeading?: string
  rightsText?: string
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
              {logoUrl ? (
                // Тот же логотип, что и в шапке (не заглушка «Л»)
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt={clubName} className="h-11 w-auto" />
              ) : (
                <span className="grid h-11 w-11 place-items-center rounded-md bg-accent font-display text-xl font-bold text-white">
                  Л
                </span>
              )}
              <span className="font-display text-lg font-bold uppercase tracking-wide text-paper">
                {clubName}
              </span>
            </div>
            {tagline && <p className="mt-4 max-w-sm text-sm text-muted">{tagline}</p>}
            {footerText && <p className="mt-3 max-w-sm text-sm text-muted">{footerText}</p>}
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-paper">
              {linksHeading}
            </h3>
            <ul className="mt-4 space-y-2">
              {navItems.map((l) => (
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
              {contactsHeading}
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

        <div className="mt-12 flex flex-col items-center gap-5 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:justify-between">
          <p className="order-2 sm:order-1">© {year} {clubName}. {rightsText}</p>
          <MadeInRussia className="order-1 text-paper/70 transition-colors hover:text-paper sm:order-2" />
          <Link href="/politika" className="order-3 hover:text-paper">
            Политика конфиденциальности
          </Link>
        </div>
      </Container>
    </footer>
  )
}
