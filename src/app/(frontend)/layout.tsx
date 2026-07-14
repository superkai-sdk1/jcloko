import React from 'react'
import { Oswald, Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { getSiteSettings } from '@/lib/queries'
import { mediaUrl } from '@/lib/media'

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
  title: {
    default: 'Клуб дзюдо «Локомотив»',
    template: '%s — Клуб дзюдо «Локомотив»',
  },
  description:
    'Клуб дзюдо «Локомотив» — тренировки, расписание, тренеры, новости и достижения спортсменов.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  // Настройки сайта; при недоступности БД (например, во время сборки) — дефолты.
  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null
  try {
    settings = await getSiteSettings()
  } catch {
    settings = null
  }

  const clubName = settings?.clubName || 'Клуб дзюдо «Локомотив»'

  return (
    <html lang="ru" className={`${oswald.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col bg-ink font-sans text-paper antialiased">
        <Header clubName={settings?.clubName || 'Локомотив'} logoUrl={mediaUrl(settings?.logo)} />
        <main className="flex-1">{children}</main>
        <Footer
          clubName={clubName}
          tagline={settings?.tagline || undefined}
          contacts={settings?.contacts as never}
          socials={settings?.socials as never}
          footerText={settings?.footerText || undefined}
        />
      </body>
    </html>
  )
}
