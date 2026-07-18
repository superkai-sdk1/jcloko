import type { Block, Field } from 'payload'

/**
 * Конфиги блоков для конструктора страниц (Pages.layout).
 */

/** Переиспользуемое поле «надзаголовок» (eyebrow) — маленькая подпись над заголовком секции. */
const eyebrowField: Field = {
  name: 'eyebrow',
  type: 'text',
  label: 'Надзаголовок (eyebrow)',
  admin: { description: 'Маленькая подпись над заголовком секции. Если пусто — берётся значение по умолчанию.' },
}

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: { singular: 'Текст', plural: 'Текстовые блоки' },
  fields: [{ name: 'content', type: 'richText', label: 'Текст' }],
}

export const HeroSliderBlock: Block = {
  slug: 'heroSlider',
  interfaceName: 'HeroSliderBlock',
  labels: { singular: 'Слайдер-герой', plural: 'Слайдеры-герои' },
  fields: [
    {
      name: 'slides',
      type: 'array',
      label: 'Слайды',
      minRows: 1,
      fields: [
        {
          name: 'video',
          type: 'relationship',
          relationTo: 'videos',
          label: 'Видео-фон (автоплей, приоритетнее картинки)',
          admin: { description: 'Загрузите видео в разделе «Видео» — оно сожмётся в WebM.' },
        },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Изображение / постер' },
        { name: 'heading', type: 'text', label: 'Заголовок' },
        { name: 'subheading', type: 'text', label: 'Подзаголовок' },
        {
          type: 'row',
          fields: [
            { name: 'ctaLabel', type: 'text', label: 'Текст кнопки', admin: { width: '50%' } },
            { name: 'ctaUrl', type: 'text', label: 'Ссылка кнопки', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'adaptContrast',
      type: 'checkbox',
      label: 'Адаптировать контраст текста под цвет видео в реальном времени',
      defaultValue: true,
    },
    {
      name: 'slideDurationSec',
      type: 'number',
      label: 'Смена слайдов, сек',
      defaultValue: 6,
      admin: { description: 'Как часто листаются слайды (для видео обычно дольше — 10–15 с).' },
    },
  ],
}

export const MissionBlock: Block = {
  slug: 'mission',
  interfaceName: 'MissionBlock',
  labels: { singular: 'Миссия', plural: 'Блоки миссии' },
  fields: [
    eyebrowField,
    { name: 'heading', type: 'text', label: 'Заголовок' },
    { name: 'text', type: 'richText', label: 'Текст' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Изображение' },
  ],
}

export const CallToActionBlock: Block = {
  slug: 'callToAction',
  interfaceName: 'CallToActionBlock',
  labels: { singular: 'Призыв к действию', plural: 'Призывы к действию' },
  fields: [
    { name: 'heading', type: 'text', label: 'Заголовок' },
    { name: 'text', type: 'text', label: 'Подпись' },
    {
      type: 'row',
      fields: [
        { name: 'buttonLabel', type: 'text', label: 'Текст кнопки', admin: { width: '50%' } },
        { name: 'buttonUrl', type: 'text', label: 'Ссылка', admin: { width: '50%' } },
      ],
    },
    {
      name: 'style',
      type: 'select',
      label: 'Оформление',
      defaultValue: 'primary',
      options: [
        { label: 'Основное', value: 'primary' },
        { label: 'Контурное', value: 'outline' },
      ],
    },
  ],
}

export const PartnersStripBlock: Block = {
  slug: 'partnersStrip',
  interfaceName: 'PartnersStripBlock',
  labels: { singular: 'Лента партнёров', plural: 'Ленты партнёров' },
  fields: [
    eyebrowField,
    { name: 'heading', type: 'text', label: 'Заголовок' },
    {
      name: 'showAll',
      type: 'checkbox',
      label: 'Показывать всех партнёров',
      defaultValue: true,
    },
    {
      name: 'partners',
      type: 'relationship',
      relationTo: 'partners',
      hasMany: true,
      label: 'Партнёры (если не «показывать всех»)',
      admin: { condition: (_, sibling) => !sibling?.showAll },
    },
  ],
}

export const TimelineBlock: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  labels: { singular: 'История (таймлайн)', plural: 'Таймлайны' },
  fields: [
    eyebrowField,
    { name: 'heading', type: 'text', label: 'Заголовок' },
    {
      name: 'events',
      type: 'array',
      label: 'События',
      fields: [
        { name: 'year', type: 'text', label: 'Год / дата' },
        { name: 'title', type: 'text', label: 'Заголовок', required: true },
        { name: 'description', type: 'textarea', label: 'Описание' },
      ],
    },
  ],
}

export const RulesListBlock: Block = {
  slug: 'rulesList',
  interfaceName: 'RulesListBlock',
  labels: { singular: 'Заповеди / правила', plural: 'Списки правил' },
  fields: [
    eyebrowField,
    { name: 'heading', type: 'text', label: 'Заголовок' },
    {
      name: 'rules',
      type: 'array',
      label: 'Пункты',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок пункта' },
        { name: 'text', type: 'textarea', label: 'Текст' },
      ],
    },
  ],
}

export const TeamGridBlock: Block = {
  slug: 'teamGrid',
  interfaceName: 'TeamGridBlock',
  labels: { singular: 'Сетка команды', plural: 'Сетки команды' },
  fields: [
    eyebrowField,
    { name: 'heading', type: 'text', label: 'Заголовок' },
    {
      name: 'mode',
      type: 'select',
      label: 'Кого показывать',
      defaultValue: 'coaches',
      options: [
        { label: 'Тренеров', value: 'coaches' },
        { label: 'Спортсменов', value: 'athletes' },
      ],
    },
    { name: 'showAll', type: 'checkbox', label: 'Показывать всех', defaultValue: true },
    {
      name: 'coaches',
      type: 'relationship',
      relationTo: 'coaches',
      hasMany: true,
      label: 'Тренеры',
      admin: { condition: (_, sibling) => sibling?.mode === 'coaches' && !sibling?.showAll },
    },
    {
      name: 'athletes',
      type: 'relationship',
      relationTo: 'athletes',
      hasMany: true,
      label: 'Спортсмены',
      admin: { condition: (_, sibling) => sibling?.mode === 'athletes' && !sibling?.showAll },
    },
  ],
}

export const VideoEmbedBlock: Block = {
  slug: 'videoEmbed',
  interfaceName: 'VideoEmbedBlock',
  labels: { singular: 'Видео (embed)', plural: 'Видео-блоки' },
  fields: [
    eyebrowField,
    { name: 'title', type: 'text', label: 'Заголовок' },
    {
      name: 'provider',
      type: 'select',
      label: 'Платформа',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'RuTube', value: 'rutube' },
        { label: 'VK Video', value: 'vk' },
      ],
    },
    { name: 'url', type: 'text', label: 'Ссылка на видео', required: true },
    { name: 'poster', type: 'upload', relationTo: 'media', label: 'Постер-кадр' },
  ],
}

export const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: { singular: 'Галерея', plural: 'Галереи' },
  fields: [
    eyebrowField,
    { name: 'heading', type: 'text', label: 'Заголовок' },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Изображения',
    },
  ],
}

