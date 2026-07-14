import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '../access'

/** Заявки с контактной формы. Создание — публичное (форма), чтение — редакция. */
export const FormSubmission: CollectionConfig = {
  slug: 'form-submissions',
  labels: { singular: 'Заявка', plural: 'Заявки с форм' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'contact', 'sourcePage', 'createdAt'],
    group: 'Служебное',
  },
  access: {
    create: anyone,
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Имя', required: true },
    { name: 'contact', type: 'text', label: 'Телефон / email', required: true },
    { name: 'message', type: 'textarea', label: 'Сообщение' },
    {
      name: 'consent',
      type: 'checkbox',
      label: 'Согласие на обработку ПДн получено',
      required: true,
    },
    { name: 'sourcePage', type: 'text', label: 'Страница отправки' },
  ],
}
