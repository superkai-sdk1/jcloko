export type NavChild = { href: string; label: string; description?: string }
export type NavItem = { href: string; label: string; children?: NavChild[] }

/** Меню по умолчанию — используется, если в «Настройках сайта» оно не задано. */
export const navLinks: NavItem[] = [
  { href: '/', label: 'Главная' },
  {
    href: '/o-klube',
    label: 'О клубе',
    children: [
      { href: '/o-klube', label: 'О клубе', description: 'История, миссия и ценности' },
      { href: '/trenery', label: 'Тренеры', description: 'Наставники и мастера клуба' },
      {
        href: '/obrazovatelnaya-deyatelnost',
        label: 'Образовательная деятельность',
        description: 'Программа спортивной подготовки',
      },
      { href: '/dokumenty', label: 'Документы', description: 'Официальные документы клуба' },
    ],
  },
  { href: '/zaly', label: 'Залы' },
  { href: '/raspisanie', label: 'Расписание' },
  { href: '/novosti', label: 'Новости' },
  { href: '/media', label: 'Медиа' },
  { href: '/partnery', label: 'Партнёры' },
  { href: '/kontakty', label: 'Контакты' },
]

const str = (v: unknown): string => (typeof v === 'string' ? v : '')

/**
 * Приводит меню из «Настроек сайта» (Payload) к NavItem[]. Пустые/некорректные
 * пункты отбрасываются; если валидных пунктов нет — возвращает меню по умолчанию.
 */
export function resolveNav(settingsNav: unknown): NavItem[] {
  if (!Array.isArray(settingsNav) || settingsNav.length === 0) return navLinks

  const items = settingsNav
    .map((raw): NavItem | null => {
      const o = (raw ?? {}) as Record<string, unknown>
      const label = str(o.label)
      const href = str(o.href)
      if (!label || !href) return null

      const children = Array.isArray(o.children)
        ? (o.children
            .map((c): NavChild | null => {
              const co = (c ?? {}) as Record<string, unknown>
              const cl = str(co.label)
              const ch = str(co.href)
              if (!cl || !ch) return null
              const desc = str(co.description)
              return { label: cl, href: ch, ...(desc ? { description: desc } : {}) }
            })
            .filter(Boolean) as NavChild[])
        : []

      return { label, href, ...(children.length ? { children } : {}) }
    })
    .filter(Boolean) as NavItem[]

  return items.length ? items : navLinks
}
