import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getIntegrationSettings } from '@/lib/integrationSettings'
import { vkCallbackSecret } from '@/integrations/vk/secret'
import { VkClient } from '@/integrations/vk/client'

export const dynamic = 'force-dynamic'

/**
 * Проверка токена ВК и выдача параметров для настройки Callback API.
 * Только для админа. VK-сообщество настраивается вручную в vk.com — этот
 * эндпоинт отдаёт callback URL и secret, которые нужно туда вписать.
 */
export async function POST(req: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || (user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Доступ только для администратора' }, { status: 403 })
  }

  const settings = await getIntegrationSettings()
  const vk = settings.vk
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const callbackUrl = serverURL ? `${serverURL.replace(/\/$/, '')}/api/webhooks/vk` : null
  const secret = vkCallbackSecret()

  if (!vk?.accessToken) {
    return NextResponse.json(
      { error: 'Не указан Access Token сообщества', callbackUrl, secret },
      { status: 400 },
    )
  }

  try {
    const client = new VkClient(vk.accessToken)
    const groups = await client.groupsGetById(vk.groupId || undefined)
    const group = groups?.[0]
    return NextResponse.json({
      ok: true,
      group: group ? { id: group.id, name: group.name, screen_name: group.screen_name } : null,
      callbackUrl,
      secret,
      hint: 'В настройках сообщества ВК → Работа с API → Callback API: укажите этот адрес и secret, тип события wall_post_new. Строку подтверждения из ВК вставьте в поле «Строка подтверждения» здесь.',
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Ошибка VK API', callbackUrl, secret },
      { status: 502 },
    )
  }
}
