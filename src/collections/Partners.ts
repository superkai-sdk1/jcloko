import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '../access'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: 'Спонсор / партнёр', plural: 'Спонсоры и партнёры' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'isGeneralPartner', 'erid', 'displayOrder'],
    group: 'Клуб',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  defaultSort: 'displayOrder',
  fields: [
    { name: 'name', type: 'text', label: 'Название', required: true },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Логотип / иконка',
      admin: { description: 'Основной логотип (используется на тёмной теме и в шапке). Если логотип светлый — загрузите тёмную версию ниже.' },
    },
    {
      name: 'logoLight',
      type: 'upload',
      relationTo: 'media',
      label: 'Логотип для светлой темы',
      admin: {
        description:
          'Вторая версия логотипа для светлой темы (например, тёмная версия, если основной — белый). На светлой теме сайт покажет её вместо основного. Необязательно.',
      },
    },
    {
      name: 'pageLogo',
      type: 'upload',
      relationTo: 'media',
      label: 'Логотип для страницы «Партнёры»',
      admin: {
        description:
          'Отдельный логотип для страницы партнёров (если нужен другой, чем в шапке). Если не задан — используется основной логотип.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      admin: { description: 'Короткий текст о партнёре — показывается на странице «Партнёры».' },
    },
    // ── Ссылка спонсора ────────────────────────────────────────────────────
    {
      name: 'linkType',
      type: 'select',
      label: 'Куда ведёт ссылка',
      defaultValue: 'external',
      options: [
        { label: 'Внешний сайт', value: 'external' },
        { label: 'Раздел на нашем сайте', value: 'internal' },
        { label: 'Без ссылки', value: 'none' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      label: 'Ссылка на сайт спонсора',
      admin: {
        condition: (_, sibling) => sibling?.linkType === 'external',
        placeholder: 'https://…',
      },
    },
    {
      name: 'internalPage',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Раздел на нашем сайте',
      admin: { condition: (_, sibling) => sibling?.linkType === 'internal' },
    },
    // ── Рекламная маркировка (38-ФЗ «О рекламе») ───────────────────────────
    {
      type: 'collapsible',
      label: 'Рекламная маркировка (erid)',
      admin: {
        description: 'Для рекламных размещений по 38-ФЗ. Показывается меткой «Реклама» при наведении.',
      },
      fields: [
        { name: 'erid', type: 'text', label: 'erid (рекламный идентификатор)' },
        {
          name: 'advertiserInfo',
          type: 'textarea',
          label: 'Информация о рекламодателе',
          admin: { description: 'Например: ОАО «РЖД», ИНН 7708503727.' },
        },
      ],
    },
    {
      name: 'isGeneralPartner',
      type: 'checkbox',
      label: 'Генеральный спонсор (иконка в шапке)',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Показывается кликабельной иконкой в конце панели навигации.',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      label: 'Порядок вывода',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
