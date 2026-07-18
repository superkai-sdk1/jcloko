'use client'

import React, { useState } from 'react'

function fmtSize(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return ''
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(1)} МБ`
  return `${Math.max(1, Math.round(bytes / 1024))} КБ`
}

const btn =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 font-display text-sm font-semibold uppercase tracking-wide transition-colors'

export function DocCard({
  title,
  description,
  url,
  filename,
  mimeType,
  filesize,
}: {
  title?: string | null
  description?: string | null
  url?: string | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
}) {
  const [open, setOpen] = useState(false)
  const name = title || filename || 'Документ'
  const ext = (filename?.split('.').pop() || 'файл').toUpperCase()
  const isPdf = (mimeType || '').includes('pdf') || (filename || '').toLowerCase().endsWith('.pdf')
  const size = fmtSize(filesize)

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex items-start gap-4 p-5">
        <span className="grid h-14 w-12 shrink-0 place-items-center rounded-lg border border-line bg-ink font-display text-[11px] font-bold text-primary-400">
          {ext.slice(0, 4)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold uppercase text-paper">{name}</h3>
          {description && <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>}
          <div className="mt-1 text-xs uppercase tracking-wide text-muted">
            {ext}
            {size ? ` · ${size}` : ''}
          </div>

          {url && (
            <div className="mt-4 flex flex-wrap gap-2.5">
              {isPdf && (
                <button type="button" onClick={() => setOpen((o) => !o)} className={`${btn} cursor-pointer bg-primary text-white hover:bg-primary-600`}>
                  {open ? 'Скрыть' : 'Предпросмотр'}
                </button>
              )}
              <a href={url} target="_blank" rel="noopener noreferrer" className={`${btn} border border-line text-paper hover:bg-surface-2`}>
                Открыть
              </a>
              <a href={url} download className={`${btn} bg-accent text-white hover:bg-accent-600`}>
                Скачать
              </a>
            </div>
          )}
        </div>
      </div>

      {isPdf && open && url && (
        <div className="border-t border-line bg-ink">
          <iframe src={`${url}#view=FitH`} title={`Предпросмотр: ${name}`} className="h-[70vh] w-full" />
        </div>
      )}
    </article>
  )
}
