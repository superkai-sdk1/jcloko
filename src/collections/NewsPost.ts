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
    preview: (doc) => {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
      const slug = typeof doc?.slug === 'string' ? doc.slug : ''
      return slug ? `${base}/novosti/${slug}` : null
    },
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
          const vk = (settings as { vk?: { enabled?: boolean; crosspostOnPublish?: boolean } })?.vk

          if (tg?.enabled && tg?.crosspostOnPublish) {
            await req.payload.jobs.queue({
              task: 'crosspostTelegram',
              input: { postId: String(doc.id) },
            })
          }
          if (vk?.enabled && vk?.crosspostOnPublish) {
            await req.payload.jobs.queue({
              task: 'crosspostVk',
              input: { postId: String(doc.id) },
            })
          }
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
          admin: { width: '50%', date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd.MM.yyyy HH:mm', timeFormat: 'HH:mm' } },
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
    // ── Рекламная маркировка (38-ФЗ «О рекламе») ───────────────────────────
    {
      type: 'collapsible',
      label: 'Рекламная маркировка (erid)',
      admin: {
        initCollapsed: true,
        description: 'Если новость — реклама, отметьте и укажите erid. На сайте появится метка «Реклама».',
      },
      fields: [
        {
          name: 'isAdvertising',
          type: 'checkbox',
          label: 'Это рекламная публикация',
          defaultValue: false,
        },
        {
          name: 'erid',
          type: 'text',
          label: 'erid (рекламный идентификатор)',
          admin: { condition: (data) => Boolean(data?.isAdvertising) },
        },
        {
          name: 'advertiserInfo',
          type: 'textarea',
          label: 'Информация о рекламодателе',
          admin: { condition: (data) => Boolean(data?.isAdvertising) },
        },
      ],
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
            { name: 'lastAttemptAt', type: 'date', label: 'Последняя попытка', admin: { date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd.MM.yyyy HH:mm', timeFormat: 'HH:mm' } } },
          ],
        },
        {
          name: 'needsReviewDuplicate',
          type: 'checkbox',
          label: 'Возможный дубликат — требуется ручная проверка',
          defaultValue: false,
        },
        {
          name: 'duplicateOf',
          type: 'relationship',
          relationTo: 'news',
          label: 'Похоже на новость',
          admin: { description: 'Заполняется дедупликатором для ручной проверки/мержа.' },
        },
        {
          name: 'similarityScore',
          type: 'number',
          label: 'Оценка схожести (0–1)',
          admin: { step: 0.01 },
        },
        {
          name: 'imageHash',
          type: 'text',
          label: 'pHash обложки',
          admin: { readOnly: true },
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
