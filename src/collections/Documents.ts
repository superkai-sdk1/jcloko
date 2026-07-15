import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { anyone, isAdminOrEditor } from '../access'
import { slugify } from '../utils/slug'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Загружаемые файлы для скачивания на сайте (PDF, документы Word и т. п.).
 * Отдельно от Media, чтобы не запускать обработку изображений на файлах.
 */
export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Документ', plural: 'Документы' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'filename', 'updatedAt'],
    group: 'Контент',
    description: 'Файлы для скачивания (например, программа спортивной подготовки в PDF).',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeOperation: [
      ({ req, operation }) => {
        // Транслитерация имени файла: «Программа 2026.pdf» → «programma-2026.pdf».
        if ((operation === 'create' || operation === 'update') && req.file?.name) {
          const ext = path.extname(req.file.name).toLowerCase()
          const base = slugify(path.basename(req.file.name, ext)) || 'file'
          req.file.name = `${base}${ext}`
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название',
      admin: { description: 'Понятное имя документа для админки (необязательно).' },
    },
  ],
  upload: {
    // В тот же том, что и Media (переживает пересборку образа).
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
}
