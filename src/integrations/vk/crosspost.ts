import type { Payload } from 'payload'
import { VkClient } from './client'
import type { VkSettings } from '@/lib/integrationSettings'

const strip = (t: string) => t.replace(/<[^>]+>/g, '')

type Target = {
  platform: string
  status?: string
  remoteUrl?: string | null
  error?: string | null
  attempts?: number | null
  lastAttemptAt?: string | null
}

const upsertTarget = (targets: Target[], next: Target): Target[] => [
  ...targets.filter((t) => t.platform !== next.platform),
  next,
]

function buildMessage(post: Record<string, unknown>, serverURL: string): string {
  const title = typeof post.title === 'string' ? post.title : ''
  const excerpt = typeof post.excerpt === 'string' ? post.excerpt : ''
  const slug = typeof post.slug === 'string' ? post.slug : ''
  const link = slug ? `${serverURL.replace(/\/$/, '')}/novosti/${slug}` : serverURL
  return [title, strip(excerpt), link].filter(Boolean).join('\n\n').trim()
}

/**
 * Публикует новость на стене сообщества ВК и обновляет crosspostTargets.
 * Бросает исключение при ошибке — Payload Jobs Queue выполнит ретрай.
 */
export async function crosspostVk(payload: Payload, postId: number | string): Promise<void> {
  const settings = await payload.findGlobal({
    slug: 'integration-settings',
    overrideAccess: true,
    depth: 0,
  })
  const vk = (settings as { vk?: VkSettings })?.vk

  const post = await payload.findByID({ collection: 'news', id: postId, depth: 0, overrideAccess: true })
  if (!post) return

  const targets = (Array.isArray(post.crosspostTargets) ? post.crosspostTargets : []) as Target[]
  const attempts = (targets.find((t) => t.platform === 'vk')?.attempts ?? 0) + 1
  const now = new Date().toISOString()

  if (!vk?.enabled || !vk.crosspostOnPublish || !vk.accessToken || !vk.groupId) {
    await payload.update({
      collection: 'news',
      id: postId,
      overrideAccess: true,
      data: {
        crosspostTargets: upsertTarget(targets, {
          platform: 'vk',
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
  const client = new VkClient(vk.accessToken)

  try {
    const message = buildMessage(post as unknown as Record<string, unknown>, serverURL)
    const res = await client.wallPost(vk.groupId, message)
    await payload.update({
      collection: 'news',
      id: postId,
      overrideAccess: true,
      data: {
        crosspostTargets: upsertTarget(targets, {
          platform: 'vk',
          status: 'sent',
          remoteUrl: res?.post_id
            ? `https://vk.com/wall-${vk.groupId.replace(/^-/, '')}_${res.post_id}`
            : null,
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
          platform: 'vk',
          status: 'failed',
          attempts,
          lastAttemptAt: now,
          error: message,
        }) as never,
      },
    })
    throw err
  }
}
