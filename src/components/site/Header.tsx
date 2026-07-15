'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navLinks, type NavItem } from '@/lib/nav'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import { AdTooltip } from '@/components/AdTooltip'
import { isExternalHref } from '@/lib/partnerLink'
import { ThemeToggle } from '@/components/site/ThemeToggle'

type GeneralPartner = {
  name: string
  logoUrl?: string | null
  href?: string | null
  erid?: string | null
  advertiser?: string | null
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function SponsorMark({ sponsor, align = 'right' }: { sponsor: GeneralPartner; align?: 'center' | 'right' }) {
  const hasLogo = Boolean(sponsor.logoUrl)
  const inner = hasLogo ? (
    // Обычный img (не next/image): надёжно для SVG и логотипов
    // eslint-disable-next-line @next/next/no-img-element
    <img src={sponsor.logoUrl as string} alt={sponsor.name} className="h-14 w-auto shrink-0 object-contain lg:h-20" />
  ) : (
    <span className="font-display text-base font-bold uppercase tracking-wide text-paper">
      {sponsor.name}
    </span>
  )
  // С логотипом — без рамки/фона, только картинка; без логотипа — чип с текстом.
  const box = hasLogo
    ? 'flex shrink-0 items-center transition-transform duration-300 hover:scale-105'
    : 'flex shrink-0 items-center gap-2 rounded-lg border border-line bg-surface/70 px-3 py-1.5 transition-colors hover:border-primary/50'
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

/** Один пункт десктоп-навигации (с выпадающим меню при наличии children). */
function DesktopNavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))
  const active = isActive(item.href) || (item.children?.some((c) => isActive(c.href)) ?? false)
  const base =
    'group/link relative flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-3 py-2 font-display text-[15px] font-medium uppercase tracking-wide transition-colors'
  const underline = (
    <span
      className={cn(
        'absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300',
        active ? 'scale-x-100' : 'scale-x-0 group-hover/link:scale-x-100',
      )}
      aria-hidden
    />
  )

  if (!item.children) {
    return (
      <Link href={item.href} className={cn(base, active ? 'text-primary-400' : 'text-paper/80 hover:text-paper')}>
        {item.label}
        {underline}
      </Link>
    )
  }

  return (
    <div className="group relative">
      <Link
        href={item.href}
        className={cn(base, active ? 'text-primary-400' : 'text-paper/80 hover:text-paper')}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
        {underline}
      </Link>
      {/* pt-3 создаёт зазор, оставаясь частью зоны наведения (мост для курсора) */}
      <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div className="w-80 overflow-hidden rounded-2xl border border-line bg-ink/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-md">
          {item.children.map((c) => {
            const cActive = isActive(c.href)
            return (
              <Link
                key={c.href}
                href={c.href}
                className={cn(
                  'block rounded-xl px-3.5 py-3 transition-colors',
                  cActive ? 'bg-surface-2' : 'hover:bg-surface-2',
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full transition-colors',
                      cActive ? 'bg-accent' : 'bg-primary-400/60',
                    )}
                    aria-hidden
                  />
                  <span className={cn('font-display text-sm font-semibold uppercase tracking-wide', cActive ? 'text-primary-400' : 'text-paper')}>
                    {c.label}
                  </span>
                </span>
                {c.description && <span className="mt-1 block pl-3.5 text-xs leading-snug text-muted">{c.description}</span>}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
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

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-colors duration-300',
        scrolled || open ? 'bg-ink/95 backdrop-blur border-b border-line' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-5 sm:px-6 lg:h-24 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="На главную">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={clubName} className="h-11 w-auto lg:h-14" />
          ) : (
            <span className="grid h-11 w-11 place-items-center rounded-md bg-accent font-display text-2xl font-bold text-white lg:h-14 lg:w-14">
              Л
            </span>
          )}
          <span className="hidden shrink-0 whitespace-nowrap font-display text-lg font-bold uppercase tracking-wide text-paper sm:block lg:text-xl">
            {clubName}
          </span>
        </Link>

        {/* Центр-право: десктоп-навигация + логотип ген. спонсора одной группой */}
        <div className="hidden items-center gap-5 lg:flex xl:gap-8">
          <nav className="flex items-center gap-0.5">
            {navLinks.map((l) => (
              <DesktopNavItem key={l.href} item={l} pathname={pathname} />
            ))}
          </nav>
          {generalPartner && <SponsorMark sponsor={generalPartner} align="right" />}
        </div>

        {/* Переключатель темы — отдельной зоной в самом правом углу */}
        <div className="hidden shrink-0 lg:flex">
          <ThemeToggle />
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
            const active = isActive(l.href) || (l.children?.some((c) => isActive(c.href)) ?? false)
            return (
              <div key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    'block rounded-md px-3 py-3 font-display text-base font-medium uppercase tracking-wide',
                    active ? 'text-primary-400' : 'text-paper/85 hover:bg-surface-2',
                  )}
                >
                  {l.label}
                </Link>
                {l.children && (
                  <div className="mb-1 ml-3 border-l border-line pl-3">
                    {l.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className={cn(
                          'block rounded-md px-3 py-2.5 text-sm uppercase tracking-wide',
                          isActive(c.href) ? 'text-primary-400' : 'text-paper/70 hover:bg-surface-2 hover:text-paper',
                        )}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          <div className="mt-3 px-3">
            <Button href="/kontakty" variant="accent" size="md" className="w-full">
              Записаться
            </Button>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line px-3 pt-4">
            <span className="text-xs uppercase tracking-wide text-muted">Тема оформления</span>
            <ThemeToggle showLabel />
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
