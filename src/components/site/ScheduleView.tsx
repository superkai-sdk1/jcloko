'use client'

import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/utils/cn'

export type SchedEntry = {
  id: string
  group: string
  day: string
  start: string
  end: string
  coach?: string
  hallSlug?: string
  hallName?: string
  hallCity?: string
  ageGroup?: string
}
export type HallOpt = { slug: string; name: string; city?: string }

const dayLabels: Record<string, string> = {
  mon: 'Понедельник', tue: 'Вторник', wed: 'Среда', thu: 'Четверг',
  fri: 'Пятница', sat: 'Суббота', sun: 'Воскресенье',
}
const dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export function ScheduleView({ entries, halls }: { entries: SchedEntry[]; halls: HallOpt[] }) {
  const params = useSearchParams()
  const zal = params.get('zal') || 'all'
  const [sel, setSel] = useState<string>(halls.some((h) => h.slug === zal) ? zal : 'all')

  const filtered = useMemo(
    () => (sel === 'all' ? entries : entries.filter((e) => e.hallSlug === sel)),
    [entries, sel],
  )
  const byDay = useMemo(
    () =>
      dayOrder
        .map((d) => ({ day: d, items: filtered.filter((e) => e.day === d) }))
        .filter((g) => g.items.length > 0),
    [filtered],
  )

  const chip = (activeVal: boolean) =>
    cn(
      'cursor-pointer rounded-full border px-4 py-1.5 font-display text-sm font-medium uppercase tracking-wide transition-colors',
      activeVal ? 'border-primary-400 bg-primary/15 text-primary-400' : 'border-line bg-surface/50 text-paper/75 hover:border-primary-400/60 hover:text-paper',
    )

  return (
    <div>
      {/* Фильтр по залам */}
      {halls.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button type="button" onClick={() => setSel('all')} className={chip(sel === 'all')}>
            Все залы
          </button>
          {halls.map((h) => (
            <button key={h.slug} type="button" onClick={() => setSel(h.slug)} className={chip(sel === h.slug)}>
              {h.city ? `${h.city} · ${h.name}` : h.name}
            </button>
          ))}
        </div>
      )}

      {byDay.length === 0 ? (
        <p className="text-muted">Для выбранного зала расписание пока не заполнено.</p>
      ) : (
        <div className="space-y-8">
          {byDay.map((group) => (
            <div key={group.day}>
              <h3 className="mb-3 font-display text-xl uppercase text-primary-400">{dayLabels[group.day]}</h3>
              <div className="overflow-hidden rounded-xl border border-line">
                {group.items.map((e) => (
                  <div key={e.id} className="flex flex-wrap items-center gap-x-6 gap-y-1 border-b border-line bg-ink px-5 py-3 last:border-0">
                    <span className="w-28 font-display text-lg font-semibold tabular-nums text-paper">
                      {e.start}
                      {e.end ? `–${e.end}` : ''}
                    </span>
                    <span className="min-w-40 flex-1 text-paper">{e.group}</span>
                    {e.ageGroup && <span className="text-sm text-muted">{e.ageGroup}</span>}
                    {e.coach && <span className="text-sm text-muted">{e.coach}</span>}
                    {sel === 'all' && e.hallName && (
                      <span className="text-sm text-primary-400">{e.hallCity ? `${e.hallCity} · ${e.hallName}` : e.hallName}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
