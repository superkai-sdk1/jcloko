import { tokenize } from './normalize'

const intersectionSize = (a: Set<string>, b: Set<string>): number => {
  let n = 0
  for (const x of a) if (b.has(x)) n++
  return n
}

/** Jaccard: |A∩B| / |A∪B|. */
export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1
  const inter = intersectionSize(a, b)
  const union = a.size + b.size - inter
  return union === 0 ? 0 : inter / union
}

/** Dice: 2|A∩B| / (|A|+|B|). */
export function dice(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1
  const inter = intersectionSize(a, b)
  const denom = a.size + b.size
  return denom === 0 ? 0 : (2 * inter) / denom
}

/**
 * Схожесть двух текстов по словам (берём максимум Jaccard/Dice — Dice мягче к
 * разнице в длине, Jaccard строже; максимум даёт устойчивую оценку 0..1).
 */
export function textSimilarity(a: string, b: string): number {
  const ta = tokenize(a)
  const tb = tokenize(b)
  return Math.max(jaccard(ta, tb), dice(ta, tb))
}
