import type { GlobalConfig } from 'payload'
import { isAdmin } from '../access'

/**
 * Единая точка включения интеграций с Telegram/ВК.
 * ВАЖНО: read/update — только администратор, чтобы токены НЕ отдавались
 * в публичном REST/GraphQL API не-admin роли (требование 152-ФЗ / Фазы 6).
 * Пока `enabled = false` (по умолчанию) весь интеграционный слой пассивен.
 */
export const IntegrationSettings: GlobalConfig = {
  slug: 'integration-settings',
  label: 'Интеграции (Telegram / ВК)',
  admin: {
    group: 'Настройки',
    hidden: ({ user }) => user?.role !== 'admin',
  },
  access: {
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      type: 'group',
      name: 'telegram',
      label: 'Telegram',
      fields: [
        { name: 'enabled', type: 'checkbox', label: 'Интеграция включена', defaultValue: false },
        { name: 'botToken', type: 'text', label: 'Bot Token' },
        { name: 'channelId', type: 'text', label: 'ID / @username канала' },
        { name: 'crosspostOnPublish', type: 'checkbox', label: 'Постить новости с сайта в Telegram', defaultValue: false },
      ],
    },
    {
      type: 'group',
      name: 'vk',
      label: 'ВКонтакте',
      fields: [
        { name: 'enabled', type: 'checkbox', label: 'Интеграция включена', defaultValue: false },
        { name: 'accessToken', type: 'text', label: 'Access Token сообщества (право wall)' },
        { name: 'groupId', type: 'text', label: 'ID сообщества' },
        { name: 'confirmationToken', type: 'text', label: 'Строка подтверждения Callback API' },
        { name: 'crosspostOnPublish', type: 'checkbox', label: 'Постить новости с сайта в ВК', defaultValue: false },
      ],
    },
    {
      type: 'group',
      name: 'deduplication',
      label: 'Дедупликация кросс-постов',
      fields: [
        { name: 'enabled', type: 'checkbox', label: 'Включена', defaultValue: true },
        { name: 'timeWindowMinutes', type: 'number', label: 'Временное окно, мин', defaultValue: 30 },
        { name: 'similarityThreshold', type: 'number', label: 'Порог авто-мержа (0–1)', defaultValue: 0.82 },
        { name: 'reviewLowerBound', type: 'number', label: 'Нижняя граница ручной проверки (0–1)', defaultValue: 0.5 },
      ],
    },
  ],
}
