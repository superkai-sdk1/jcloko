'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { cn } from '@/utils/cn'

type Pref = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'theme'
const ORDER: Pref[] = ['system', 'light', 'dark']
const LABEL: Record<Pref, string> = { system: 'Авто', light: 'Светлая', dark: 'Тёмная' }

/** Применяет выбранную тему к <html> (резолвит «Авто» через prefers-color-scheme). */
function applyTheme(pref: Pref) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = pref === 'system' ? (prefersDark ? 'dark' : 'light') : pref
  const el = document.documentElement
  el.classList.remove('light', 'dark')
  el.classList.add(resolved)
  el.dataset.themePref = pref
}

function readPref(): Pref {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {}
  return 'system'
}

function IconAuto({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}
function IconLight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}
function IconDark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}
const ICON: Record<Pref, (p: { className?: string }) => React.ReactElement> = {
  system: IconAuto,
  light: IconLight,
  dark: IconDark,
}

/**
 * Переключатель темы — одна кнопка, циклически меняющая состояние:
 * Авто → Светлая → Тёмная → Авто. По умолчанию «Авто» (из настроек ОС, следит за
 * системной темой в реальном времени). Выбор сохраняется в localStorage.
 */
export function ThemeToggle({ className, showLabel = false }: { className?: string; showLabel?: boolean }) {
  // На сервере и при первом рендере — 'system' (совпадает → без гидрационных ошибок)
  const [pref, setPref] = useState<Pref>('system')

  useEffect(() => {
    setPref(readPref())
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (readPref() === 'system') applyTheme('system')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const cycle = useCallback(() => {
    setPref((cur) => {
      const next = ORDER[(ORDER.indexOf(cur) + 1) % ORDER.length]
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {}
      applyTheme(next)
      return next
    })
  }, [])

  const Icon = ICON[pref]
  const next = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length]
  const title = `Тема: ${LABEL[pref]}. Нажмите — ${LABEL[next]}`

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Тема оформления: ${LABEL[pref]}. Нажмите, чтобы переключить`}
      title={title}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface/60 text-paper transition-colors hover:border-primary-400/60 hover:bg-surface-2',
        showLabel ? 'h-10 px-4' : 'h-10 w-10 justify-center',
        className,
      )}
    >
      <Icon className="h-[18px] w-[18px]" />
      {showLabel && <span className="font-display text-sm font-medium uppercase tracking-wide">{LABEL[pref]}</span>}
    </button>
  )
}
