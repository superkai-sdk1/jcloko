import React from 'react'

const card: React.CSSProperties = {
  borderRadius: 12,
  border: '1px solid var(--theme-elevation-150, #e2e2e2)',
  background: 'var(--theme-elevation-0, #fff)',
  padding: '20px 22px',
}
const h2: React.CSSProperties = { margin: '0 0 12px', fontSize: 18, fontWeight: 800 }
const li: React.CSSProperties = { marginBottom: 8, lineHeight: 1.5 }

function List({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 18 }}>
      {items.map((t, i) => (
        <li key={i} style={li}>{t}</li>
      ))}
    </ul>
  )
}

/** Кастомная страница админки: /admin/support — поддержка и разработчик. */
export function SupportView() {
  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '32px 24px 64px' }}>
      <a href="/admin" style={{ fontSize: 13, opacity: 0.7, textDecoration: 'none' }}>← В админку</a>

      <div
        style={{
          marginTop: 12,
          borderRadius: 16,
          padding: '26px 28px',
          background: 'linear-gradient(120deg, #0e1b14 0%, #14261c 60%, #1b3327 100%)',
          color: '#f2f5f1',
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5fd69b' }}>
          LokoAdmin · Поддержка
        </div>
        <h1 style={{ margin: '8px 0 6px', fontSize: 26, fontWeight: 800 }}>Titan Development Team</h1>
        <p style={{ margin: 0, opacity: 0.8, fontSize: 14 }}>
          Разработка и сопровождение сайта клуба дзюдо «Локомотив».
        </p>
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginTop: 16 }}>
        <div style={card}>
          <h2 style={h2}>Контакты</h2>
          <p style={{ margin: '0 0 8px', lineHeight: 1.6 }}>
            Telegram:{' '}
            <a href="https://t.me/thiskai" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, color: '#1f7a4d' }}>
              @thiskai
            </a>
          </p>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            По любым вопросам работы сайта и админки пишите в Telegram — ответим и поможем.
          </p>
        </div>

        <div style={{ ...card, borderColor: 'rgba(31,122,77,0.4)', background: 'rgba(31,122,77,0.08)' }}>
          <h2 style={h2}>Базовая поддержка</h2>
          <p style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#1f7a4d' }}>до 31.12.2028</p>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            В этот период базовая поддержка сайта — бесплатно (см. список ниже).
          </p>
        </div>
      </div>

      <div style={{ ...card, marginTop: 16 }}>
        <h2 style={h2}>Что уже есть на сайте</h2>
        <List
          items={[
            'Редактируемые страницы из блоков + SEO у каждой страницы',
            'Новости с автопостингом в Telegram и ВКонтакте (с дедупликацией)',
            'Медиа-галереи: фото, фильмы, интервью',
            'Видео-фон на главной с конвертацией в WebM и адаптацией контраста',
            'Тренеры, спортсмены, расписание тренировок',
            'Партнёры и генеральный спонсор с маркировкой рекламы (erid, 38-ФЗ)',
            'Формы заявок с согласием на обработку ПДн (152-ФЗ)',
            'Светлая и тёмная тема (переключатель + авто)',
            'Раздел «Образовательная деятельность» + скачивание программы (PDF)',
            'Редактируемые навигация, подвал, заголовки страниц и тексты интерфейса',
            'Загрузка изображений с кадрированием (фокус-точка) и конвертацией в WebP',
            'Русифицированная админка LokoAdmin',
          ]}
        />
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: 16 }}>
        <div style={card}>
          <h2 style={{ ...h2, color: '#1f7a4d' }}>Бесплатно (в рамках поддержки)</h2>
          <List
            items={[
              'Устранение ошибок и сбоев в работе сайта',
              'Обновления безопасности',
              'Помощь и консультации по работе с админкой',
              'Помощь при проблемах с публикацией и загрузкой контента',
              'Мелкие правки по текущему функционалу',
            ]}
          />
        </div>

        <div style={card}>
          <h2 style={{ ...h2, color: '#c1121f' }}>Можно добавить (за отдельную плату)</h2>
          <List
            items={[
              'Онлайн-запись на тренировки: слоты в расписании, брони, напоминания',
              'Личные кабинеты спортсменов и родителей: прогресс, пояса, посещаемость',
              'Онлайн-оплата абонементов (эквайринг, чеки)',
              'Мобильное приложение (iOS / Android)',
              'Чат-бот в Telegram: запись, ответы на вопросы, уведомления',
              'Интеграция с CRM / 1С, автоматические отчёты и выгрузки',
              'Магазин экипировки и атрибутики',
              'Расширенная аналитика, цели, A/B-тесты',
              'E-mail и push-рассылки, автоматические анонсы',
              'Многоязычность сайта',
              'Индивидуальный дизайн разделов, анимации, доработки под задачи',
            ]}
          />
          <p style={{ margin: '12px 0 0', fontSize: 13, opacity: 0.75 }}>
            Обсудить доработки и стоимость — в Telegram{' '}
            <a href="https://t.me/thiskai" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, color: '#1f7a4d' }}>
              @thiskai
            </a>.
          </p>
        </div>
      </div>

      <p style={{ marginTop: 24, textAlign: 'center', fontSize: 13, opacity: 0.6 }}>
        © {new Date().getFullYear()} Titan Development Team
      </p>
    </div>
  )
}

export default SupportView
