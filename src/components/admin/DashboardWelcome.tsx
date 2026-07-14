import React from 'react'

const actions: { label: string; href: string; hint: string }[] = [
  { label: 'Написать новость', href: '/admin/collections/news/create', hint: 'Опубликовать анонс или результат' },
  { label: 'Страницы', href: '/admin/collections/pages', hint: 'Собрать страницу из блоков' },
  { label: 'Тренеры', href: '/admin/collections/coaches', hint: 'Профили и фото' },
  { label: 'Расписание', href: '/admin/collections/schedule-entries', hint: 'Занятия по группам' },
  { label: 'Медиа', href: '/admin/collections/media-galleries', hint: 'Фото, фильмы, интервью' },
  { label: 'Настройки сайта', href: '/admin/globals/site-settings', hint: 'Контакты, соцсети, партнёр' },
]

/** Приветственный баннер с быстрыми действиями над дашбордом. */
export function DashboardWelcome() {
  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          borderRadius: 14,
          padding: '22px 24px',
          background: 'linear-gradient(120deg, #0e1b14 0%, #14261c 60%, #1b3327 100%)',
          color: '#f2f5f1',
        }}
      >
        <div style={{ fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5fd69b' }}>
          Клуб дзюдо «Локомотив»
        </div>
        <h2 style={{ margin: '6px 0 4px', fontSize: 24, fontWeight: 800 }}>Панель управления сайтом</h2>
        <p style={{ margin: 0, opacity: 0.75, fontSize: 14 }}>
          Выберите раздел ниже или воспользуйтесь быстрыми действиями.
        </p>
      </div>

      <div
        style={{
          marginTop: 14,
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        }}
      >
        {actions.map((a) => (
          <a
            key={a.href}
            href={a.href}
            style={{
              display: 'block',
              padding: '14px 16px',
              borderRadius: 10,
              border: '1px solid var(--theme-elevation-150, #e2e2e2)',
              textDecoration: 'none',
              color: 'inherit',
              background: 'var(--theme-elevation-0, #fff)',
            }}
          >
            <div style={{ fontWeight: 700, color: '#1f7a4d' }}>{a.label}</div>
            <div style={{ fontSize: 12.5, opacity: 0.7, marginTop: 2 }}>{a.hint}</div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default DashboardWelcome
