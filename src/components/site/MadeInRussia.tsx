import React from 'react'
import Link from 'next/link'

/**
 * Знак «Сделано в России» (типографская версия на currentColor — виден и на
 * тёмной, и на светлой теме). Ведёт на страницу команды разработки.
 */
export function MadeInRussia({ className }: { className?: string }) {
  return (
    <Link
      href="/razrabotka"
      aria-label="Сделано в России — о команде разработки"
      className={className}
      title="Сделано в России"
    >
      <svg viewBox="0 0 360 96" role="img" aria-hidden className="h-9 w-auto" fill="currentColor">
        {/* Монограмма RU в рамке */}
        <rect x="3" y="4" width="80" height="88" rx="4" fill="none" stroke="currentColor" strokeWidth="7" />
        <line x1="43" y1="10" x2="43" y2="86" stroke="currentColor" strokeWidth="5" />
        <text x="23" y="44" textAnchor="middle" fontFamily="var(--font-oswald), sans-serif" fontWeight="700" fontSize="40" dominantBaseline="middle">R</text>
        <text x="23" y="72" textAnchor="middle" fontFamily="var(--font-oswald), sans-serif" fontWeight="700" fontSize="40" dominantBaseline="middle">U</text>
        {/* Надпись в две строки */}
        <text x="100" y="30" fontFamily="var(--font-oswald), sans-serif" fontWeight="700" fontSize="40" letterSpacing="1" dominantBaseline="middle">СДЕЛАНО</text>
        <text x="100" y="72" fontFamily="var(--font-oswald), sans-serif" fontWeight="700" fontSize="40" letterSpacing="1" dominantBaseline="middle">В РОССИИ</text>
      </svg>
    </Link>
  )
}
