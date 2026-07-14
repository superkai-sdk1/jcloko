/** Резолвит ссылку спонсора: внешний сайт или внутренний раздел. */
export function resolvePartnerHref(p: Record<string, unknown>): string | null {
  const linkType =
    typeof p.linkType === 'string' ? p.linkType : typeof p.url === 'string' && p.url ? 'external' : 'none'

  if (linkType === 'external') {
    return typeof p.url === 'string' && p.url ? p.url : null
  }
  if (linkType === 'internal') {
    const ip = p.internalPage
    if (ip && typeof ip === 'object') {
      const slug = (ip as { slug?: string }).slug
      if (slug) return slug === 'glavnaya' ? '/' : `/${slug}`
    }
    return null
  }
  return null
}

export const isExternalHref = (href: string): boolean => /^https?:\/\//i.test(href)
