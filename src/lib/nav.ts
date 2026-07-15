export type NavChild = { href: string; label: string; description?: string }
export type NavItem = { href: string; label: string; children?: NavChild[] }

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
    ],
  },
  { href: '/raspisanie', label: 'Расписание' },
  { href: '/novosti', label: 'Новости' },
  { href: '/media', label: 'Медиа' },
  { href: '/partnery', label: 'Партнёры' },
  { href: '/kontakty', label: 'Контакты' },
]
