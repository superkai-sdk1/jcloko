'use client'

import React, { useEffect, useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

type State = { status?: string; progress?: number; error?: string }

const labels: Record<string, string> = {
  pending: 'Ожидает конвертации',
  processing: 'Конвертируется в WebM…',
  ready: 'Готово',
  failed: 'Ошибка конвертации',
}

export const VideoProgress: React.FC = () => {
  const { id } = useDocumentInfo()
  const [s, setS] = useState<State>({})

  useEffect(() => {
    if (!id) return
    let stop = false
    const poll = async () => {
      try {
        const r = await fetch(`/api/videos/${id}?depth=0`, { credentials: 'include' })
        const j = await r.json()
        if (stop) return
        setS({ status: j.status, progress: j.progress, error: j.errorText })
        if (j.status !== 'ready' && j.status !== 'failed') setTimeout(poll, 2000)
      } catch {
        if (!stop) setTimeout(poll, 3000)
      }
    }
    poll()
    return () => {
      stop = true
    }
  }, [id])

  if (!id) {
    return (
      <p style={{ margin: '0.5rem 0', color: '#888', fontSize: 13 }}>
        Загрузите видео и сохраните — начнётся автоматическая конвертация в WebM.
      </p>
    )
  }

  const pct = typeof s.progress === 'number' ? s.progress : 0
  const done = s.status === 'ready'
  const failed = s.status === 'failed'
  const color = failed ? '#c1121f' : done ? '#1f7a4d' : '#1f7a4d'

  return (
    <div style={{ margin: '0.5rem 0 1.25rem', maxWidth: 520 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
        <span style={{ fontWeight: 600 }}>{labels[s.status || 'pending'] || 'Конвертация'}</span>
        {!done && !failed && <span style={{ color: '#666' }}>{pct}%</span>}
      </div>
      <div style={{ height: 8, borderRadius: 4, background: '#e5e5e5', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${done ? 100 : failed ? 100 : pct}%`,
            background: color,
            transition: 'width 0.4s ease',
          }}
        />
      </div>
      {failed && s.error && <p style={{ color: '#c1121f', fontSize: 12, marginTop: 6 }}>{s.error}</p>}
      {done && (
        <p style={{ color: '#1f7a4d', fontSize: 12, marginTop: 6 }}>
          Видео готово — можно добавлять в слайдер на главной.
        </p>
      )}
    </div>
  )
}

export default VideoProgress
