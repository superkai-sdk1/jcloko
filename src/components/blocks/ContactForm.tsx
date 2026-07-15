'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

type State = 'idle' | 'sending' | 'ok' | 'error'

export function ContactForm({
  consentText,
  className,
  submitLabel = 'Отправить заявку',
}: {
  consentText?: string | null
  className?: string
  submitLabel?: string
}) {
  const [state, setState] = useState<State>('idle')
  const [error, setError] = useState('')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get('name') || ''),
      contact: String(data.get('contact') || ''),
      message: String(data.get('message') || ''),
      consent: data.get('consent') === 'on',
      sourcePage: typeof window !== 'undefined' ? window.location.pathname : '',
    }
    if (!payload.consent) {
      setError('Отметьте согласие на обработку персональных данных')
      setState('error')
      return
    }
    setState('sending')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Ошибка отправки')
      setState('ok')
      form.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки')
      setState('error')
    }
  }

  if (state === 'ok') {
    return (
      <div
        className={`rounded-xl border border-primary/40 bg-primary/10 p-8 text-center ${className ?? ''}`}
        role="status"
        aria-live="polite"
      >
        <p className="font-display text-2xl font-semibold uppercase text-paper">Заявка отправлена!</p>
        <p className="mt-2 text-muted">Мы свяжемся с вами в ближайшее время.</p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="mt-5 text-sm font-medium text-primary-400 hover:text-primary"
        >
          Отправить ещё одну
        </button>
      </div>
    )
  }

  const inputCls =
    'w-full rounded-lg border border-line bg-ink px-4 py-3 text-paper placeholder:text-muted/70 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/40'

  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className ?? ''}`} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-sm font-medium text-paper">
            Имя <span className="text-accent">*</span>
          </label>
          <input id="cf-name" name="name" required autoComplete="name" className={inputCls} placeholder="Как к вам обращаться" />
        </div>
        <div>
          <label htmlFor="cf-contact" className="mb-1.5 block text-sm font-medium text-paper">
            Телефон или email <span className="text-accent">*</span>
          </label>
          <input id="cf-contact" name="contact" required inputMode="tel" autoComplete="tel" className={inputCls} placeholder="+7 900 000-00-00" />
        </div>
      </div>
      <div>
        <label htmlFor="cf-message" className="mb-1.5 block text-sm font-medium text-paper">
          Сообщение
        </label>
        <textarea id="cf-message" name="message" rows={4} className={inputCls} placeholder="Возраст ребёнка, удобное время, вопрос…" />
      </div>

      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-primary)]" />
        <span>
          {consentText ||
            'Я даю согласие на обработку персональных данных в соответствии с '}
          <Link href="/politika" className="text-primary-400 underline hover:text-primary">
            политикой конфиденциальности
          </Link>
          .
        </span>
      </label>

      {state === 'error' && (
        <p className="text-sm text-accent" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" variant="accent" size="lg" disabled={state === 'sending'} className="w-full sm:w-auto">
        {state === 'sending' ? 'Отправляем…' : submitLabel}
      </Button>
    </form>
  )
}
