import type { Field } from 'payload'
import { slugify } from '../utils/slug'

/**
 * Поле slug: если пустое — генерируется из указанного поля (по умолчанию `title`)
 * при сохранении. Уникальное, индексируется.
 */
export const slugField = (sourceField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'ЧПУ-адрес. Оставьте пустым — будет создан из заголовка.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) return slugify(value)
        const source = (data as Record<string, unknown> | undefined)?.[sourceField]
        if (typeof source === 'string' && source.length > 0) return slugify(source)
        return value
      },
    ],
  },
})
