import type { Payload } from 'payload'
import { textSimilarity } from './similarity'
import { imagesSimilar } from './phash'

export type DedupDecision =
  | { action: 'separate' }
  | { action: 'merged'; targetId: number | string; score: number }
  | { action: 'flagged'; targetId: number | string; score: number }

type DedupConfig = {
  enabled?: boolean | null
  timeWindowMinutes?: number | null
  similarityThreshold?: number | null
  reviewLowerBound?: number | null
}

/**
 * Решает, что делать с входящим постом: слить с существующей новостью,
 * пометить как возможный дубликат (ручная проверка) или опубликовать отдельно.
 *
 * Окно ±N минут → text similarity (Jaccard/Dice) → усиление pHash картинки →
 * порог 0.82 (авто-мерж), 0.5–0.82 (флаг), <0.5 (раздельно).
 */
export async function decideDuplicate(
  payload: Payload,
  incoming: { text: string; publishedAt: string; imageHash: bigint | null },
): Promise<DedupDecision> {
  const settings = await payload.findGlobal({
    slug: 'integration-settings',
    overrideAccess: true,
    depth: 0,
  })
  const cfg = (settings as { deduplication?: DedupConfig })?.deduplication
  if (cfg?.enabled === false) return { action: 'separate' }

  const windowMin = cfg?.timeWindowMinutes ?? 30
  const threshold = cfg?.similarityThreshold ?? 0.82
  const lowerBound = cfg?.reviewLowerBound ?? 0.5

  const base = new Date(incoming.publishedAt).getTime()
  if (Number.isNaN(base)) return { action: 'separate' }
  const from = new Date(base - windowMin * 60_000).toISOString()
  const to = new Date(base + windowMin * 60_000).toISOString()

  const candidates = await payload.find({
    collection: 'news',
    where: { and: [{ publishedAt: { greater_than_equal: from } }, { publishedAt: { less_than_equal: to } }] },
    sort: '-publishedAt',
    limit: 25,
    depth: 0,
    overrideAccess: true,
  })

  let best: { id: number | string; score: number; imgMatch: boolean } | null = null
  for (const c of candidates.docs as unknown as Array<Record<string, unknown>>) {
    const ctext = `${c.title ?? ''} ${c.excerpt ?? ''}`
    const score = textSimilarity(incoming.text, ctext)
    const cHash = typeof c.imageHash === 'string' && c.imageHash ? BigInt(c.imageHash) : null
    const imgMatch = imagesSimilar(incoming.imageHash, cHash)
    if (!best || score > best.score) {
      best = { id: c.id as number | string, score, imgMatch }
    }
  }

  if (!best) return { action: 'separate' }

  // Решающее правило: выше порога ИЛИ пограничная зона + совпавшая картинка → мерж.
  if (best.score >= threshold || (best.score >= lowerBound && best.imgMatch)) {
    return { action: 'merged', targetId: best.id, score: best.score }
  }
  if (best.score >= lowerBound) {
    return { action: 'flagged', targetId: best.id, score: best.score }
  }
  return { action: 'separate' }
}
