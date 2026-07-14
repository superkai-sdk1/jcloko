import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || undefined,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Локомотив Дзюдо',
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Фаза 0: авто-синхронизация схемы (dev-подобный режим).
    // В Фазе 1, когда модель данных стабилизируется, переключимся на
    // сгенерированные миграции (`payload migrate`) и push: false.
    push: true,
  }),
  sharp,
  // Идемпотентный сидинг первого админа при первом старте контейнера.
  // Управляется переменными SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD.
  // Если пользователи уже есть — ничего не делает.
  onInit: async (payload) => {
    const email = process.env.SEED_ADMIN_EMAIL
    const password = process.env.SEED_ADMIN_PASSWORD
    if (!email || !password) return

    const existing = await payload.count({ collection: 'users' })
    if (existing.totalDocs > 0) return

    await payload.create({
      collection: 'users',
      data: { email, password },
    })
    payload.logger.info(`Seeded initial admin user: ${email}`)
  },
  plugins: [],
})
