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
