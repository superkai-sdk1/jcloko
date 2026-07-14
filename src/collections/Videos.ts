import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { anyone, isAdminOrEditor } from '../access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: { singular: 'Видео', plural: 'Видео (для слайдера)' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'progress'],
    group: 'Контент',
    description: 'Загрузите видео любого формата — оно автоматически сожмётся в WebM для слайдера.',
    // Скрыто из основной навигации: видео загружается прямо в редакторе страницы
    // (блок «Слайдер-герой» → поле «Видео-фон» → «Создать»), а не как отдельный раздел.
    hidden: true,
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'title', type: 'text', label: 'Название' },
    {
      name: 'trimSeconds',
      type: 'number',
      label: 'Обрезать до N секунд',
      defaultValue: 0,
      admin: {
        description: '0 — не обрезать. Для hero обычно достаточно 8–15 секунд (меньше вес, быстрее транскод).',
      },
    },
    // Прогресс-бар транскодирования (кастомный компонент админки)
    {
      name: 'transcodeProgress',
      type: 'ui',
      admin: { components: { Field: '/components/admin/VideoProgress#VideoProgress' } },
    },
    // Служебные поля (заполняются задачей транскода)
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      defaultValue: 'pending',
      options: [
        { label: 'Ожидает', value: 'pending' },
        { label: 'Конвертируется', value: 'processing' },
        { label: 'Готово', value: 'ready' },
        { label: 'Ошибка', value: 'failed' },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    { name: 'progress', type: 'number', label: 'Прогресс, %', defaultValue: 0, admin: { position: 'sidebar', readOnly: true } },
    { name: 'durationSeconds', type: 'number', label: 'Длительность, с', admin: { position: 'sidebar', readOnly: true } },
    { name: 'webmFilename', type: 'text', admin: { hidden: true } },
    { name: 'posterFilename', type: 'text', admin: { hidden: true } },
    { name: 'errorText', type: 'text', admin: { hidden: true } },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../media/videos'),
    mimeTypes: ['video/*'],
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // При загрузке нового видео ставим задачу транскода в очередь.
        if (operation !== 'create') return
        try {
          await req.payload.jobs.queue({ task: 'transcodeVideo', input: { videoId: String(doc.id) } })
        } catch (err) {
          req.payload.logger.error(err, '[videos] enqueue transcode failed')
        }
      },
    ],
  },
}
