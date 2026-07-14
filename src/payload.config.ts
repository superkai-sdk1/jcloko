import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Coaches } from './collections/Coaches'
import { Athletes } from './collections/Athletes'
import { ScheduleEntry } from './collections/ScheduleEntry'
import { NewsPost } from './collections/NewsPost'
import { Partners } from './collections/Partners'
import { MediaGallery } from './collections/MediaGallery'
import { SocialPostQueue } from './collections/SocialPostQueue'
import { Pages } from './collections/Pages'
import { SiteSettings } from './globals/SiteSettings'
import { IntegrationSettings } from './globals/IntegrationSettings'

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
  collections: [
    Pages,
    NewsPost,
    MediaGallery,
    Coaches,
    Athletes,
    ScheduleEntry,
    Partners,
    Media,
    Users,
    SocialPostQueue,
  ],
  globals: [SiteSettings, IntegrationSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Схема управляется миграциями (`payload migrate`, авто-применение при старте).
    // push отключён, чтобы прод и дев были согласованы и не было скрытого дрейфа.
    push: false,
  }),
  sharp,
  // Идемпотентный сидинг первого админа при первом старте контейнера.
  // Управляется переменными SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD.
  onInit: async (payload) => {
    const email = process.env.SEED_ADMIN_EMAIL
    const password = process.env.SEED_ADMIN_PASSWORD
    if (!email || !password) return

    const existing = await payload.count({ collection: 'users' })
    if (existing.totalDocs > 0) return

    await payload.create({
      collection: 'users',
      data: { email, password, role: 'admin', name: 'Администратор' },
    })
    payload.logger.info(`Seeded initial admin user: ${email}`)
  },
  plugins: [],
})