export const ScheduleTableBlock: Block = {
  slug: 'scheduleTable',
  interfaceName: 'ScheduleTableBlock',
  labels: { singular: 'Таблица расписания', plural: 'Таблицы расписания' },
  fields: [
    eyebrowField,
    { name: 'heading', type: 'text', label: 'Заголовок' },
    { name: 'showAll', type: 'checkbox', label: 'Показывать всё расписание', defaultValue: true },
    {
      name: 'entries',
      type: 'relationship',
      relationTo: 'schedule-entries',
      hasMany: true,
      label: 'Занятия (если не всё расписание)',
      admin: { condition: (_, sibling) => !sibling?.showAll },
    },
  ],
}

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  interfaceName: 'ContactFormBlock',
  labels: { singular: 'Форма обратной связи', plural: 'Формы обратной связи' },
  fields: [
    eyebrowField,
    { name: 'heading', type: 'text', label: 'Заголовок' },
    { name: 'description', type: 'textarea', label: 'Описание' },
    { name: 'submitLabel', type: 'text', label: 'Текст кнопки отправки', admin: { description: 'По умолчанию «Отправить заявку».' } },
    { name: 'recipientEmail', type: 'text', label: 'Email получателя заявок' },
    {
      name: 'consentText',
      type: 'textarea',
      label: 'Текст согласия на обработку ПДн (152-ФЗ)',
      admin: { description: 'Отображается рядом с обязательным чекбоксом согласия.' },
    },
  ],
}

export const FAQAccordionBlock: Block = {
  slug: 'faqAccordion',
  interfaceName: 'FAQAccordionBlock',
  labels: { singular: 'FAQ (аккордеон)', plural: 'FAQ-блоки' },
  fields: [
    eyebrowField,
    { name: 'heading', type: 'text', label: 'Заголовок' },
    {
      name: 'items',
      type: 'array',
      label: 'Вопросы и ответы',
      fields: [
        { name: 'question', type: 'text', label: 'Вопрос', required: true },
        { name: 'answer', type: 'richText', label: 'Ответ' },
      ],
    },
  ],
}

