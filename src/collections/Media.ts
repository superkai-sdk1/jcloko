import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { anyone, isAdminOrEditor } from '../access'
import { slugify } from '../utils/slug'

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
  hooks: {
    beforeOperation: [
      ({ req, operation }) => {
        // Транслитерация имени файла при загрузке: «Ген спонсор (6).svg» → «gen-sponsor-6.svg».
        // Иначе кириллица/пробелы/скобки ломают URL картинок.
        if ((operation === 'create' || operation === 'update') && req.file?.name) {
          const ext = path.extname(req.file.name).toLowerCase()
          const base = slugify(path.basename(req.file.name, ext)) || 'file'
          req.file.name = `${base}${ext}`
        }
      },
    ],
    beforeValidate: [
      ({ data }) => {
        // Авто-alt из имени файла, если не заполнен (на сайте alt подставляется
        // из названия спонсора/заголовка при рендере).
        if (data && !data.alt && typeof data.filename === 'string') {
          data.alt = path.basename(data.filename, path.extname(data.filename)).replace(/[-_]+/g, ' ')
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt-текст (для доступности и SEO)',
      admin: { description: 'Можно оставить пустым — подставится из имени файла / названия при показе.' },
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
    // Растровые превью (thumbnail/card/hero) — в WebP. Основной файл НЕ конвертируем,
    // чтобы не ломать SVG-логотипы; на витрине для фото используются webp-размеры.
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre', formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'card', width: 768, height: 512, position: 'centre', formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'hero', width: 1920, height: 1080, position: 'centre', formatOptions: { format: 'webp', options: { quality: 82 } } },
    ],
    focalPoint: true,
    mimeTypes: ['image/*'],
  },
}
