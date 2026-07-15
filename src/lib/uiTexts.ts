import { getSiteSettings } from './queries'

/** Служебные тексты интерфейса со значениями по умолчанию. */
const DEFAULTS = {
  emptyNews: 'Пока новостей нет.',
  emptyMedia: 'Материалы скоро появятся.',
  emptyCoaches: 'Информация скоро появится.',
  notFoundTitle: 'Страница не найдена',
  notFoundText:
    'Возможно, страница была перемещена или удалена. Вернитесь на главную или загляните в расписание тренировок.',
}

export type UiTextKey = keyof typeof DEFAULTS

/** Значение служебного текста из «Настройки сайта → Тексты интерфейса» с откатом на дефолт. */
export async function getUiText(key: UiTextKey): Promise<string> {
  try {
    const settings = await getSiteSettings()
    const v = (settings?.uiTexts as unknown as Record<string, unknown> | undefined)?.[key]
    if (typeof v === 'string' && v) return v
  } catch {}
  return DEFAULTS[key]
}
