'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { cn } from '@/utils/cn'

type Pref = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'theme'

/** Применяет выбранную тему к <html> (резолвит «Авто» через prefers-color-scheme). */
function applyTheme(pref: Pref) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = pref === 'system' ? (prefersDark ? 'dark' : 'light') : pref
  const el = document.documentElement
  el.classList.remove('light', 'dark')
  el.classList.add(resolved)
  el.dataset.themePref = pref
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

const OPTIONS: { key: Pref; label: string; Icon: (p: { className?: string }) => React.ReactElement }[] = [
  { key: 'system', label: 'Авто (как в системе)', Icon: IconAuto },
  { key: 'light', label: 'Светлая тема', Icon: IconLight },
  { key: 'dark', label: 'Тёмная тема', Icon: IconDark },
]

/**
 * Переключатель темы: Авто / Светлая / Тёмная. По умолчанию «Авто» — берётся из
 * настроек ОС. Выбор сохраняется в localStorage; при «Авто» тема следует за
 * системной в реальном времени.
 */
export function ThemeToggle({ className, size = 'sm' }: { className?: string; size?: 'sm' | 'md' }) {
  // На сервере и при первом рендере клиента — 'system' (совпадает → без гидрационных ошибок)
  const [pref, setPref] = useState<Pref>('system')

  useEffect(() => {
    let stored: Pref = 'system'
    try {
      const v = localStorage.getItem(STORAGE_KEY)
      if (v === 'light' || v === 'dark' || v === 'system') stored = v
    } catch {}
    setPref(stored)

    // При «Авто» реагируем на смену системной темы
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      let cur: Pref = 'system'
      try {
        const v = localStorage.getItem(STORAGE_KEY)
        if (v === 'light' || v === 'dark' || v === 'system') cur = v
      } catch {}
      if (cur === 'system') applyTheme('system')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const choose = useCallback((p: Pref) => {
    setPref(p)
    try {
      localStorage.setItem(STORAGE_KEY, p)
    } catch {}
    applyTheme(p)
  }, [])

  const btn = size === 'md' ? 'h-9 w-9' : 'h-7 w-7'
  const icon = size === 'md' ? 'h-[18px] w-[18px]' : 'h-4 w-4'

  return (
    <div
      role="group"
      aria-label="Тема оформления"
      className={cn('inline-flex items-center gap-0.5 rounded-full border border-line bg-surface/60 p-0.5', className)}
    >
      {OPTIONS.map((o) => {
        const active = pref === o.key
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => choose(o.key)}
            aria-label={o.label}
            aria-pressed={active}
            title={o.label}
            className={cn(
              'grid cursor-pointer place-items-center rounded-full transition-colors',
              btn,
              active ? 'bg-surface-2 text-primary-400' : 'text-muted hover:text-paper',
            )}
          >
            <o.Icon className={icon} />
          </button>
        )
      })}
    </div>
  )
}
