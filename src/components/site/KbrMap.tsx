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
          'relative aspect-[1000/749] w-full touch-none select-none overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-ink-800 to-ink shadow-2xl shadow-black/30',
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
        <div className="absolute bottom-3 right-3 z-20 rounded-lg border border-line bg-ink/70 px-3 py-1.5 text-[11px] text-muted backdrop-blur">
          Кабардино-Балкарская Республика · точки — залы ·{' '}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="pointer-events-auto underline hover:text-paper">
            границы © OpenStreetMap
          </a>
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

/* Контур Кабардино-Балкарии — упрощённая административная граница (данные © OpenStreetMap, ODbL). */
const KBR_BORDER =
  'M 40.0,472.1 L 48.0,481.3 L 47.1,491.8 L 59.8,496.4 L 65.8,517.9 L 102.7,539.4 L 133.8,546.5 L 156.9,563.9 L 161.1,562.1 L 161.3,541.7 L 197.4,532.4 L 218.0,545.0 L 238.9,538.3 L 247.9,553.1 L 269.4,555.7 L 267.3,569.6 L 294.7,573.4 L 316.7,590.2 L 305.7,601.8 L 320.9,632.6 L 347.6,644.4 L 360.7,662.1 L 373.4,666.0 L 379.0,680.9 L 428.1,698.8 L 435.4,694.4 L 442.8,709.0 L 470.2,705.0 L 482.3,687.2 L 481.7,674.6 L 489.3,662.1 L 544.6,677.6 L 566.8,637.7 L 561.1,621.7 L 572.3,614.8 L 578.2,585.3 L 601.2,566.3 L 619.1,563.6 L 621.6,551.1 L 611.2,543.6 L 621.4,512.5 L 655.6,452.1 L 668.4,467.1 L 668.8,483.9 L 690.9,492.5 L 694.2,501.1 L 703.0,474.3 L 730.7,483.5 L 716.5,499.9 L 729.7,518.5 L 752.0,494.4 L 770.9,485.8 L 744.8,435.3 L 773.3,397.6 L 774.1,388.8 L 791.6,384.9 L 801.9,406.5 L 804.5,437.8 L 866.7,377.3 L 874.3,385.0 L 881.3,411.7 L 918.7,390.8 L 906.5,376.0 L 921.2,349.4 L 919.7,322.7 L 932.9,298.9 L 915.6,284.7 L 913.5,239.2 L 889.5,233.7 L 882.8,241.2 L 865.8,242.0 L 856.4,235.8 L 843.6,202.8 L 843.9,164.0 L 854.4,164.7 L 854.6,116.0 L 876.3,108.6 L 876.4,84.1 L 908.7,84.3 L 908.9,42.3 L 887.3,49.3 L 887.2,68.2 L 844.3,73.3 L 844.1,100.5 L 825.5,100.3 L 825.3,94.5 L 790.5,94.4 L 790.6,69.6 L 723.2,69.4 L 723.2,60.2 L 704.9,60.0 L 704.8,46.2 L 695.2,40.0 L 669.8,59.4 L 667.6,75.6 L 651.2,75.8 L 630.1,94.9 L 630.1,127.3 L 621.4,138.7 L 619.3,159.9 L 552.3,142.0 L 533.4,144.9 L 502.6,131.6 L 476.7,135.2 L 434.8,171.1 L 395.7,76.3 L 369.4,74.8 L 361.8,76.0 L 366.6,87.7 L 359.9,95.6 L 362.5,113.8 L 291.0,111.9 L 264.0,131.8 L 241.5,130.3 L 243.9,142.1 L 236.4,146.4 L 236.6,169.3 L 183.9,159.0 L 161.9,164.0 L 155.7,174.9 L 159.6,230.9 L 138.6,240.4 L 128.2,255.5 L 64.2,279.1 L 73.9,335.0 L 63.3,358.4 L 65.4,381.5 L 50.3,385.2 L 51.6,394.0 L 45.6,399.4 L 48.8,404.3 L 42.4,411.4 L 47.9,428.0 L 57.4,435.4 L 47.8,440.8 L 40.0,472.1 Z'

/* Декоративные горные пики в южной (горной) части республики. */
const PEAKS: [number, number, number][] = [
  [250, 560, 70], // крупный — условный Эльбрус
  [360, 600, 42],
  [470, 640, 38],
  [560, 610, 46],
  [660, 560, 40],
  [720, 520, 34],
]

/** Рисунок карты КБР по реальной административной границе (© OpenStreetMap). */
function MapArt() {
  return (
    <svg viewBox="0 0 1000 749" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <linearGradient id="kbrFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b3327" />
          <stop offset="1" stopColor="#0f2118" />
        </linearGradient>
        <clipPath id="kbrClip">
          <path d={KBR_BORDER} />
        </clipPath>
        <filter id="kbrGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#33a06a" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Заливка территории */}
      <path d={KBR_BORDER} fill="url(#kbrFill)" filter="url(#kbrGlow)" />

      {/* Декор внутри границы */}
      <g clipPath="url(#kbrClip)">
        {/* фактурная сетка */}
        <g stroke="#33a06a" strokeOpacity="0.07" strokeWidth="1">
          {Array.from({ length: 20 }, (_, i) => (
            <line key={`v${i}`} x1={i * 55} y1={0} x2={i * 55} y2={749} />
          ))}
          {Array.from({ length: 15 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 55} x2={1000} y2={i * 55} />
          ))}
        </g>
        {/* горы на юге */}
        {PEAKS.map(([x, y, w], i) => (
          <g key={i}>
            <path d={`M${x - w} ${y + w} L ${x} ${y} L ${x + w} ${y + w} Z`} fill="#22392d" stroke="#33a06a" strokeOpacity="0.35" strokeWidth="1.5" strokeLinejoin="round" />
            <path d={`M${x - w * 0.34} ${y + w * 0.38} L ${x} ${y} L ${x + w * 0.34} ${y + w * 0.38} Z`} fill="#eaf3ee" fillOpacity="0.85" />
          </g>
        ))}
      </g>

      {/* Граница поверх — двойная обводка */}
      <path d={KBR_BORDER} fill="none" stroke="#33a06a" strokeWidth="3.5" strokeLinejoin="round" />
      <path d={KBR_BORDER} fill="none" stroke="#5fd69b" strokeWidth="1.2" strokeOpacity="0.4" strokeLinejoin="round" />

      {/* Подписи */}
      <text x="150" y="300" fill="#5fd69b" fillOpacity="0.5" fontSize="26" fontFamily="var(--font-oswald), sans-serif" fontWeight="700" letterSpacing="4">
        КБР
      </text>
    </svg>
  )
}
