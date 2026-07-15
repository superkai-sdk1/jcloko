import type { GlobalConfig, Field } from 'payload'
import { anyone, isAdminOrEditor } from '../access'

/** Группа «шапки» списочной страницы (надзаголовок / заголовок / подзаголовок). */
const headerGroup = (
  name: string,
  label: string,
  d: { eyebrow: string; title: string; subtitle?: string },
): Field => ({
  type: 'group',
  name,
  label,
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Надзаголовок', defaultValue: d.eyebrow },
    { name: 'title', type: 'text', label: 'Заголовок', defaultValue: d.title },
    { name: 'subtitle', type: 'text', label: 'Подзаголовок', defaultValue: d.subtitle },
  ],
})

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки сайта',
  admin: { group: 'Настройки' },
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: [
    { name: 'clubName', type: 'text', label: 'Название клуба', defaultValue: 'Клуб дзюдо «Локомотив»' },
    { name: 'tagline', type: 'text', label: 'Слоган' },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Логотип' },
    {
      type: 'group',
      name: 'contacts',
      label: 'Контакты',
      fields: [
        { name: 'phone', type: 'text', label: 'Телефон' },
        { name: 'email', type: 'text', label: 'Email' },
        { name: 'address', type: 'textarea', label: 'Адрес' },
        { name: 'mapEmbed', type: 'text', label: 'Ссылка/iframe карты' },
      ],
    },
    {
      type: 'group',
      name: 'socials',
      label: 'Соцсети',
      fields: [
        { name: 'telegram', type: 'text', label: 'Telegram' },
        { name: 'vk', type: 'text', label: 'ВКонтакте' },
        { name: 'youtube', type: 'text', label: 'YouTube' },
        { name: 'rutube', type: 'text', label: 'RuTube' },
      ],
    },
    {
      name: 'generalPartner',
      type: 'relationship',
      relationTo: 'partners',
      label: 'Генеральный партнёр',
    },
    // ── Навигация (меню шапки и подвала) ──────────────────────────────────────
    {
      name: 'navigation',
      type: 'array',
      label: 'Меню навигации',
      labels: { singular: 'Пункт меню', plural: 'Пункты меню' },
      admin: {
        description:
          'Пункты верхнего меню (и списка «Разделы» в подвале). Если у пункта задать вложенные ссылки — он станет выпадающим. Если меню пустое — используется меню по умолчанию.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: 'Название', required: true, admin: { width: '50%' } },
            { name: 'href', type: 'text', label: 'Ссылка (например, /raspisanie)', required: true, admin: { width: '50%' } },
          ],
        },
        {
          name: 'children',
          type: 'array',
          label: 'Вложенные пункты (выпадающее меню)',
          labels: { singular: 'Вложенный пункт', plural: 'Вложенные пункты' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', label: 'Название', required: true, admin: { width: '50%' } },
                { name: 'href', type: 'text', label: 'Ссылка', required: true, admin: { width: '50%' } },
              ],
            },
            { name: 'description', type: 'text', label: 'Описание (подпись в выпадающем меню)' },
          ],
        },
      ],
    },
    // ── Заголовки списочных страниц ───────────────────────────────────────────
    {
      type: 'group',
      name: 'pageHeaders',
      label: 'Заголовки страниц',
      admin: { description: '«Шапки» списочных страниц (надзаголовок, заголовок, подзаголовок).' },
      fields: [
        headerGroup('news', 'Новости', { eyebrow: 'Жизнь клуба', title: 'Новости', subtitle: 'Соревнования, сборы, достижения и анонсы.' }),
        headerGroup('schedule', 'Расписание', { eyebrow: 'Тренировки', title: 'Расписание', subtitle: 'Занятия по возрастам и уровням подготовки.' }),
        headerGroup('coaches', 'Тренеры', { eyebrow: 'Команда', title: 'Тренеры', subtitle: 'Тренерский состав клуба дзюдо «Локомотив».' }),
        headerGroup('media', 'Медиа', { eyebrow: 'Галерея', title: 'Медиа', subtitle: 'Фотографии, фильмы и интервью клуба.' }),
        headerGroup('partners', 'Партнёры', { eyebrow: 'Поддержка', title: 'Партнёры', subtitle: 'Компании и организации, которые помогают клубу.' }),
        headerGroup('contacts', 'Контакты', { eyebrow: 'Свяжитесь с нами', title: 'Контакты', subtitle: 'Запишитесь на первую тренировку или задайте вопрос.' }),
      ],
    },
    {
      type: 'group',
      name: 'defaultSeo',
      label: 'SEO по умолчанию',
      fields: [
        { name: 'title', type: 'text', label: 'Title по умолчанию' },
        { name: 'description', type: 'textarea', label: 'Description по умолчанию' },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'OG-картинка по умолчанию' },
      ],
    },
    // ── Подвал ────────────────────────────────────────────────────────────────
    {
      type: 'group',
      name: 'footer',
      label: 'Подвал',
      fields: [
        { name: 'linksHeading', type: 'text', label: 'Заголовок блока разделов', defaultValue: 'Разделы' },
        { name: 'contactsHeading', type: 'text', label: 'Заголовок блока контактов', defaultValue: 'Контакты' },
        { name: 'rightsText', type: 'text', label: 'Текст копирайта (после года и названия)', defaultValue: 'Все права защищены.' },
      ],
    },
    { name: 'footerText', type: 'textarea', label: 'Текст в подвале' },
  ],
}
