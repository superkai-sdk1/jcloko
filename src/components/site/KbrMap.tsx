'use client'

import React, { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export type Hall = {
  id: string
  name: string
  city?: string
  address: string
  note?: string
  slug?: string
  mapX?: number
  mapY?: number
}

const MIN = 1
const MAX = 2.4

/** Пин зала на карте. */
function Marker({
  hall,
  active,
  onSelect,
  invScale,
}: {
  hall: Hall
  active: boolean
  onSelect: (h: Hall) => void
  invScale: number
}) {
  const x = typeof hall.mapX === 'number' ? hall.mapX : 50
  const y = typeof hall.mapY === 'number' ? hall.mapY : 50
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onSelect(hall)
      }}
      className="group/marker absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) scale(${invScale})` }}
      aria-label={`Зал: ${hall.name}`}
    >
      {/* Пульс */}
      <span
        className={cn(
          'absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full',
          active ? 'bg-accent/40' : 'bg-primary-400/40',
          'motion-safe:animate-ping',
        )}
        aria-hidden
      />
      {/* Точка */}
      <span
        className={cn(
          'relative block h-4 w-4 rounded-full border-2 border-white shadow-lg transition-all duration-200 group-hover/marker:scale-125',
          active ? 'bg-accent ring-4 ring-accent/30' : 'bg-primary ring-2 ring-primary/30',
        )}
      />
      {/* Подпись */}
      <span
        className={cn(
          'pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-line bg-ink/90 px-2 py-0.5 text-[11px] font-medium text-paper shadow-lg backdrop-blur transition-opacity duration-200',
          active ? 'opacity-100' : 'opacity-0 group-hover/marker:opacity-100',
        )}
      >
        {hall.city || hall.name}
      </span>
    </button>
  )
}

