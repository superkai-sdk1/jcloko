import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'

/**
 * Служебный буфер сырых постов из TG/ВК для пайплайна дедупликации (Фаза 5).
 * Не в основной навигации, доступ только у администратора.
 */
export const SocialPostQueue: CollectionConfig = {
  slug: 'social-post-queue',
  labels: { singular: 'Пост из соцсети', plural: 'Очередь постов (служебное)' },
  admin: {
    useAsTitle: 'externalId',
    defaultColumns: ['platform', 'externalId', 'status', 'receivedAt'],
    group: 'Служебное',
    hidden: ({ user }) => user?.role !== 'admin',
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  indexes: [{ fields: ['platform', 'externalId'], unique: true }],
  fields: [
    {
      name: 'platform',
      type: 'select',
      label: 'Платформа',
      required: true,
      options: [
        { label: 'Telegram', value: 'telegram' },
        { label: 'ВКонтакте', value: 'vk' },
      ],
    },
    { name: 'externalId', type: 'text', label: 'Внешний ID', required: true, index: true },
    { name: 'receivedAt', type: 'date', label: 'Получено', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'rawText', type: 'textarea', label: 'Исходный текст' },
    { name: 'normalizedText', type: 'textarea', label: 'Нормализованный текст' },
    { name: 'mediaHashes', type: 'json', label: 'pHash изображений' },
    { name: 'url', type: 'text', label: 'Ссылка на оригинал' },
    { name: 'rawPayload', type: 'json', label: 'Сырой payload' },
    {
      name: 'status',
      type: 'select',
      label: 'Статус обработки',
      defaultValue: 'pending',
      options: [
        { label: 'Ожидает', value: 'pending' },
        { label: 'Обработано', value: 'processed' },
        { label: 'Слито', value: 'merged' },
        { label: 'Отклонено', value: 'discarded' },
      ],
    },
    {
      name: 'linkedNewsPost',
      type: 'relationship',
      relationTo: 'news',
      label: 'Связанная новость',
    },
  ],
}
