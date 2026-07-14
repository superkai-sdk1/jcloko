import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor, publishedOrLoggedIn } from '../access'
import { slugField } from '../fields/slug'

export const MediaGallery: CollectionConfig = {
  slug: 'media-galleries',
  labels: { singular: 'Медиа-подборка', plural: 'Медиа (фото/фильмы/интервью)' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'status', 'publishedAt'],
    group: 'Контент',
  },
  access: {
    read: publishedOrLoggedIn,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', label: 'Название', required: true },
    slugField('title'),
    {
      type: 'row',
      fields: [
        {
          name: 'kind',
          type: 'select',
          label: 'Тип',
          required: true,
          defaultValue: 'photo',
          options: [
            { label: 'Фотогалерея', value: 'photo' },
            { label: 'Фильм', value: 'film' },
            { label: 'Интервью', value: 'interview' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'status',
          type: 'select',
          label: 'Статус',
          required: true,
          defaultValue: 'draft',
          options: [
            { label: 'Черновик', value: 'draft' },
            { label: 'Опубликовано', value: 'published' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'publishedAt', type: 'date', label: 'Дата', admin: { position: 'sidebar' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Обложка' },
    { name: 'description', type: 'richText', label: 'Описание' },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Фотографии',
      admin: {
        condition: (data) => data?.kind === 'photo',
        description: 'Для фотогалереи.',
      },
    },
    {
      name: 'videos',
      type: 'array',
      label: 'Видео (только embed)',
      admin: {
        condition: (data) => data?.kind === 'film' || data?.kind === 'interview',
        description: 'Видео не хостим у себя — только ссылки на YouTube / RuTube / VK Video.',
      },
      fields: [
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
        { name: 'title', type: 'text', label: 'Подпись' },
      ],
    },
  ],
}
