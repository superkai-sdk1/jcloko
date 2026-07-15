import { getSiteSettings } from './queries'

export type SectionHeader = { eyebrow: string; title: string; subtitle?: string }
export type PageHeaderKey = 'news' | 'schedule' | 'coaches' | 'media' | 'partners' | 'contacts'

const DEFAULTS: Record<PageHeaderKey, SectionHeader> = {
  news: { eyebrow: 'Жизнь клуба', title: 'Новости', subtitle: 'Соревнования, сборы, достижения и анонсы.' },
  schedule: { eyebrow: 'Тренировки', title: 'Расписание', subtitle: 'Занятия по возрастам и уровням подготовки.' },
  coaches: { eyebrow: 'Команда', title: 'Тренеры', subtitle: 'Тренерский состав клуба дзюдо «Локомотив».' },
  media: { eyebrow: 'Галерея', title: 'Медиа', subtitle: 'Фотографии, фильмы и интервью клуба.' },
  partners: { eyebrow: 'Поддержка', title: 'Партнёры', subtitle: 'Компании и организации, которые помогают клубу.' },
  contacts: { eyebrow: 'Свяжитесь с нами', title: 'Контакты', subtitle: 'Запишитесь на первую тренировку или задайте вопрос.' },
}

const str = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined)

/**
 * Заголовок («шапка») списочной страницы: берётся из «Настроек сайта» →
 * «Заголовки страниц», с откатом на значения по умолчанию.
 */
export async function getPageHeader(key: PageHeaderKey): Promise<SectionHeader> {
  const d = DEFAULTS[key]
  let ph: Record<string, unknown> | undefined
  try {
    const settings = await getSiteSettings()
    const all = settings?.pageHeaders as Record<string, unknown> | undefined
    ph = all?.[key] as Record<string, unknown> | undefined
  } catch {
    ph = undefined
  }
  if (!ph) return d
  return {
    eyebrow: str(ph.eyebrow) || d.eyebrow,
    title: str(ph.title) || d.title,
    // подзаголовок можно намеренно очистить — уважаем пустую строку
    subtitle: str(ph.subtitle) ?? d.subtitle,
  }
}
