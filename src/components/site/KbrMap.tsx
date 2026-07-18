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
  scheduleSummary?: string
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

export function KbrMap({ halls, initialActiveId }: { halls: Hall[]; initialActiveId?: string }) {
  const [active, setActive] = useState<Hall | null>(
    initialActiveId ? halls.find((h) => h.id === initialActiveId) ?? null : null,
  )
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
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onClick={() => setActive(null)}
        style={{ touchAction: scale > 1 ? 'none' : 'pan-y' }}
        className={cn(
          'relative aspect-[1000/749] w-full select-none overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-ink-800 to-ink shadow-2xl shadow-black/30',
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

              <dl className="mt-2 space-y-1.5 text-sm">
                <div className="flex items-start gap-2 text-muted">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden>
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{active.address}</span>
                </div>
                {active.scheduleSummary && (
                  <div className="flex items-start gap-2 text-muted">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" aria-hidden>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" strokeLinecap="round" />
                    </svg>
                    <span>{active.scheduleSummary}</span>
                  </div>
                )}
                {active.note && (
                  <div className="flex items-start gap-2 text-muted">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" aria-hidden>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
                    </svg>
                    <span>{active.note}</span>
                  </div>
                )}
              </dl>

              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href={active.slug ? `/zaly/${active.slug}` : '/zaly'}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 font-display text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary-600"
                >
                  Подробнее о зале →
                </Link>
                <a
                  href={`https://yandex.ru/maps/?text=${encodeURIComponent(`${active.city ? active.city + ', ' : ''}${active.address}, Кабардино-Балкария`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-line px-4 font-display text-sm font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-surface-2"
                >
                  Маршрут на карте
                </a>
              </div>
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

/* Границы районов КБР (данные © OpenStreetMap, ODbL), спроецированы в тот же кадр, что и контур республики. */
const DISTRICTS: { name: string; path: string; cx: number; cy: number }[] = [
  { name: "Баксанский", cx: 472.0, cy: 223.4, path: "M 362.2,266.2 L 378.5,264.8 L 389.4,293.7 L 398.7,293.9 L 378.5,301.5 L 375.7,309.8 L 385.9,317.0 L 401.9,301.8 L 401.4,324.5 L 405.0,331.3 L 419.2,312.8 L 425.5,314.8 L 424.8,307.1 L 498.4,292.9 L 485.6,269.8 L 499.0,250.1 L 511.7,245.8 L 509.2,234.3 L 536.3,218.3 L 534.2,208.1 L 524.3,217.0 L 506.2,196.5 L 493.0,200.7 L 490.1,192.3 L 522.8,180.2 L 524.3,193.0 L 593.1,184.8 L 589.5,151.7 L 546.5,140.9 L 533.6,144.7 L 502.8,131.4 L 476.9,135.0 L 464.9,145.8 L 478.9,170.3 L 449.7,192.2 L 417.8,198.1 L 407.5,223.4 L 389.3,249.8 L 362.2,266.2 Z" },
  { name: "Зольский", cx: 241.2, cy: 245.6, path: "M 42.5,411.3 L 48.0,427.9 L 54.7,434.0 L 100.0,440.3 L 110.1,436.8 L 120.1,421.5 L 129.0,422.4 L 142.8,410.4 L 175.1,408.8 L 173.2,401.1 L 178.9,394.7 L 182.4,378.7 L 173.6,369.9 L 174.0,359.4 L 180.5,342.3 L 205.2,319.1 L 215.2,320.4 L 225.3,314.0 L 242.1,292.6 L 253.3,287.7 L 251.1,282.0 L 268.6,281.2 L 264.4,273.6 L 273.7,267.2 L 277.5,254.4 L 292.7,263.2 L 310.7,251.8 L 322.2,274.9 L 331.9,279.3 L 345.5,276.0 L 389.3,249.8 L 407.5,223.4 L 417.8,198.1 L 449.7,192.2 L 466.2,183.2 L 478.1,167.5 L 464.9,145.8 L 433.5,169.6 L 435.5,167.0 L 395.9,76.1 L 376.4,74.6 L 361.9,75.8 L 361.4,82.6 L 366.7,87.5 L 360.1,95.4 L 362.6,113.6 L 291.2,111.7 L 264.1,131.6 L 241.6,130.2 L 244.1,142.0 L 236.6,146.3 L 236.7,169.1 L 184.0,158.8 L 160.9,164.5 L 155.9,174.7 L 161.4,207.6 L 159.7,230.7 L 138.7,240.2 L 125.8,256.6 L 65.4,276.2 L 71.0,304.8 L 68.9,321.0 L 74.0,334.9 L 63.4,358.3 L 65.5,381.4 L 50.4,385.1 L 51.7,393.9 L 45.7,399.3 L 48.9,404.2 L 42.5,411.3 Z" },
  { name: "Лескенский", cx: 680.3, cy: 462.7, path: "M 549.5,586.9 L 567.9,582.9 L 575.8,599.2 L 579.4,584.0 L 601.4,566.2 L 618.8,564.4 L 621.8,551.0 L 611.4,543.5 L 619.0,531.4 L 621.6,512.4 L 655.8,451.9 L 668.6,467.0 L 669.1,483.8 L 691.2,492.4 L 694.5,501.0 L 703.2,474.2 L 730.9,483.4 L 716.8,499.8 L 729.9,518.4 L 752.2,494.3 L 769.7,487.8 L 766.9,470.6 L 745.0,435.1 L 757.6,418.0 L 746.0,406.6 L 746.5,396.2 L 735.8,394.2 L 738.7,386.9 L 727.2,379.1 L 734.0,357.8 L 725.6,344.6 L 691.4,360.5 L 699.3,373.1 L 671.1,391.6 L 676.9,398.4 L 673.9,397.9 L 675.5,402.9 L 650.5,438.2 L 632.3,484.5 L 617.9,502.2 L 582.1,520.2 L 568.1,535.5 L 554.9,563.6 L 555.1,580.8 L 549.5,586.9 Z" },
  { name: "Майский", cx: 751.5, cy: 286.2, path: "M 674.3,273.8 L 688.0,290.9 L 702.9,282.1 L 707.8,288.1 L 732.3,276.7 L 741.5,277.7 L 738.7,296.7 L 724.1,325.3 L 716.8,328.4 L 734.0,357.8 L 727.2,379.1 L 738.7,386.9 L 735.8,394.2 L 746.5,396.2 L 746.0,406.6 L 757.6,418.0 L 773.5,397.5 L 774.3,388.7 L 790.5,385.1 L 763.8,363.2 L 758.2,350.2 L 761.7,303.5 L 767.3,295.4 L 759.5,283.4 L 773.1,257.5 L 794.9,235.0 L 829.6,212.0 L 846.8,214.0 L 847.1,208.7 L 833.5,201.4 L 830.5,207.0 L 802.8,191.5 L 798.7,198.8 L 792.3,196.4 L 788.2,202.0 L 785.1,196.8 L 778.4,201.1 L 774.7,196.6 L 766.0,198.4 L 766.0,206.0 L 761.1,209.2 L 762.9,219.6 L 748.7,220.6 L 752.6,228.2 L 748.5,232.1 L 742.8,234.9 L 735.5,228.8 L 724.6,241.4 L 697.9,246.3 L 675.3,263.6 L 678.1,269.7 L 674.3,273.8 Z" },
  { name: "Прохладненский", cx: 726.1, cy: 149.5, path: "M 573.3,187.2 L 576.2,211.6 L 601.8,200.1 L 622.3,204.0 L 615.4,210.9 L 624.4,214.5 L 621.4,215.6 L 624.7,224.2 L 611.4,225.7 L 614.6,252.6 L 656.5,250.1 L 658.1,266.7 L 685.1,259.2 L 697.9,246.3 L 728.7,239.5 L 735.5,228.8 L 742.8,234.9 L 752.6,228.2 L 748.7,220.6 L 755.1,214.5 L 747.0,208.0 L 748.1,203.8 L 740.2,206.8 L 740.4,201.2 L 733.7,198.0 L 719.5,203.0 L 717.6,196.7 L 706.4,196.1 L 719.1,194.0 L 721.2,185.8 L 716.7,177.4 L 748.7,190.8 L 769.2,187.4 L 770.8,200.3 L 774.7,196.6 L 778.4,201.1 L 785.1,196.8 L 786.8,202.2 L 792.3,196.4 L 797.9,199.3 L 802.8,191.5 L 830.5,207.0 L 833.5,201.4 L 845.3,208.3 L 844.1,163.8 L 854.6,164.5 L 854.9,115.9 L 876.6,108.5 L 876.7,83.9 L 909.0,84.1 L 909.1,42.1 L 887.6,49.1 L 887.4,68.1 L 844.5,73.1 L 844.3,100.3 L 825.8,100.1 L 825.5,94.3 L 790.8,94.2 L 790.8,69.5 L 723.5,69.2 L 723.4,60.0 L 705.1,59.9 L 705.1,46.0 L 695.5,39.8 L 670.0,59.2 L 667.9,75.4 L 651.4,75.7 L 630.3,94.7 L 630.3,127.1 L 621.6,138.5 L 623.7,144.7 L 619.5,159.7 L 589.5,151.7 L 593.1,184.8 L 573.3,187.2 Z" },
  { name: "Терский", cx: 842.1, cy: 316.5, path: "M 758.2,350.2 L 763.8,363.2 L 791.8,384.8 L 800.1,400.2 L 804.7,437.7 L 867.0,377.2 L 874.6,384.9 L 881.6,411.6 L 892.9,409.1 L 919.0,390.6 L 906.8,375.9 L 921.4,349.3 L 918.3,343.2 L 920.0,322.6 L 933.2,298.8 L 915.9,284.6 L 918.6,275.8 L 912.2,254.7 L 913.4,238.2 L 889.7,233.6 L 883.0,241.0 L 866.0,241.8 L 856.6,235.7 L 846.8,214.0 L 829.6,212.0 L 794.9,235.0 L 777.1,252.9 L 759.5,283.4 L 767.3,295.4 L 761.7,303.5 L 758.2,350.2 Z" },
  { name: "Урванский", cx: 665.8, cy: 346.5, path: "M 605.5,438.4 L 614.0,440.0 L 611.8,442.6 L 620.1,454.0 L 643.3,462.6 L 650.5,438.2 L 675.7,402.6 L 676.6,397.6 L 671.1,391.6 L 699.3,373.1 L 691.4,360.5 L 725.6,344.6 L 716.8,328.4 L 724.1,325.3 L 738.7,296.7 L 741.5,277.7 L 732.3,276.7 L 707.8,288.1 L 702.9,282.1 L 688.0,290.9 L 674.3,273.8 L 678.1,269.7 L 675.3,263.6 L 648.6,268.2 L 635.6,277.8 L 620.7,280.8 L 625.6,294.9 L 615.0,300.3 L 618.9,312.2 L 629.2,302.5 L 647.2,298.0 L 633.1,313.9 L 632.6,322.2 L 626.3,326.9 L 626.4,339.9 L 619.4,344.7 L 619.0,359.6 L 624.1,359.1 L 633.2,376.3 L 633.7,391.1 L 622.9,405.2 L 629.6,410.9 L 605.5,438.4 Z" },
  { name: "Чегемский", cx: 418.2, cy: 414.4, path: "M 239.1,538.2 L 246.5,543.4 L 248.1,553.0 L 255.3,549.8 L 269.6,555.6 L 265.4,563.5 L 270.7,571.6 L 294.9,573.4 L 313.0,589.0 L 322.9,591.1 L 342.2,569.4 L 356.0,562.2 L 358.1,553.5 L 374.2,534.5 L 376.7,523.2 L 405.0,489.2 L 399.7,472.2 L 402.0,453.5 L 407.7,449.6 L 410.0,438.3 L 471.8,427.4 L 500.5,401.5 L 505.2,390.5 L 527.5,384.9 L 519.9,377.5 L 529.1,380.9 L 536.4,373.2 L 524.8,369.7 L 537.3,372.3 L 543.0,367.6 L 531.4,359.2 L 532.1,355.1 L 526.3,355.5 L 523.3,363.7 L 511.8,364.0 L 517.1,350.8 L 523.7,355.2 L 532.5,347.0 L 525.8,338.8 L 522.5,341.8 L 521.7,330.9 L 539.9,340.0 L 571.7,332.1 L 590.6,319.7 L 598.1,337.5 L 607.8,334.3 L 590.1,342.2 L 592.0,346.1 L 581.8,352.5 L 604.6,367.2 L 611.1,363.2 L 614.4,352.8 L 620.3,352.8 L 619.4,344.7 L 626.4,339.9 L 626.3,326.9 L 647.2,298.0 L 629.2,302.5 L 618.9,312.2 L 615.0,300.3 L 625.6,294.9 L 620.5,269.5 L 597.5,261.2 L 597.2,270.4 L 588.0,269.3 L 543.8,286.0 L 542.0,281.0 L 522.0,288.2 L 519.7,282.3 L 511.7,291.2 L 490.7,291.2 L 476.2,299.7 L 461.9,298.1 L 424.8,307.1 L 427.0,313.0 L 414.7,316.9 L 416.8,320.1 L 411.1,332.8 L 394.7,350.0 L 389.2,367.9 L 383.2,361.7 L 379.1,367.5 L 370.1,364.5 L 372.9,380.8 L 341.6,393.6 L 346.1,402.7 L 313.1,423.5 L 308.0,422.1 L 310.9,425.5 L 297.0,447.4 L 294.0,465.3 L 274.2,472.5 L 265.4,490.0 L 250.1,501.0 L 248.0,513.3 L 251.2,516.1 L 241.5,523.4 L 244.9,532.0 L 239.1,538.2 Z" },
  { name: "Черекский", cx: 482.7, cy: 541.5, path: "M 305.9,601.8 L 315.8,620.9 L 314.2,626.2 L 336.4,644.0 L 347.8,644.3 L 360.9,662.1 L 372.5,664.9 L 379.2,680.8 L 424.1,692.4 L 428.2,698.7 L 435.6,694.3 L 443.0,708.9 L 470.4,704.9 L 482.5,687.1 L 481.9,674.5 L 489.5,662.0 L 500.3,667.3 L 517.4,665.6 L 528.6,676.6 L 544.8,677.5 L 567.0,637.6 L 562.2,619.4 L 572.5,614.8 L 577.8,602.6 L 567.9,582.9 L 549.6,589.1 L 556.3,576.7 L 557.2,556.8 L 565.3,539.4 L 582.1,520.2 L 617.9,502.2 L 643.3,462.6 L 620.1,454.0 L 611.8,442.6 L 614.0,440.0 L 605.5,438.4 L 629.6,410.9 L 622.9,405.2 L 633.7,391.1 L 633.2,376.3 L 616.6,352.1 L 609.6,365.1 L 594.1,363.0 L 577.6,385.6 L 574.9,383.9 L 578.2,378.6 L 574.9,384.7 L 572.5,378.6 L 569.1,384.5 L 565.9,376.9 L 553.8,374.4 L 548.3,389.7 L 550.1,395.6 L 560.9,398.9 L 556.0,416.2 L 541.7,408.0 L 540.1,400.3 L 531.2,404.3 L 538.5,398.3 L 538.5,389.6 L 517.5,396.4 L 514.5,390.5 L 506.6,393.1 L 471.8,427.4 L 410.0,438.3 L 407.7,449.6 L 402.0,453.5 L 399.7,472.2 L 405.0,489.2 L 376.7,523.2 L 374.2,534.5 L 358.1,553.5 L 355.6,562.8 L 305.9,601.8 Z" },
  { name: "Эльбрусский", cx: 230.2, cy: 410.0, path: "M 40.1,472.0 L 48.2,481.2 L 47.2,491.7 L 59.9,496.3 L 63.7,503.2 L 60.3,509.8 L 65.9,517.8 L 88.5,525.9 L 102.9,539.3 L 133.9,546.4 L 157.0,563.8 L 161.2,562.0 L 158.0,557.7 L 164.1,540.6 L 202.5,532.1 L 218.2,544.9 L 239.1,538.2 L 244.9,532.0 L 241.5,523.4 L 251.2,516.1 L 248.0,513.3 L 250.1,501.0 L 265.4,490.0 L 274.2,472.5 L 294.0,465.3 L 297.0,447.4 L 310.9,425.5 L 308.0,422.1 L 313.1,423.5 L 346.1,402.7 L 341.6,393.6 L 372.9,380.8 L 370.1,364.5 L 379.1,367.5 L 383.2,361.7 L 389.2,367.9 L 394.7,350.0 L 416.8,320.1 L 402.6,330.0 L 401.9,301.8 L 385.9,317.0 L 375.7,309.8 L 378.5,301.5 L 398.7,293.9 L 389.4,293.7 L 378.5,264.8 L 331.9,279.3 L 322.2,274.9 L 310.7,251.8 L 292.7,263.2 L 277.5,254.4 L 273.7,267.2 L 264.4,273.6 L 268.6,281.2 L 251.1,282.0 L 253.3,287.7 L 242.1,292.6 L 225.3,314.0 L 215.2,320.4 L 205.2,319.1 L 180.5,342.3 L 174.0,359.4 L 173.6,369.9 L 182.4,378.7 L 178.9,394.7 L 173.2,401.1 L 175.1,408.8 L 142.8,410.4 L 129.0,422.4 L 116.1,424.3 L 105.9,439.5 L 57.6,435.2 L 47.9,440.7 L 40.1,472.0 Z" },
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

      {/* Границы районов */}
      <g fill="none" stroke="#5fd69b" strokeOpacity="0.3" strokeWidth="1.2" strokeLinejoin="round">
        {DISTRICTS.map((dd) => (
          <path key={dd.name} d={dd.path} />
        ))}
      </g>

      {/* Граница республики поверх — двойная обводка */}
      <path d={KBR_BORDER} fill="none" stroke="#33a06a" strokeWidth="3.5" strokeLinejoin="round" />
      <path d={KBR_BORDER} fill="none" stroke="#5fd69b" strokeWidth="1.2" strokeOpacity="0.4" strokeLinejoin="round" />

      {/* Названия районов — мелким шрифтом, с тёмным ореолом для читаемости */}
      <g fontFamily="var(--font-oswald), sans-serif" textAnchor="middle" fontWeight="600" style={{ paintOrder: 'stroke' }}>
        {DISTRICTS.map((dd) => (
          <text key={dd.name} x={dd.cx} y={dd.cy} fontSize="12.5" fill="#d3e0d7" stroke="#0e1b14" strokeWidth="3" strokeOpacity="0.7">
            {dd.name}
          </text>
        ))}
      </g>
    </svg>
  )
}
