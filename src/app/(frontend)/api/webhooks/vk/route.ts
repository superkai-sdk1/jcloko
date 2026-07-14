import { getPayloadClient } from '@/lib/payload'
import { getIntegrationSettings, type IntegrationSettingsShape } from '@/lib/integrationSettings'
import { vkCallbackSecret } from '@/integrations/vk/secret'
import { ingestVkWallPost } from '@/integrations/vk/webhook'

export const dynamic = 'force-dynamic'

const ok = () => new Response('ok', { status: 200, headers: { 'Content-Type': 'text/plain' } })

type VkCallback = {
  type?: string
  group_id?: number
  object?: unknown
  secret?: string
}

export async function POST(req: Request) {
  const settings = await getIntegrationSettings().catch((): IntegrationSettingsShape => ({}))
  const vk = settings.vk

  // Pluggable-слой: пока интеграция выключена — тихо отвечаем 'ok'.
  if (!vk?.enabled) return ok()

  let body: VkCallback
  try {
    body = (await req.json()) as VkCallback
  } catch {
    return ok()
  }

  // Подтверждение сервера (VK ожидает строку подтверждения из настроек сообщества).
  if (body.type === 'confirmation') {
    const token = vk.confirmationToken || ''
    return new Response(token, { status: 200, headers: { 'Content-Type': 'text/plain' } })
  }

  // Проверка секрета (если VK его присылает — сверяем с выводимым из PAYLOAD_SECRET).
  if (body.secret && body.secret !== vkCallbackSecret()) {
    return ok() // подтверждаем приём, но игнорируем чужой запрос
  }

  if (body.type === 'wall_post_new' && body.object) {
    try {
      const payload = await getPayloadClient()
      await ingestVkWallPost(payload, body.object as never, String(body.group_id ?? vk.groupId ?? ''))
    } catch (err) {
      console.error('[vk webhook] ingest error:', err)
    }
  }

  return ok()
}
