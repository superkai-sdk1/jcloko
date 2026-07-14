'use client'

import React, { useEffect, useState, useCallback } from 'react'

type NewsDoc = {
  id: number | string
  title?: string
  similarityScore?: number
  publishedAt?: string
  originPlatform?: string
  duplicateOf?: { id: number | string; title?: string } | number | string | null
}

const wrap: React.CSSProperties = { padding: '2rem', maxWidth: 900, margin: '0 auto' }
const card: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: 8,
  padding: '1rem 1.25rem',
  marginBottom: '1rem',
  background: '#fff',
}
const btn = (bg: string): React.CSSProperties => ({
  padding: '0.4rem 0.9rem',
  borderRadius: 6,
  border: 'none',
  background: bg,
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
  marginRight: 8,
})

export const DuplicatesView: React.FC = () => {
  const [docs, setDocs] = useState<NewsDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/integrations/duplicates', { credentials: 'include' })
      const j = await r.json()
      setDocs(Array.isArray(j.docs) ? j.docs : [])
    } catch {
      setDocs([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const act = async (id: number | string, action: 'merge' | 'reject') => {
    setBusy(id)
    try {
      await fetch('/api/integrations/duplicates', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id }),
      })
      await load()
    } finally {
      setBusy(null)
    }
  }

  const dupTitle = (d: NewsDoc): string => {
    const t = d.duplicateOf
    if (t && typeof t === 'object') return t.title || `#${t.id}`
    return t ? `#${t}` : '—'
  }

  return (
    <div style={wrap}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Возможные дубликаты</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Новости, которые дедупликатор счёл похожими на уже опубликованные. Слейте (объединит источники
        в одну новость) или оставьте отдельной.
      </p>

      {loading && <p>Загрузка…</p>}
      {!loading && docs.length === 0 && <p style={{ color: '#1f7a4d' }}>Дубликатов на проверку нет.</p>}

      {docs.map((d) => (
        <div key={String(d.id)} style={card}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{d.title}</div>
          <div style={{ color: '#666', fontSize: 13, margin: '6px 0' }}>
            Источник: {d.originPlatform || '—'} · Схожесть:{' '}
            {typeof d.similarityScore === 'number' ? Math.round(d.similarityScore * 100) + '%' : '—'} ·
            Похоже на: {dupTitle(d)}
          </div>
          <div style={{ marginTop: 10 }}>
            <button style={btn('#1f7a4d')} disabled={busy === d.id} onClick={() => act(d.id, 'merge')}>
              Слить с похожей
            </button>
            <button style={btn('#666')} disabled={busy === d.id} onClick={() => act(d.id, 'reject')}>
              Оставить отдельной
            </button>
            <a
              href={`/admin/collections/news/${d.id}`}
              style={{ marginLeft: 8, color: '#1f7a4d', fontSize: 13 }}
            >
              Открыть новость
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DuplicatesView
