import { getHalls, getScheduleEntries } from './queries'
import type { Hall } from '@/components/site/KbrMap'

const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const num = (v: unknown): number | undefined => (typeof v === 'number' ? v : undefined)

const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const DAY_ABBR: Record<string, string> = { mon: 'Пн', tue: 'Вт', wed: 'Ср', thu: 'Чт', fri: 'Пт', sat: 'Сб', sun: 'Вс' }

/** «Пн–Сб» для непрерывных отрезков, иначе «Пн, Ср, Пт». */
function compressDays(present: string[]): string {
  const idx = DAY_ORDER.map((d, i) => (present.includes(d) ? i : -1)).filter((i) => i >= 0)
  if (idx.length === 0) return ''
  const runs: [number, number][] = []
  let start = idx[0]
  let prev = idx[0]
  for (let i = 1; i < idx.length; i++) {
    if (idx[i] === prev + 1) prev = idx[i]
    else {
      runs.push([start, prev])
      start = prev = idx[i]
    }
  }
  runs.push([start, prev])
  return runs
    .map(([a, b]) => (b - a >= 2 ? `${DAY_ABBR[DAY_ORDER[a]]}–${DAY_ABBR[DAY_ORDER[b]]}` : DAY_ORDER.slice(a, b + 1).map((d) => DAY_ABBR[d]).join(', ')))
    .join(', ')
}

/** Краткая сводка расписания по каждому залу: дни + общий диапазон времени. */
function buildSummaries(entries: Record<string, unknown>[]): Record<string, string> {
  const byHall: Record<string, { days: Set<string>; min: string; max: string }> = {}
  for (const e of entries) {
    const hall = e.hallLink as Record<string, unknown> | undefined
    const slug = hall && typeof hall === 'object' ? str(hall.slug) : ''
    if (!slug) continue
    const b = (byHall[slug] ||= { days: new Set(), min: '99:99', max: '00:00' })
    const day = str(e.dayOfWeek)
    if (day) b.days.add(day)
    const s = str(e.startTime)
    const en = str(e.endTime)
    if (s && s < b.min) b.min = s
    if (en && en > b.max) b.max = en
  }
  const out: Record<string, string> = {}
  for (const [slug, b] of Object.entries(byHall)) {
    const days = compressDays([...b.days])
    const time = b.min !== '99:99' && b.max !== '00:00' ? `${b.min}–${b.max}` : ''
    out[slug] = [days, time].filter(Boolean).join(' · ')
  }
  return out
}

/** Залы для карты, с краткой сводкой расписания в каждом. */
export async function loadHallsWithSchedule(): Promise<Hall[]> {
  const [rawHalls, entries] = await Promise.all([getHalls(), getScheduleEntries()])
  const summaries = buildSummaries(entries as unknown as Record<string, unknown>[])
  return (rawHalls as unknown as Record<string, unknown>[]).map((h) => ({
    id: String(h.id),
    name: str(h.name),
    city: str(h.city),
    address: str(h.address),
    note: str(h.note),
    slug: str(h.slug),
    mapX: num(h.mapX),
    mapY: num(h.mapY),
    scheduleSummary: summaries[str(h.slug)] || undefined,
  }))
}
