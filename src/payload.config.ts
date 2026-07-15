import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { ru } from '@payloadcms/translations/languages/ru'
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
import { FormSubmission } from './collections/FormSubmission'
import { Pages } from './collections/Pages'
import { SiteSettings } from './globals/SiteSettings'
import { IntegrationSettings } from './globals/IntegrationSettings'
import { Videos } from './collections/Videos'
import { crosspostTelegram } from './integrations/telegram/crosspost'
import { crosspostVk } from './integrations/vk/crosspost'
import { transcodeVideo } from './integrations/video/transcode'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || undefined,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // Единый формат дат по всей админке (в т.ч. Создано/Последнее изменение):
    // день.месяц.год + 24-часовое время.
    dateFormat: 'dd.MM.yyyy HH:mm',
    meta: {
      titleSuffix: ' — JC/LOKO/ADMIN',
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
      beforeDashboard: ['/components/admin/DashboardWelcome#DashboardWelcome'],
    },
  },
  collections: [
    Pages,
    NewsPost,
    MediaGallery,
    Videos,
    Coaches,
    Athletes,
    ScheduleEntry,
    Partners,
    Media,
    Users,
    SocialPostQueue,
    FormSubmission,
  ],
  globals: [SiteSettings, IntegrationSettings],
  // Русифицированный интерфейс админки и редактора.
  i18n: {
    supportedLanguages: { ru },
    fallbackLanguage: 'ru',
  },
  // Асинхронные задачи (обратный постинг в соцсети с ретраями).
  jobs: {
    tasks: [
      {
        slug: 'crosspostTelegram',
        retries: 3,
        inputSchema: [{ name: 'postId', type: 'text', required: true }],
        handler: async ({ input, req }) => {
          await crosspostTelegram(req.payload, (input as { postId: string }).postId)
          return { output: {} }
        },
      },
      {
        slug: 'crosspostVk',
        retries: 3,
        inputSchema: [{ name: 'postId', type: 'text', required: true }],
        handler: async ({ input, req }) => {
          await crosspostVk(req.payload, (input as { postId: string }).postId)
          return { output: {} }
        },
      },
      {
        slug: 'transcodeVideo',
        retries: 1,
        inputSchema: [{ name: 'videoId', type: 'text', required: true }],
        handler: async ({ input, req }) => {
          await transcodeVideo(req.payload, (input as { videoId: string }).videoId)
          return { output: {} }
        },
      },
    ],
    // Внутренний крон обрабатывает очередь раз в минуту (процесс long-running).
    autoRun: [{ cron: '* * * * *', queue: 'default' }],
  },
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
