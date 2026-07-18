import { getPayloadClient } from './payload'

/** Настройки сайта (глобал). Возвращает данные для шапки/подвала. */
export const getSiteSettings = async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
}

/** Страница по slug (только опубликованная для витрины). */
export const getPageBySlug = async (slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'pages',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    depth: 2,
    limit: 1,
  })
  return res.docs[0] ?? null
}

/** Список опубликованных новостей. */
export const getNews = async (limit = 12) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'news',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    depth: 1,
    limit,
  })
  return res.docs
}

/** Все тренеры по порядку вывода. */
export const getCoaches = async () => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'coaches', sort: 'displayOrder', depth: 1, limit: 100 })
  return res.docs
}

/** Партнёры по порядку вывода. */
export const getPartners = async () => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'partners', sort: 'displayOrder', depth: 1, limit: 100 })
  return res.docs
}

/** Документы для страницы «Документы» (порядок вывода). */
export const getDocuments = async () => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'documents', sort: 'displayOrder', depth: 0, limit: 200 })
  return res.docs
}

/** Генеральный партнёр (для шапки). Сначала флаг isGeneralPartner, иначе — из SiteSettings. */
export const getGeneralPartner = async (): Promise<Record<string, unknown> | null> => {
  const payload = await getPayloadClient()
  const flagged = await payload.find({
    collection: 'partners',
    where: { isGeneralPartner: { equals: true } },
    sort: 'displayOrder',
    depth: 1,
    limit: 1,
  })
  if (flagged.docs[0]) return flagged.docs[0] as unknown as Record<string, unknown>
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
  const gp = (settings as { generalPartner?: unknown })?.generalPartner
  return gp && typeof gp === 'object' ? (gp as Record<string, unknown>) : null
}

/** Спортсмены. */
export const getAthletes = async () => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'athletes', depth: 1, limit: 200 })
  return res.docs
}

/** Все занятия расписания. */
export const getScheduleEntries = async () => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'schedule-entries', depth: 1, limit: 200 })
  return res.docs
}

/** Опубликованные медиа-подборки. */
export const getMediaGalleries = async () => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'media-galleries',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    depth: 1,
    limit: 60,
  })
  return res.docs
}

/** Одна медиа-подборка по slug (опубликованная), с фото/видео. */
export const getMediaGalleryBySlug = async (slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'media-galleries',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    depth: 2,
    limit: 1,
  })
  return res.docs[0] ?? null
}

/** Тренер по id. */
export const getCoachById = async (id: string) => {
  const payload = await getPayloadClient()
  try {
    return await payload.findByID({ collection: 'coaches', id, depth: 1 })
  } catch {
    return null
  }
}

/** Одна новость по slug (опубликованная). */
export const getNewsBySlug = async (slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'news',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    depth: 2,
    limit: 1,
  })
  return res.docs[0] ?? null
}
