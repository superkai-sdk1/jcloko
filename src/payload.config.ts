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
import { navLinks } from './lib/nav'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ── Мини-хелперы для сборки Lexical editorState (сид richText-контента) ────────
const lexText = (text: string) => ({ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 })
const lexPara = (text: string) => ({
  type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '', children: [lexText(text)],
})
const lexHeading = (text: string, tag: 'h2' | 'h3' = 'h2') => ({
  type: 'heading', tag, direction: 'ltr', format: '', indent: 0, version: 1, children: [lexText(text)],
})
const lexRoot = (children: unknown[]) => ({ root: { type: 'root', direction: 'ltr', format: '', indent: 0, version: 1, children } })

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
      titleSuffix: ' — LokoAdmin',
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
      beforeDashboard: ['/components/admin/DashboardWelcome#DashboardWelcome'],
      // Кнопка «Поддержка» внизу боковой навигации
      afterNavLinks: ['/components/admin/SupportNavLink#SupportNavLink'],
      // Кастомная страница /admin/support
      views: {
        support: {
          Component: '/components/admin/SupportView#SupportView',
          path: '/support',
        },
      },
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

    // 3) Идемпотентный сид меню навигации в «Настройки сайта», чтобы админ
    //    редактировал текущее меню, а не собирал его с нуля.
    try {
      const s = (await payload.findGlobal({ slug: 'site-settings', depth: 0 })) as unknown as Record<string, unknown>
      const nav = s?.navigation
      if (!Array.isArray(nav) || nav.length === 0) {
        // Пишем обратно все существующие поля (без системных), добавляя только меню —
        // так гарантированно не теряем название/контакты/логотип и т. п.
        const { id: _id, createdAt: _c, updatedAt: _u, globalType: _g, ...rest } = s
        await payload.updateGlobal({
          slug: 'site-settings',
          data: {
            ...rest,
            navigation: navLinks.map((l) => ({
              label: l.label,
              href: l.href,
              children: (l.children ?? []).map((c) => ({ label: c.label, href: c.href, description: c.description })),
            })),
          } as never,
        })
        payload.logger.info('Seeded site navigation')
      }
    } catch (err) {
      payload.logger.error({ err }, 'Failed to seed navigation')
    }

    // 4) Идемпотентный сид CMS-страницы «Политика конфиденциальности».
    try {
      const slug = 'politika'
      const found = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
      if (found.totalDocs === 0) {
        await payload.create({
          collection: 'pages',
          data: {
            title: 'Политика конфиденциальности',
            slug,
            status: 'published',
            layout: [
              {
                blockType: 'richText',
                content: lexRoot([
                  lexHeading('Политика конфиденциальности'),
                  lexPara('Настоящая Политика обработки персональных данных составлена в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению их безопасности, предпринимаемые клубом дзюдо «Локомотив» (далее — Оператор).'),
                  lexHeading('1. Общие положения'),
                  lexPara('Оператор ставит своей важнейшей целью соблюдение прав и свобод человека при обработке его персональных данных, в том числе защиты прав на неприкосновенность частной жизни, личную и семейную тайну.'),
                  lexHeading('2. Какие данные обрабатываются'),
                  lexPara('При отправке заявки через формы на сайте Оператор обрабатывает: имя, контактный телефон и/или адрес электронной почты, а также текст сообщения, добровольно предоставленный пользователем.'),
                  lexHeading('3. Цели обработки'),
                  lexPara('Обработка персональных данных осуществляется в целях обратной связи с пользователем, записи на тренировки и предоставления информации об услугах клуба.'),
                  lexHeading('4. Правовые основания'),
                  lexPara('Оператор обрабатывает персональные данные только при их предоставлении и/или согласии пользователя, выраженном путём проставления отметки о согласии в формах сайта. Согласие является добровольным и может быть отозвано.'),
                  lexHeading('5. Права пользователя'),
                  lexPara('Пользователь вправе получать информацию об обработке своих персональных данных, требовать их уточнения, блокирования или уничтожения, а также отозвать согласие на обработку, направив соответствующий запрос по контактам, указанным на сайте.'),
                  lexHeading('6. Меры защиты'),
                  lexPara('Оператор принимает необходимые правовые, организационные и технические меры для защиты персональных данных от неправомерного доступа, уничтожения, изменения, блокирования и иных неправомерных действий.'),
                  lexPara('Итоговая редакция юридических текстов согласуется на этапе запуска сайта.'),
                ]),
              },
            ],
          } as never,
        })
        payload.logger.info('Seeded page: Политика конфиденциальности')
      }
    } catch (err) {
      payload.logger.error({ err }, 'Failed to seed privacy page')
    }

    // 5) Идемпотентный сид CMS-страницы «Вызов Локомотива» (ПМЭФ/КИФ) — /forum.
    try {
      const slug = 'forum'
      const found = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
      if (found.totalDocs === 0) {
        await payload.create({
          collection: 'pages',
          data: {
            title: 'Вызов Локомотива (ПМЭФ / КИФ)',
            slug,
            status: 'published',
            layout: [{ blockType: 'forumChallenge', showSlides: true }],
          } as never,
        })
        payload.logger.info('Seeded page: Вызов Локомотива (forum)')
      }
    } catch (err) {
      payload.logger.error({ err }, 'Failed to seed forum page')
    }
  },
  plugins: [],
})
