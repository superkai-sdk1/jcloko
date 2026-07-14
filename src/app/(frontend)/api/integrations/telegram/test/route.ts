import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getIntegrationSettings } from '@/lib/integrationSettings'
import { telegramWebhookSecret } from '@/integrations/telegram/secret'
import { TelegramClient } from '@/integrations/telegram/client'

export const dynamic = 'force-dynamic'

/**
 * Проверка подключения Telegram и (пере)установка вебхука. Только для админа.
 * Вызывается кнопкой на экране настроек интеграций.
 */
export async function POST(req: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || (user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Доступ только для администратора' }, { status: 403 })
  }

  const settings = await getIntegrationSettings()
  const tg = settings.telegram
  if (!tg?.botToken) {
    return NextResponse.json({ error: 'Не указан Bot Token в настройках' }, { status: 400 })
  }

  const client = new TelegramClient(tg.botToken)
  try {
    const me = await client.getMe()

    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || ''
    let webhook: { url: string; pending_update_count: number; last_error_message?: string } | null =
      null
    if (serverURL) {
      const hookUrl = `${serverURL.replace(/\/$/, '')}/api/webhooks/telegram`
      await client.setWebhook(hookUrl, telegramWebhookSecret())
      webhook = await client.getWebhookInfo()
    }

    return NextResponse.json({
      ok: true,
      bot: { id: me.id, username: me.username, name: me.first_name },
      webhook,
      note: serverURL
        ? undefined
        : 'NEXT_PUBLIC_SERVER_URL не задан — вебхук не установлен, только проверка токена.',
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Ошибка Telegram API' },
      { status: 502 },
    )
  }
}