export const LatestNewsBlock: Block = {
  slug: 'latestNews',
  interfaceName: 'LatestNewsBlock',
  labels: { singular: 'Последние новости', plural: 'Блоки последних новостей' },
  fields: [
    eyebrowField,
    { name: 'heading', type: 'text', label: 'Заголовок', defaultValue: 'Последние новости' },
    { name: 'count', type: 'number', label: 'Сколько новостей', defaultValue: 3, admin: { description: 'По умолчанию 3.' } },
  ],
}

export const StatisticsBlock: Block = {
  slug: 'statistics',
  interfaceName: 'StatisticsBlock',
  labels: { singular: 'Статистика / цифры', plural: 'Блоки статистики' },
  fields: [
    eyebrowField,
    { name: 'heading', type: 'text', label: 'Заголовок' },
    {
      name: 'stats',
      type: 'array',
      label: 'Показатели',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', label: 'Значение', required: true, admin: { width: '33%' } },
            { name: 'suffix', type: 'text', label: 'Суффикс', admin: { width: '33%' } },
            { name: 'label', type: 'text', label: 'Подпись', required: true, admin: { width: '34%' } },
          ],
        },
      ],
    },
  ],
}

export const EducationProgramBlock: Block = {
  slug: 'educationProgram',
  interfaceName: 'EducationProgramBlock',
  labels: { singular: 'Образовательная программа', plural: 'Образовательные программы' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Надзаголовок', defaultValue: 'О клубе' },
    { name: 'heading', type: 'text', label: 'Заголовок', defaultValue: 'Образовательная деятельность' },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Вводный текст',
      admin: { description: 'Короткое описание под заголовком.' },
    },
    {
      name: 'programFile',
      type: 'relationship',
      relationTo: 'documents',
      label: 'Файл программы (PDF)',
      admin: {
        description:
          'Документ для кнопки «Скачать программу». Загрузите PDF в разделе «Документы» и выберите здесь. Если не задан — используется файл по умолчанию.',
      },
    },
    {
      name: 'showProgramDetails',
      type: 'checkbox',
      label: 'Показывать полную программу (таблицы и разделы)',
      defaultValue: true,
    },
    {
      name: 'meta',
      type: 'array',
      label: 'Реквизиты документа',
      admin: { description: 'Карточки под кнопкой скачивания (организация, кем принято и т. п.).' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'k', type: 'text', label: 'Поле', admin: { width: '40%' } },
            { name: 'v', type: 'text', label: 'Значение', admin: { width: '60%' } },
          ],
        },
      ],
    },
  ],
}

export const ForumChallengeBlock: Block = {
  slug: 'forumChallenge',
  interfaceName: 'ForumChallengeBlock',
  labels: { singular: 'Форум «Вызов Локомотива»', plural: 'Форум «Вызов Локомотива»' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Надзаголовок', defaultValue: 'ПМЭФ · Кавказский инвестиционный форум' },
    { name: 'heading', type: 'text', label: 'Заголовок', defaultValue: 'Вызов Локомотива' },
    { name: 'intro', type: 'textarea', label: 'Вводный текст' },
    {
      name: 'showSlides',
      type: 'checkbox',
      label: 'Показывать презентацию (слайды)',
      defaultValue: true,
    },
  ],
}

export const GymMapBlock: Block = {
  slug: 'gymMap',
  interfaceName: 'GymMapBlock',
  labels: { singular: 'Карта залов', plural: 'Карты залов' },
  fields: [
    eyebrowField,
    { name: 'heading', type: 'text', label: 'Заголовок', defaultValue: 'Где мы тренируем' },
    { name: 'subheading', type: 'text', label: 'Подзаголовок' },
    { name: 'showAllLink', type: 'checkbox', label: 'Показывать кнопку «Все залы»', defaultValue: true },
  ],
}

/** Все блоки конструктора страниц. */
export const pageBlocks: Block[] = [
  HeroSliderBlock,
  MissionBlock,
  StatisticsBlock,
  LatestNewsBlock,
  CallToActionBlock,
  TimelineBlock,
  RulesListBlock,
  TeamGridBlock,
  ScheduleTableBlock,
  PartnersStripBlock,
  GalleryBlock,
  VideoEmbedBlock,
  FAQAccordionBlock,
  ContactFormBlock,
  EducationProgramBlock,
  ForumChallengeBlock,
  GymMapBlock,
  RichTextBlock,
]
