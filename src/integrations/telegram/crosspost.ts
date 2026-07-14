import type { Payload } from 'payload'
import { TelegramClient } from './client'
import type { TelegramSettings } from '@/lib/integrationSettings'
import { mediaUrl } from '@/lib/media'

const strip = (t: string) => t.replace(/<[^>]+>/g, '')

type Target = {
  platform: string
  status?: string
  remoteUrl?: string | null
  error?: string | null
  attempts?: number | null
  lastAttemptAt?: string | null
}

function upsertTarget(targets: Target[], next: Target): Target[] {
  const rest = targets.filter((t) => t.platform !== next.platform)
  return [...rest, next]
}

/** Собирает текст сообщения для Telegram из новости. */
function buildMessage(post: Record<string, unknown>, serverURL: string): string {
  const title = typeof post.title === 'string' ? post.title : ''
  const excerpt = typeof post.excerpt === 'string' ? post.excerpt : ''
  const slug = typeof post.slug === 'string' ? post.slug : ''
  const link = slug ? `${serverURL.replace(/\/$/, '')}/novosti/${slug}` : serverURL
  const parts = [title ? `<b>${title}</b>` : '', strip(excerpt)].filter(Boolean)
  return `${parts.join('\n\n')}\n\n${link}`.trim()
}

/**
 * Отправляет новость в Telegram-канал и обновляет crosspostTargets.
 * Бросает исключение при ошибке — Payload Jobs Queue выполнит ретрай.
 */
export async function crosspostTelegram(payload: Payload, postId: number | string): Promise<void> {
  const settings = await payload.findGlobal({
    slug: 'integration-settings',
    overrideAccess: true,
    depth: 0,
  })
  const tg = (settings as { telegram?: TelegramSettings })?.telegram

  const post = await payload.findByID({ collection: 'news', id: postId, depth: 1, overrideAccess: true })
  if (!post) return

  const targets = (Array.isArray(post.crosspostTargets) ? post.crosspostTargets : []) as Target[]
  const prev = targets.find((t) => t.platform === 'telegram')
  const attempts = (prev?.attempts ?? 0) + 1
  const now = new Date().toISOString()

  // Условия отправки; если не выполнены — помечаем skipped и выходим без ошибки.
  if (!tg?.enabled || !tg.crosspostOnPublish || !tg.botToken || !tg.channelId) {
    await payload.update({
      collection: 'news',
      id: postId,
      overrideAccess: true,
      data: {
        crosspostTargets: upsertTarget(targets, {
          platform: 'telegram',
          status: 'skipped',
          attempts,
          lastAttemptAt: now,
          error: 'Интеграция выключена или не настроена',
        }) as never,
      },
    })
    return
  }

  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const client = new TelegramClient(tg.botToken)

  try {
    const postRec = post as unknown as Record<string, unknown>
    const heroUrl = mediaUrl(postRec.heroImage)
    const absImg = heroUrl && serverURL ? `${serverURL.replace(/\/$/, '')}${heroUrl}` : null
    const message = buildMessage(postRec, serverURL)

    const sent = absImg
      ? await client.sendPhoto(tg.channelId, absImg, message.slice(0, 1024))
      : await client.sendMessage(tg.channelId, message)

    await payload.update({
      collection: 'news',
      id: postId,
      overrideAccess: true,
      data: {
        crosspostTargets: upsertTarget(targets, {
          platform: 'telegram',
          status: 'sent',
          remoteUrl: sent?.message_id ? String(sent.message_id) : null,
          attempts,
          lastAttemptAt: now,
          error: null,
        }) as never,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await payload.update({
      collection: 'news',
      id: postId,
      overrideAccess: true,
      data: {
        crosspostTargets: upsertTarget(targets, {
          platform: 'telegram',
          status: 'failed',
          attempts,
          lastAttemptAt: now,
          error: message,
        }) as never,
      },
    })
    throw err // отдаём ошибку в Jobs Queue для ретрая
  }
}
