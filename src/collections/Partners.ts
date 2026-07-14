import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '../access'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: 'Партнёр', plural: 'Партнёры' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'isGeneralPartner', 'displayOrder'],
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
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Логотип' },
    { name: 'url', type: 'text', label: 'Ссылка на сайт' },
    {
      name: 'isGeneralPartner',
      type: 'checkbox',
      label: 'Генеральный партнёр',
      defaultValue: false,
      admin: { position: 'sidebar' },
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
