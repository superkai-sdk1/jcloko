import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getIntegrationSettings, type IntegrationSettingsShape } from '@/lib/integrationSettings'
import { telegramWebhookSecret } from '@/integrations/telegram/secret'
import { ingestTelegramUpdate } from '@/integrations/telegram/webhook'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const settings = await getIntegrationSettings().catch(
    (): IntegrationSettingsShape => ({}),
  )
  const tg = settings.telegram

  // Pluggable-слой: пока интеграция выключена — тихо подтверждаем и ничего не делаем.
  if (!tg?.enabled || !tg.botToken) {
    return NextResponse.json({ ok: true })
  }

  // Проверка секрета вебхука (Telegram присылает его в заголовке).
  const provided = req.headers.get('x-telegram-bot-api-secret-token')
  if (provided !== telegramWebhookSecret()) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  let update: unknown
  try {
    update = await req.json()
  } catch {
    return NextResponse.json({ ok: true })
  }

  try {
    const payload = await getPayloadClient()
    await ingestTelegramUpdate(payload, update as never, tg.botToken)
  } catch (err) {
    // Подтверждаем приём, чтобы Telegram не зациклил повторы; ошибку логируем.
    console.error('[telegram webhook] ingest error:', err)
  }

  return NextResponse.json({ ok: true })
}
