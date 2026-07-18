import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor, adminEditorOrOwner } from '../access'

export const ScheduleEntry: CollectionConfig = {
  slug: 'schedule-entries',
  labels: { singular: 'Занятие', plural: 'Расписание' },
  admin: {
    useAsTitle: 'group',
    defaultColumns: ['group', 'dayOfWeek', 'startTime', 'coach', 'hall'],
    group: 'Клуб',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    // Тренер редактирует занятия своих групп (coach.user == он сам)
    update: adminEditorOrOwner('coach.user'),
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'group', type: 'text', label: 'Группа', required: true },
    {
      name: 'dayOfWeek',
      type: 'select',
      label: 'День недели',
      required: true,
      options: [
        { label: 'Понедельник', value: 'mon' },
        { label: 'Вторник', value: 'tue' },
        { label: 'Среда', value: 'wed' },
        { label: 'Четверг', value: 'thu' },
        { label: 'Пятница', value: 'fri' },
        { label: 'Суббота', value: 'sat' },
        { label: 'Воскресенье', value: 'sun' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'startTime', type: 'text', label: 'Начало (чч:мм)', required: true, admin: { width: '50%' } },
        { name: 'endTime', type: 'text', label: 'Окончание (чч:мм)', admin: { width: '50%' } },
      ],
    },
    {
      name: 'coach',
      type: 'relationship',
      relationTo: 'coaches',
      label: 'Тренер',
    },
    // Устаревшее свободное поле (скрыто) — оставлено, чтобы не менять тип колонки.
    { name: 'hall', type: 'text', label: 'Зал (устар.)', admin: { hidden: true } },
    { name: 'hallLink', type: 'relationship', relationTo: 'halls', label: 'Зал' },
    { name: 'ageGroup', type: 'text', label: 'Возраст' },
    {
      name: 'level',
      type: 'select',
      label: 'Уровень',
      options: [
        { label: 'Начинающие', value: 'beginner' },
        { label: 'Средний', value: 'intermediate' },
        { label: 'Продвинутый', value: 'advanced' },
        { label: 'Все уровни', value: 'all' },
      ],
    },
    { name: 'notes', type: 'text', label: 'Примечание' },
  ],
}
