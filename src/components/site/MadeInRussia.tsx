import React from 'react'
import Link from 'next/link'

/**
 * Знак «Сделано в России» (файл в public). Логотип чёрный на прозрачном фоне,
 * поэтому на тёмной теме инвертируется в белый (правило .dark .made-in-russia в
 * globals.css). Ведёт на страницу команды разработки.
 */
export function MadeInRussia({ className }: { className?: string }) {
  return (
    <Link
      href="/razrabotka"
      aria-label="Сделано в России — о команде разработки"
      title="Сделано в России"
      className={`inline-block transition-opacity hover:opacity-70 ${className ?? ''}`}
    >
      {/* Обычный img — статичный ассет из public */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/sdelano-v-rossii.png" alt="Сделано в России" className="made-in-russia h-8 w-auto" />
    </Link>
  )
}
