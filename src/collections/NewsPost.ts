import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, publishedOrLoggedIn } from '../access'
import { slugField } from '../fields/slug'

const platformOptions = [
  { label: 'Сайт', value: 'site' },
  { label: 'Telegram', value: 'telegram' },
  { label: 'ВКонтакте', value: 'vk' },
]

export const NewsPost: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'Новость', plural: 'Новости' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'originPlatform', 'publishedAt'],
    group: 'Контент',
  },
  access: {
    read: publishedOrLoggedIn,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  defaultSort: '-publishedAt',
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        try {
          // Обратный постинг только для новостей, созданных на сайте (не из соцсетей —
          // иначе зациклим), и только при переходе в статус «опубликовано».
          if (doc.originPlatform !== 'site') return
          if (doc.status !== 'published') return
          if (operation === 'update' && previousDoc?.status === 'published') return

          const settings = await req.payload.findGlobal({
            slug: 'integration-settings',
            overrideAccess: true,
            depth: 0,
          })
          const tg = (settings as { telegram?: { enabled?: boolean; crosspostOnPublish?: boolean } })
            ?.telegram
          if (!tg?.enabled || !tg?.crosspostOnPublish) return

          await req.payload.jobs.queue({
            task: 'crosspostTelegram',
            input: { postId: String(doc.id) },
          })
        } catch (err) {
          req.payload.logger.error(err, '[news afterChange] enqueue crosspost failed')
        }
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', label: 'Заголовок', required: true },
    slugField('title'),
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          label: 'Статус',
          required: true,
          defaultValue: 'draft',
          options: [
            { label: 'Черновик', value: 'draft' },
            { label: 'Опубликовано', value: 'published' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'publishedAt',
          type: 'date',
          label: 'Дата публикации',
          admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    { name: 'excerpt', type: 'textarea', label: 'Краткое описание' },
    { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Обложка' },
    { name: 'content', type: 'richText', label: 'Текст новости' },
    {
      name: 'originPlatform',
      type: 'select',
      label: 'Источник происхождения',
      defaultValue: 'site',
      options: platformOptions,
      admin: {
        position: 'sidebar',
        description: 'Где новость появилась изначально. От этого зависит обратный постинг (site → соцсети).',
      },
    },
    // ── Интеграционная телеметрия (заполняется хуками в Фазах 3–5) ──
    {
      type: 'collapsible',
      label: 'Источники и кросс-постинг',
      admin: {
        initCollapsed: true,
        description: 'Служебные данные интеграций с Telegram/ВК. Заполняются автоматически.',
      },
      fields: [
        {
          name: 'sources',
          type: 'array',
          label: 'Источники (для дедупликации кросс-постов)',
          fields: [
            { name: 'platform', type: 'select', label: 'Платформа', options: platformOptions, required: true },
            { name: 'externalId', type: 'text', label: 'Внешний ID' },
            { name: 'url', type: 'text', label: 'Ссылка на оригинал' },
            { name: 'rawPayload', type: 'json', label: 'Сырой payload' },
          ],
        },
        {
          name: 'crosspostTargets',
          type: 'array',
          label: 'Обратный постинг',
          fields: [
            {
              name: 'platform',
              type: 'select',
              label: 'Платформа',
              options: [
                { label: 'Telegram', value: 'telegram' },
                { label: 'ВКонтакте', value: 'vk' },
              ],
              required: true,
            },
            {
              name: 'status',
              type: 'select',
              label: 'Статус',
              defaultValue: 'pending',
              options: [
                { label: 'Ожидает', value: 'pending' },
                { label: 'Отправлено', value: 'sent' },
                { label: 'Ошибка', value: 'failed' },
                { label: 'Пропущено', value: 'skipped' },
              ],
            },
            { name: 'remoteUrl', type: 'text', label: 'Ссылка на публикацию' },
            { name: 'error', type: 'text', label: 'Текст ошибки' },
            { name: 'attempts', type: 'number', label: 'Попыток', defaultValue: 0 },
            { name: 'lastAttemptAt', type: 'date', label: 'Последняя попытка' },
          ],
        },
        {
          name: 'needsReviewDuplicate',
          type: 'checkbox',
          label: 'Возможный дубликат — требуется ручная проверка',
          defaultValue: false,
        },
        {
          name: 'mergedFrom',
          type: 'array',
          label: 'Слито из источников',
          fields: [
            { name: 'platform', type: 'select', label: 'Платформа', options: platformOptions },
            { name: 'externalId', type: 'text', label: 'Внешний ID' },
          ],
        },
      ],
    },
  ],
}
