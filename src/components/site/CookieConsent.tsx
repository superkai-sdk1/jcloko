'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

const KEY = 'cookie-consent'

/** Иконка cookie (без эмодзи — SVG). */
function CookieIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 2.5a9.5 9.5 0 1 0 9.4 10.8 2.6 2.6 0 0 1-3.3-3.3A2.6 2.6 0 0 1 14.8 6 2.6 2.6 0 0 1 12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="10" r="1.15" fill="currentColor" />
      <circle cx="13.5" cy="14.5" r="1.15" fill="currentColor" />
      <circle cx="8.5" cy="15" r="1" fill="currentColor" />
      <circle cx="15" cy="9.5" r="0.9" fill="currentColor" />
    </svg>
  )
}

/**
 * Плашка согласия на cookie в стиле дзюдо: тёмная карточка, «поясной» градиент
 * (зелёный → гранат), плавное появление снизу. Выбор сохраняется в localStorage.
 */
export function CookieConsent() {
  const [show, setShow] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY)
      if (v !== 'accepted' && v !== 'essential') setShow(true)
    } catch {
      setShow(true)
    }
  }, [])

  const choose = (v: 'accepted' | 'essential') => {
    try {
      localStorage.setItem(KEY, v)
    } catch {}
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Согласие на использование cookie"
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl sm:inset-x-4 sm:bottom-4"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/95 shadow-2xl shadow-black/50 backdrop-blur-md">
            {/* «Пояс» — акцентная полоса сверху */}
            <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-primary-400 to-accent" aria-hidden />
            {/* Лёгкая фактура татами */}
            <span className="pointer-events-none absolute inset-0 bg-tatami opacity-[0.35]" aria-hidden />

            <div className="relative p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-ink text-primary-400 shadow-inner">
                  <CookieIcon className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-bold uppercase tracking-wide text-paper">
                    Cookie — по правилам
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    Мы используем cookie, чтобы сайт работал и запоминал ваши настройки (например, тему
                    оформления). Как и в дзюдо — всё честно и прозрачно.{' '}
                    <Link href="/politika" className="font-medium text-primary-400 underline-offset-2 hover:underline">
                      Политика конфиденциальности
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
                <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => choose('essential')}>
                  Только необходимые
                </Button>
                <Button variant="primary" size="sm" className="w-full sm:w-auto" onClick={() => choose('accepted')}>
                  Принять все
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