export function KbrMap({ halls }: { halls: Hall[] }) {
  const [active, setActive] = useState<Hall | null>(null)
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const viewportRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null)

  const clamp = useCallback((p: { x: number; y: number }, s: number) => {
    const el = viewportRef.current
    const w = el ? el.clientWidth : 600
    const h = el ? el.clientHeight : 420
    const maxX = ((s - 1) * w) / 2
    const maxY = ((s - 1) * h) / 2
    return { x: Math.max(-maxX, Math.min(maxX, p.x)), y: Math.max(-maxY, Math.min(maxY, p.y)) }
  }, [])

  const zoomTo = useCallback(
    (next: number) => {
      const s = Math.max(MIN, Math.min(MAX, next))
      setScale(s)
      setPos((p) => (s === 1 ? { x: 0, y: 0 } : clamp(p, s)))
    },
    [clamp],
  )

  const onWheel = (e: React.WheelEvent) => {
    if (e.deltaY === 0) return
    e.preventDefault()
    zoomTo(scale + (e.deltaY < 0 ? 0.25 : -0.25))
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return
    drag.current = { x: pos.x, y: pos.y, px: e.clientX, py: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    const nx = drag.current.x + (e.clientX - drag.current.px)
    const ny = drag.current.y + (e.clientY - drag.current.py)
    setPos(clamp({ x: nx, y: ny }, scale))
  }
  const onPointerUp = () => {
    drag.current = null
  }

  const invScale = 1 / scale

  return (
    <div className="relative">
      <div
        ref={viewportRef}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onClick={() => setActive(null)}
        className={cn(
          'relative aspect-[10/7] w-full touch-none select-none overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-ink-800 to-ink shadow-2xl shadow-black/30',
          scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default',
        )}
      >
        {/* Холст (зум/пан) */}
        <div
          className="absolute inset-0 origin-center transition-transform duration-100 ease-out"
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})` }}
        >
          <MapArt />
          {halls.map((h) => (
            <Marker key={h.id} hall={h} active={active?.id === h.id} onSelect={setActive} invScale={invScale} />
          ))}
        </div>

        {/* Управление зумом */}
        <div className="absolute right-3 top-3 z-20 flex flex-col gap-1.5">
          {[
            { label: '+', fn: () => zoomTo(scale + 0.3), aria: 'Приблизить' },
            { label: '−', fn: () => zoomTo(scale - 0.3), aria: 'Отдалить' },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                b.fn()
              }}
              aria-label={b.aria}
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-line bg-ink/80 font-display text-lg font-bold text-paper backdrop-blur transition-colors hover:border-primary-400/60 hover:bg-surface-2"
            >
              {b.label}
            </button>
          ))}
          {scale > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                zoomTo(1)
              }}
              aria-label="Сбросить масштаб"
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-line bg-ink/80 text-paper backdrop-blur transition-colors hover:border-primary-400/60 hover:bg-surface-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                <path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.4 2.6L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
          )}
        </div>

        {/* Подпись-подсказка */}
        <div className="pointer-events-none absolute bottom-3 right-3 z-20 rounded-lg border border-line bg-ink/70 px-3 py-1.5 text-[11px] text-muted backdrop-blur">
          Кабардино-Балкарская Республика · точки — залы
        </div>

        {/* Карточка выбранного зала */}
        <AnimatePresence>
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-3 left-3 z-30 w-[min(20rem,calc(100%-1.5rem))] rounded-2xl border border-primary-400/40 bg-ink/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-md"
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Закрыть"
                className="absolute right-2.5 top-2.5 grid h-7 w-7 cursor-pointer place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-paper"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
              {active.city && (
                <div className="font-display text-[11px] font-semibold uppercase tracking-wide text-primary-400">{active.city}</div>
              )}
              <h3 className="mt-0.5 pr-6 font-display text-lg font-bold uppercase leading-tight text-paper">{active.name}</h3>
              <p className="mt-1.5 flex items-start gap-1.5 text-sm text-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden>
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {active.address}
              </p>
              {active.note && <p className="mt-1 text-xs text-muted">{active.note}</p>}
              <Link
                href={active.slug ? `/raspisanie?zal=${active.slug}` : '/raspisanie'}
                className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 font-display text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary-600"
              >
                Расписание зала →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ── Рисунок карты КБР (стилизованный) ──────────────────────────────────── */
function MapArt() {
  return (
    <svg viewBox="0 0 1000 700" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <linearGradient id="kbrFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b3327" />
          <stop offset="1" stopColor="#10231a" />
        </linearGradient>
        <linearGradient id="ridge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#33a06a" stopOpacity="0.25" />
          <stop offset="1" stopColor="#1f7a4d" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Силуэт республики */}
      <path
        d="M175 200 C 240 150, 300 140, 360 165 C 430 135, 510 160, 590 140 C 680 120, 760 155, 820 205 C 865 250, 855 320, 840 380 C 828 440, 800 500, 760 560 C 720 615, 660 645, 610 640 C 560 660, 505 620, 460 655 C 410 690, 350 655, 300 665 C 240 650, 190 600, 165 545 C 130 500, 120 435, 130 375 C 138 315, 150 250, 175 200 Z"
        fill="url(#kbrFill)"
        stroke="#33a06a"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Внутренняя подсветка границы */}
      <path
        d="M175 200 C 240 150, 300 140, 360 165 C 430 135, 510 160, 590 140 C 680 120, 760 155, 820 205 C 865 250, 855 320, 840 380 C 828 440, 800 500, 760 560 C 720 615, 660 645, 610 640 C 560 660, 505 620, 460 655 C 410 690, 350 655, 300 665 C 240 650, 190 600, 165 545 C 130 500, 120 435, 130 375 C 138 315, 150 250, 175 200 Z"
        fill="none"
        stroke="#5fd69b"
        strokeWidth="1"
        strokeOpacity="0.35"
      />

      {/* Реки */}
      <g stroke="#4aa3ff" strokeOpacity="0.4" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M320 470 C 360 400, 400 340, 470 300 C 520 270, 540 230, 560 190" />
        <path d="M640 520 C 650 450, 660 380, 690 320 C 710 280, 720 240, 720 200" />
        <path d="M470 300 C 520 320, 560 340, 620 350" strokeOpacity="0.25" />
      </g>

      {/* Горный массив на юге + Эльбрус (ЮЗ) */}
      <g>
        <path d="M150 560 L 240 470 L 320 545 L 410 460 L 500 560 L 590 470 L 690 570 L 780 500 L 840 560 L 840 660 L 150 660 Z" fill="url(#ridge)" />
        {/* Эльбрус — двойная вершина */}
        <g transform="translate(250 470)">
          <path d="M-60 90 L 0 -30 L 22 10 L 40 -20 L 100 90 Z" fill="#2a4436" stroke="#5fd69b" strokeOpacity="0.4" strokeWidth="2" strokeLinejoin="round" />
          <path d="M-18 30 L 0 -30 L 14 6 Z" fill="#eaf3ee" fillOpacity="0.9" />
          <path d="M28 22 L 40 -20 L 56 30 Z" fill="#eaf3ee" fillOpacity="0.9" />
        </g>
        {/* мелкие пики */}
        {[
          [430, 500],
          [560, 520],
          [690, 520],
          [770, 540],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x - 42} ${y + 60} L ${x} ${y} L ${x + 42} ${y + 60} Z`} fill="#233a2e" stroke="#33a06a" strokeOpacity="0.3" strokeWidth="1.5" strokeLinejoin="round" />
        ))}
      </g>

      {/* Заголовок-подпись */}
      <text x="185" y="230" fill="#5fd69b" fillOpacity="0.5" fontSize="22" fontFamily="var(--font-oswald), sans-serif" fontWeight="700" letterSpacing="3">
        КБР
      </text>
      <text x="290" y="640" fill="#eaf3ee" fillOpacity="0.55" fontSize="15" fontFamily="var(--font-oswald), sans-serif" letterSpacing="2">
        ГЛАВНЫЙ КАВКАЗСКИЙ ХРЕБЕТ
      </text>
    </svg>
  )
}
