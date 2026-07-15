import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { ru } from '@payloadcms/translations/languages/ru'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Documents } from './collections/Documents'
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
    Documents,
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
    // 1) Идемпотентный сид первого админа.
    const email = process.env.SEED_ADMIN_EMAIL
    const password = process.env.SEED_ADMIN_PASSWORD
    if (email && password) {
      const existing = await payload.count({ collection: 'users' })
      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'users',
          data: { email, password, role: 'admin', name: 'Администратор' },
        })
        payload.logger.info(`Seeded initial admin user: ${email}`)
      }
    }

    // 2) Идемпотентный сид CMS-страницы «Образовательная деятельность».
    //    Создаётся один раз; далее редактируется в админке как обычная страница.
    try {
      const eduSlug = 'obrazovatelnaya-deyatelnost'
      const found = await payload.find({
        collection: 'pages',
        where: { slug: { equals: eduSlug } },
        limit: 1,
        depth: 0,
      })
      if (found.totalDocs === 0) {
        await payload.create({
          collection: 'pages',
          data: {
            title: 'Образовательная деятельность',
            slug: eduSlug,
            status: 'published',
            layout: [
              {
                blockType: 'educationProgram',
                eyebrow: 'О клубе',
                heading: 'Образовательная деятельность',
                intro:
                  'Дополнительная образовательная программа спортивной подготовки по виду спорта «Дзюдо». Разработана на основе Федерального стандарта спортивной подготовки, утверждённого приказом Министерства спорта России от 14.08.2025 г. № 655.',
                showProgramDetails: true,
                meta: [
                  { k: 'Организация', v: 'РОО КБР «ДЮСШ Клуба дзюдо “Локомотив”»' },
                  { k: 'Принято', v: 'Педагогический совет, протокол № 2 от 23.12.2025 г.' },
                  { k: 'Утверждаю', v: 'Генеральный директор Н. Х. Гаданов' },
                  { k: 'Срок реализации', v: 'Без ограничения · г. о. Нальчик' },
                ],
              },
            ],
          } as never,
        })
        payload.logger.info('Seeded page: Образовательная деятельность')
      }
    } catch (err) {
      payload.logger.error({ err }, 'Failed to seed education page')
    }
  },
  plugins: [],
})
