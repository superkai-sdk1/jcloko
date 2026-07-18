import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '../access'
import { slugField } from '../fields/slug'

/** Спортзалы (места тренировок) — точки на карте + привязка расписания. */
export const Halls: CollectionConfig = {
  slug: 'halls',
  labels: { singular: 'Зал', plural: 'Залы' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'address', 'displayOrder'],
    group: 'Клуб',
    description: 'Спортзалы клуба: адрес, вместимость и позиция на интерактивной карте.',
  },
  defaultSort: 'displayOrder',
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Название зала', required: true },
    { name: 'city', type: 'text', label: 'Город / населённый пункт' },
    { name: 'address', type: 'text', label: 'Адрес', required: true },
    { name: 'note', type: 'text', label: 'Вместимость / примечание', admin: { description: 'Например: «60 человек».' } },
    { name: 'description', type: 'textarea', label: 'Описание зала', admin: { description: 'Основная информация о зале — показывается на странице зала.' } },
    { name: 'phone', type: 'text', label: 'Телефон зала' },
    { name: 'photo', type: 'upload', relationTo: 'media', label: 'Фото зала' },
    {
      name: 'coach',
      type: 'relationship',
      relationTo: 'coaches',
      label: 'Ответственный тренер',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'mapX',
          type: 'number',
          label: 'Позиция на карте — X (0–100)',
          admin: { width: '50%', description: 'По горизонтали: 0 — запад, 100 — восток.' },
        },
        {
          name: 'mapY',
          type: 'number',
          label: 'Позиция на карте — Y (0–100)',
          admin: { width: '50%', description: 'По вертикали: 0 — север, 100 — юг.' },
        },
      ],
    },
    { name: 'displayOrder', type: 'number', label: 'Порядок вывода', defaultValue: 0, admin: { position: 'sidebar' } },
    slugField('name'),
  ],
}
