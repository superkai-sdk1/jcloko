import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { anyone, isAdminOrEditor } from '../access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Файл', plural: 'Медиа-библиотека' },
  admin: { group: 'Контент' },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt-текст (для доступности и SEO)',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Подпись',
    },
  ],
  upload: {
    // Загруженные файлы пишутся в <корень репо>/media (в контейнере — /app/media),
    // куда смонтирован Docker-том, чтобы они переживали пересборку образа.
    staticDir: path.resolve(dirname, '../../media'),
    // Все растровые картинки конвертируются в WebP (сильное сжатие). SVG остаётся вектором.
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre', formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'card', width: 768, height: 512, position: 'centre', formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'hero', width: 1920, height: 1080, position: 'centre', formatOptions: { format: 'webp', options: { quality: 82 } } },
    ],
    focalPoint: true,
    mimeTypes: ['image/*'],
  },
}
