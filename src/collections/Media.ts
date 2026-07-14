import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // Загруженные файлы пишутся в <корень репо>/media (в контейнере — /app/media),
    // куда смонтирован Docker-том, чтобы они переживали пересборку образа.
    staticDir: path.resolve(dirname, '../../media'),
  },
}
