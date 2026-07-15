'use client'

import React from 'react'
import Link from 'next/link'

/** Кнопка «Поддержка» внизу боковой навигации админки. */
export function SupportNavLink() {
  return (
    <Link href="/admin/support" className="loko-support-link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3.2" />
        <path d="m5.6 5.6 3.1 3.1M15.3 15.3l3.1 3.1M15.3 8.7l3.1-3.1M5.6 18.4l3.1-3.1" />
      </svg>
      <span>Поддержка</span>
    </Link>
  )
}

export default SupportNavLink
