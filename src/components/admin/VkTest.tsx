'use client'

import React, { useState } from 'react'

type Result = {
  ok?: boolean
  error?: string
  group?: { name?: string } | null
  callbackUrl?: string | null
  secret?: string
  hint?: string
}

const box: React.CSSProperties = {
  marginTop: 8,
  padding: '8px 10px',
  background: '#f5f5f5',
  borderRadius: 6,
  fontFamily: 'monospace',
  fontSize: 12,
  wordBreak: 'break-all',
}

export const VkTest: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState<Result | null>(null)

  const run = async () => {
    setLoading(true)
    setRes(null)
    try {
      const r = await fetch('/api/integrations/vk/test', { method: 'POST' })
      setRes(await r.json())
    } catch (e) {
      setRes({ error: e instanceof Error ? e.message : 'Ошибка' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ margin: '0.5rem 0 1.5rem', maxWidth: 620 }}>
      <button
        type="button"
        onClick={run}
        disabled={loading}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: 6,
          border: '1px solid #1f7a4d',
          background: loading ? '#ccc' : '#1f7a4d',
          color: '#fff',
          fontWeight: 600,
          cursor: loading ? 'default' : 'pointer',
        }}
      >
        {loading ? 'Проверяем…' : 'Проверить токен и показать параметры'}
      </button>

      {res && (
        <div style={{ marginTop: 10, fontSize: 13 }}>
          {res.error && <p style={{ color: '#c1121f' }}>{res.error}</p>}
          {res.ok && res.group && (
            <p style={{ color: '#1f7a4d' }}>Сообщество подключено: {res.group.name}</p>
          )}
          {res.callbackUrl && (
            <>
              <p style={{ marginTop: 8, color: '#555' }}>Callback URL для ВК:</p>
              <div style={box}>{res.callbackUrl}</div>
            </>
          )}
          {res.secret && (
            <>
              <p style={{ marginTop: 8, color: '#555' }}>Secret для ВК:</p>
              <div style={box}>{res.secret}</div>
            </>
          )}
          {res.hint && <p style={{ marginTop: 8, color: '#888' }}>{res.hint}</p>}
        </div>
      )}
    </div>
  )
}

export default VkTest
