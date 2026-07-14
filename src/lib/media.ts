/** Достаёт URL и alt из связанного документа Media (или null). */
export const mediaUrl = (m: unknown): string | null => {
  if (!m || typeof m !== 'object') return null
  const url = (m as { url?: string | null }).url
  return url ?? null
}

export const mediaAlt = (m: unknown, fallback = ''): string => {
  if (!m || typeof m !== 'object') return fallback
  return (m as { alt?: string | null }).alt ?? fallback
}

export const mediaSize = (m: unknown, size: string): string | null => {
  if (!m || typeof m !== 'object') return null
  const sizes = (m as { sizes?: Record<string, { url?: string | null }> }).sizes
  return sizes?.[size]?.url ?? mediaUrl(m)
}

/**
 * object-position из фокус-точки Payload (focalX/focalY, проценты 0–100).
 * Позволяет уважать кадрирование, заданное редактором, при object-cover.
 */
export const mediaFocal = (m: unknown): string => {
  if (!m || typeof m !== 'object') return '50% 50%'
  const x = (m as { focalX?: number | null }).focalX
  const y = (m as { focalY?: number | null }).focalY
  const px = typeof x === 'number' ? x : 50
  const py = typeof y === 'number' ? y : 50
  return `${px}% ${py}%`
}
