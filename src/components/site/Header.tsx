'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { navLinks } from '@/lib/nav'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import { AdTooltip } from '@/components/AdTooltip'
import { isExternalHref } from '@/lib/partnerLink'

type GeneralPartner = {
  name: string
  logoUrl?: string | null
  href?: string | null
  erid?: string | null
  advertiser?: string | null
}

function SponsorMark({ sponsor, align = 'right' }: { sponsor: GeneralPartner; align?: 'center' | 'right' }) {
  const inner = sponsor.logoUrl ? (
    <Image src={sponsor.logoUrl} alt={sponsor.name} width={96} height={28} className="h-7 w-auto" />
  ) : (
    <span className="font-display text-sm font-bold uppercase tracking-wide text-paper">
      {sponsor.name}
    </span>
  )
  const box = 'flex items-center gap-2 rounded-lg border border-line bg-surface/70 px-3 py-1.5 transition-colors hover:border-primary/50'
  const external = sponsor.href ? isExternalHref(sponsor.href) : false
  return (
    <AdTooltip title={sponsor.name} erid={sponsor.erid} advertiser={sponsor.advertiser} align={align}>
      {sponsor.href ? (
        <Link
          href={sponsor.href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={box}
          aria-label={`Генеральный спонсор: ${sponsor.name}`}
        >
          {inner}
        </Link>
      ) : (
        <span className={box}>{inner}</span>
      )}
    </AdTooltip>
  )
}

export function Header({
  clubName = 'Локомотив',
  logoUrl,
  generalPartner,
}: {
  clubName?: string
  logoUrl?: string | null
  generalPartner?: GeneralPartner | null
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Закрываем мобильное меню при переходе
  useEffect(() => setOpen(false), [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-colors duration-300',
        scrolled || open ? 'bg-ink/95 backdrop-blur border-b border-line' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="На главную">
          {logoUrl ? (
            <Image src={logoUrl} alt={clubName} width={44} height={44} className="h-10 w-auto lg:h-11" />
          ) : (
            <span className="grid h-10 w-10 place-items-center rounded-md bg-accent font-display text-xl font-bold text-white">
              Л
            </span>
          )}
          <span className="hidden font-display text-lg font-bold uppercase tracking-wide text-paper sm:block lg:text-xl">
            {clubName}
          </span>
        </Link>

        {/* Десктоп-навигация */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => {
            const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'rounded-md px-3 py-2 font-display text-sm font-medium uppercase tracking-wide transition-colors',
                  active ? 'text-primary-400' : 'text-paper/80 hover:text-paper',
                )}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button href="/kontakty" variant="accent" size="sm">
            Записаться
          </Button>
          {/* Генеральный спонсор — в конце панели навигации */}
          {generalPartner && <SponsorMark sponsor={generalPartner} align="right" />}
        </div>

        {/* Кнопка мобильного меню */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          className="grid h-11 w-11 place-items-center rounded-md text-paper hover:bg-surface-2 lg:hidden"
        >
          <span className="relative block h-4 w-6">
            <span
              className={cn(
                'absolute left-0 block h-0.5 w-6 bg-current transition-transform duration-200',
                open ? 'top-1.5 rotate-45' : 'top-0',
              )}
            />
            <span
              className={cn(
                'absolute left-0 top-1.5 block h-0.5 w-6 bg-current transition-opacity duration-200',
                open && 'opacity-0',
              )}
            />
            <span
              className={cn(
                'absolute left-0 block h-0.5 w-6 bg-current transition-transform duration-200',
                open ? 'top-1.5 -rotate-45' : 'top-3',
              )}
            />
          </span>
        </button>
      </div>

      {/* Мобильное меню */}
      {open && (
        <nav className="border-t border-line bg-ink px-5 pb-6 pt-2 lg:hidden">
          {navLinks.map((l) => {
            const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'block rounded-md px-3 py-3 font-display text-base font-medium uppercase tracking-wide',
                  active ? 'text-primary-400' : 'text-paper/85 hover:bg-surface-2',
                )}
              >
                {l.label}
              </Link>
            )
          })}
          <div className="mt-3 px-3">
            <Button href="/kontakty" variant="accent" size="md" className="w-full">
              Записаться
            </Button>
          </div>
          {generalPartner && (
            <div className="mt-4 flex items-center gap-3 border-t border-line px-3 pt-4">
              <span className="text-xs uppercase tracking-wide text-muted">Генеральный спонсор</span>
              <SponsorMark sponsor={generalPartner} align="center" />
            </div>
          )}
        </nav>
      )}
    </header>
  )
}
