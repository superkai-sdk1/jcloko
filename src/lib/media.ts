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
