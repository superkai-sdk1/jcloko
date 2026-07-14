import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor, adminEditorOrOwner } from '../access'

export const Coaches: CollectionConfig = {
  slug: 'coaches',
  labels: { singular: 'Тренер', plural: 'Тренеры' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'rank', 'displayOrder'],
    group: 'Клуб',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    // Тренер может править свой профиль (связь user == он сам)
    update: adminEditorOrOwner('user'),
    delete: isAdminOrEditor,
  },
  defaultSort: 'displayOrder',
  fields: [
    { name: 'name', type: 'text', label: 'ФИО', required: true },
    { name: 'title', type: 'text', label: 'Должность / статус' },
    { name: 'rank', type: 'text', label: 'Пояс / дан / разряд' },
    { name: 'photo', type: 'upload', relationTo: 'media', label: 'Фото' },
    { name: 'bio', type: 'richText', label: 'Биография' },
    {
      name: 'specializations',
      type: 'array',
      label: 'Специализации',
      fields: [{ name: 'value', type: 'text', label: 'Направление' }],
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Учётная запись тренера',
      admin: {
        position: 'sidebar',
        description: 'Привяжите пользователя с ролью «тренер», чтобы он мог редактировать свой профиль и расписание своих групп.',
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
