import React from 'react'
import { Oswald, Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { ScrollProgress } from '@/components/motion/ScrollProgress'
import { getSiteSettings, getGeneralPartner } from '@/lib/queries'
import { mediaUrl } from '@/lib/media'
import { resolvePartnerHref } from '@/lib/partnerLink'
import { resolveNav } from '@/lib/nav'

const oswald = Oswald({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://chickenflow.ru'),
  title: {
    default: 'Клуб дзюдо «Локомотив»',
    template: '%s — Клуб дзюдо «Локомотив»',
  },
  description:
    'Клуб дзюдо «Локомотив» — тренировки, расписание, тренеры, новости и достижения спортсменов.',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Клуб дзюдо «Локомотив»',
    title: 'Клуб дзюдо «Локомотив»',
    description:
      'Тренировки по дзюдо для детей и взрослых. Расписание, тренеры, новости клуба «Локомотив».',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  // Настройки сайта; при недоступности БД (например, во время сборки) — дефолты.
  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null
  let generalPartner: {
    name: string
    logoUrl?: string | null
    href?: string | null
    erid?: string | null
    advertiser?: string | null
  } | null = null
  try {
    settings = await getSiteSettings()
    const gp = await getGeneralPartner()
    if (gp && typeof gp.name === 'string') {
      generalPartner = {
        name: gp.name,
        logoUrl: mediaUrl(gp.logo),
        href: resolvePartnerHref(gp),
        erid: typeof gp.erid === 'string' ? gp.erid : null,
        advertiser: typeof gp.advertiserInfo === 'string' ? gp.advertiserInfo : null,
      }
    }
  } catch {
    settings = null
  }

  const clubName = settings?.clubName || 'Клуб дзюдо «Локомотив»'
  const logoUrl = mediaUrl(settings?.logo)
  const navItems = resolveNav(settings?.navigation)
  const footer = (settings?.footer ?? {}) as {
    linksHeading?: string
    contactsHeading?: string
    rightsText?: string
  }

  // Ставим тему (light/dark) до первой отрисовки, чтобы не было мигания.
  // По умолчанию «Авто» — из prefers-color-scheme ОС.
  const themeInit = `(function(){try{var p=localStorage.getItem('theme');if(p!=='light'&&p!=='dark'&&p!=='system')p='system';var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=p==='system'?(d?'dark':'light'):p;var e=document.documentElement;e.classList.remove('light','dark');e.classList.add(t);e.dataset.themePref=p;}catch(e){document.documentElement.classList.add('dark');}})();`

  return (
    <html lang="ru" className={`${oswald.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col bg-ink font-sans text-paper antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <ScrollProgress />
        <Header
          clubName={settings?.clubName || 'Локомотив'}
          logoUrl={logoUrl}
          generalPartner={generalPartner}
          navItems={navItems}
        />
        <main className="flex-1">{children}</main>
        <Footer
          clubName={clubName}
          logoUrl={logoUrl}
          tagline={settings?.tagline || undefined}
          contacts={settings?.contacts as never}
          socials={settings?.socials as never}
          footerText={settings?.footerText || undefined}
          navItems={navItems}
          linksHeading={footer.linksHeading || undefined}
          contactsHeading={footer.contactsHeading || undefined}
          rightsText={footer.rightsText || undefined}
        />
      </body>
    </html>
  )
}
