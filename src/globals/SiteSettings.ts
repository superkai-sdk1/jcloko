import type { GlobalConfig } from 'payload'
import { anyone, isAdminOrEditor } from '../access'

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
    { name: 'footerText', type: 'textarea', label: 'Текст в подвале' },
  ],
}
