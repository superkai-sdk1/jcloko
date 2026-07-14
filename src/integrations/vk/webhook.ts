import type { Payload } from 'payload'
import { ingestSocialPost, type IngestResult } from '../ingest'

type VkPhotoSize = { url: string; width: number; height: number }
type VkAttachment = { type: string; photo?: { sizes?: VkPhotoSize[] } }
type VkWallPost = {
  id: number
  owner_id?: number
  from_id?: number
  date?: number
  text?: string
  attachments?: VkAttachment[]
}

function bestPhotoUrl(attachments: VkAttachment[] | undefined): string | null {
  if (!attachments) return null
  for (const a of attachments) {
    if (a.type === 'photo' && a.photo?.sizes?.length) {
      const best = a.photo.sizes.reduce((x, y) => (x.width * x.height >= y.width * y.height ? x : y))
      return best.url
    }
  }
  return null
}

async function downloadPhoto(url: string | null): Promise<{ buffer: Buffer; name: string } | null> {
  if (!url) return null
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    return { buffer, name: url.split('/').pop()?.split('?')[0] || 'vk-photo.jpg' }
  } catch {
    return null
  }
}

/** Обрабатывает пост со стены ВК через общий пайплайн приёма. */
export async function ingestVkWallPost(
  payload: Payload,
  post: VkWallPost,
  groupId: string,
): Promise<IngestResult> {
  const ownerId = post.owner_id ?? -Math.abs(Number(groupId))
  const externalId = `${ownerId}_${post.id}`
  const bodyText = (post.text || '').trim()
  const url = `https://vk.com/wall${externalId}`
  const publishedAt = new Date((post.date || 0) * 1000).toISOString()

  const photo = await downloadPhoto(bestPhotoUrl(post.attachments))

  return ingestSocialPost(payload, {
    platform: 'vk',
    externalId,
    url,
    text: bodyText,
    publishedAt,
    imageBuffer: photo?.buffer ?? null,
    imageName: photo?.name,
    rawPayload: post,
  })
}
