import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-neutral-950 px-6 text-center text-neutral-100">
      <div className="flex flex-col items-center gap-3">
        <span className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1 text-sm font-medium tracking-wide text-red-300">
          Фаза 0 · инфраструктура
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Клуб дзюдо «Локомотив»
        </h1>
        <p className="max-w-md text-neutral-400">
          Каркас сайта развёрнут. Публичный дизайн появится в Фазе 2, модель
          данных — в Фазе 1.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 text-sm text-neutral-500">
        <p>
          {user ? (
            <>
              Вы вошли как <span className="text-neutral-200">{user.email}</span>
            </>
          ) : (
            'Панель управления доступна администраторам и редакторам.'
          )}
        </p>
        <a
          href={payloadConfig.routes.admin}
          className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-red-500"
        >
          Войти в админку →
        </a>
      </div>
    </div>
  )
}
