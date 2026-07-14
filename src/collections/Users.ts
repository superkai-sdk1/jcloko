import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminFieldLevel } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
    group: 'Управление',
  },
  auth: true,
  access: {
    // Создавать/удалять пользователей может только администратор
    create: isAdmin,
    delete: isAdmin,
    // Админ и редактор видят всех; тренер — только себя
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'editor') return true
      return { id: { equals: user.id } }
    },
    // Админ правит всех; остальные — только свой профиль
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Имя',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Роль',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Администратор', value: 'admin' },
        { label: 'Редактор', value: 'editor' },
        { label: 'Тренер', value: 'coach' },
      ],
      admin: {
        description: 'Определяет права в CMS.',
      },
      // Роль может менять только администратор
      access: {
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
  ],
}
