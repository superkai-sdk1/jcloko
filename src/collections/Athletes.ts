import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '../access'

export const Athletes: CollectionConfig = {
  slug: 'athletes',
  labels: { singular: 'Спортсмен', plural: 'Спортсмены' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'birthYear', 'rank', 'coach'],
    group: 'Клуб',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', label: 'ФИО', required: true },
    { name: 'photo', type: 'upload', relationTo: 'media', label: 'Фото' },
    { name: 'birthYear', type: 'number', label: 'Год рождения' },
    { name: 'weightCategory', type: 'text', label: 'Весовая категория' },
    { name: 'rank', type: 'text', label: 'Пояс / разряд' },
    {
      name: 'coach',
      type: 'relationship',
      relationTo: 'coaches',
      label: 'Тренер',
    },
    { name: 'bio', type: 'richText', label: 'О спортсмене' },
    {
      name: 'achievements',
      type: 'array',
      label: 'Достижения',
      fields: [
        { name: 'year', type: 'number', label: 'Год' },
        { name: 'title', type: 'text', label: 'Достижение', required: true },
      ],
    },
    {
      type: 'collapsible',
      label: 'Согласие на обработку ПДн (152-ФЗ)',
      admin: {
        description: 'Административная подстраховка перед публикацией фото несовершеннолетних. Само согласие собирается офлайн клубом.',
      },
      fields: [
        {
          name: 'parentalConsentObtained',
          type: 'checkbox',
          label: 'Согласие родителей/законных представителей получено',
          defaultValue: false,
        },
        {
          name: 'parentalConsentDate',
          type: 'date',
          label: 'Дата получения согласия',
          admin: {
            condition: (data) => Boolean(data?.parentalConsentObtained),
          },
        },
      ],
    },
  ],
}
