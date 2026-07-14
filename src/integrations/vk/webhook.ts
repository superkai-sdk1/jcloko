import type { Payload } from 'payload'
import { textToLexical } from '../lexical'

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

const firstLine = (t: string, max = 120): string => {
  const line = (t || '').split('\n')[0].trim()
  return line.length > max ? `${line.slice(0, max - 1)}…` : line || 'Новость из ВКонтакте'
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

async function importPhoto(payload: Payload, url: string | null, alt: string): Promise<number | null> {
  if (!url) return null
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    const name = url.split('/').pop()?.split('?')[0] || 'vk-photo.jpg'
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      file: { data: buf, name, mimetype: 'image/jpeg', size: buf.length },
      overrideAccess: true,
    })
    return doc.id as number
  } catch {
    return null
  }
}

/** Импортирует пост со стены ВК. Идемпотентно по externalId. */
export async function ingestVkWallPost(
  payload: Payload,
  post: VkWallPost,
  groupId: string,
): Promise<{ status: 'created' | 'duplicate' | 'ignored' }> {
  const ownerId = post.owner_id ?? -Math.abs(Number(groupId))
  const externalId = `${ownerId}_${post.id}`
  const bodyText = (post.text || '').trim()
  if (!bodyText && !bestPhotoUrl(post.attachments)) return { status: 'ignored' }

  const existing = await payload.find({
    collection: 'news',
    where: {
      and: [
        { 'sources.platform': { equals: 'vk' } },
        { 'sources.externalId': { equals: externalId } },
      ],
    },
    limit: 1,
    overrideAccess: true,
    depth: 0,
  })
  if (existing.totalDocs > 0) return { status: 'duplicate' }

  const url = `https://vk.com/wall${externalId}`
  const publishedAt = new Date((post.date || 0) * 1000).toISOString()
  const title = firstLine(bodyText)
  const heroImage = await importPhoto(payload, bestPhotoUrl(post.attachments), title)

  const news = await payload.create({
    collection: 'news',
    overrideAccess: true,
    data: {
      title,
      status: 'published',
      originPlatform: 'vk',
      publishedAt,
      excerpt: bodyText.slice(0, 240),
      content: textToLexical(bodyText) as never,
      ...(heroImage ? { heroImage } : {}),
      sources: [{ platform: 'vk', externalId, url, rawPayload: post as never }],
    },
  })

  try {
    await payload.create({
      collection: 'social-post-queue',
      overrideAccess: true,
      data: {
        platform: 'vk',
        externalId,
        receivedAt: publishedAt,
        rawText: bodyText,
        url,
        rawPayload: post as never,
        status: 'processed',
        linkedNewsPost: news.id,
      },
    })
  } catch {
    // уникальный индекс при гонке — не критично
  }

  return { status: 'created' }
}
