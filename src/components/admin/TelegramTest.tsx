'use client'

import React, { useState } from 'react'

type State = 'idle' | 'loading' | 'ok' | 'err'

export const TelegramTest: React.FC = () => {
  const [state, setState] = useState<State>('idle')
  const [msg, setMsg] = useState('')

  const run = async () => {
    setState('loading')
    setMsg('')
    try {
      const res = await fetch('/api/integrations/telegram/test', { method: 'POST' })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Ошибка')
      const parts = [`Бот @${j.bot?.username ?? '—'} подключён.`]
      if (j.webhook) {
        parts.push(`Вебхук: ${j.webhook.url || '—'}.`)
        if (j.webhook.last_error_message) parts.push(`Последняя ошибка: ${j.webhook.last_error_message}`)
      }
      if (j.note) parts.push(j.note)
      setMsg(parts.join(' '))
      setState('ok')
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Ошибка')
      setState('err')
    }
  }

  const color = state === 'ok' ? '#1f7a4d' : state === 'err' ? '#c1121f' : '#666'

  return (
    <div style={{ margin: '0.5rem 0 1.5rem' }}>
      <button
        type="button"
        onClick={run}
        disabled={state === 'loading'}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: 6,
          border: '1px solid #1f7a4d',
          background: state === 'loading' ? '#ccc' : '#1f7a4d',
          color: '#fff',
          fontWeight: 600,
          cursor: state === 'loading' ? 'default' : 'pointer',
        }}
      >
        {state === 'loading' ? 'Проверяем…' : 'Проверить и подключить бота'}
      </button>
      {msg && (
        <p style={{ marginTop: '0.6rem', color, fontSize: 13, maxWidth: 560 }}>{msg}</p>
      )}
      <p style={{ marginTop: '0.4rem', color: '#888', fontSize: 12, maxWidth: 560 }}>
        Сохраните Bot Token и включите интеграцию перед проверкой. Кнопка проверит токен и установит
        вебхук на этот сайт.
      </p>
    </div>
  )
}

export default TelegramTest
