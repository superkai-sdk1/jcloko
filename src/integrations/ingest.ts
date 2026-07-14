import type { Payload } from 'payload'
import { dHash } from './deduplication/phash'
import { decideDuplicate } from './deduplication/pipeline'
import { textToLexical } from './lexical'

export type SocialInput = {
  platform: 'telegram' | 'vk'
  externalId: string
  url?: string
  text: string
  publishedAt: string
  imageBuffer?: Buffer | null
  imageName?: string
  rawPayload: unknown
}

export type IngestResult = { status: 'created' | 'flagged' | 'merged' | 'duplicate' | 'ignored' }

const firstLine = (t: string, max = 120): string => {
  const line = (t || '').split('\n')[0].trim()
  return line.length > max ? `${line.slice(0, max - 1)}…` : line
}

type Source = { platform: string; externalId: string; url?: string; rawPayload?: unknown }
type Merged = { platform: string; externalId: string }

/**
 * Единая точка приёма поста из соцсети: идемпотентность → пайплайн
 * дедупликации → мерж в существующую новость / флаг на ручную проверку /
 * отдельная публикация. Плюс служебная запись в SocialPostQueue.
 */
export async function ingestSocialPost(payload: Payload, input: SocialInput): Promise<IngestResult> {
  const { platform, externalId, url, text, publishedAt, rawPayload } = input
  const bodyText = (text || '').trim()
  if (!bodyText && !input.imageBuffer) return { status: 'ignored' }

  // Идемпотентность по externalId (защита от повторной доставки вебхука).
  const existing = await payload.find({
    collection: 'news',
    where: {
      and: [{ 'sources.platform': { equals: platform } }, { 'sources.externalId': { equals: externalId } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existing.totalDocs > 0) return { status: 'duplicate' }

  const imageHash = input.imageBuffer ? await dHash(input.imageBuffer) : null
  const decision = await decideDuplicate(payload, { text: bodyText, publishedAt, imageHash })

  const title = firstLine(bodyText) || (platform === 'telegram' ? 'Новость из Telegram' : 'Новость из ВКонтакте')
  const newSource: Source = { platform, externalId, url, rawPayload }

  // ── Авто-мерж в существующую новость ────────────────────────────────────
  if (decision.action === 'merged') {
    const target = await payload.findByID({
      collection: 'news',
      id: decision.targetId,
      depth: 0,
      overrideAccess: true,
    })
    const sources = (Array.isArray(target.sources) ? target.sources : []) as Source[]
    const merged = (Array.isArray(target.mergedFrom) ? target.mergedFrom : []) as Merged[]
    await payload.update({
      collection: 'news',
      id: decision.targetId,
      overrideAccess: true,
      data: {
        sources: [...sources, newSource] as never,
        mergedFrom: [...merged, { platform, externalId }] as never,
      },
    })
    await createQueue(payload, input, 'merged', decision.targetId)
    return { status: 'merged' }
  }

  // ── Создание новой новости (отдельной или помеченной как возможный дубликат) ─
  let heroImage: number | null = null
  if (input.imageBuffer) {
    try {
      const doc = await payload.create({
        collection: 'media',
        data: { alt: title },
        file: {
          data: input.imageBuffer,
          name: input.imageName || `${platform}-${externalId}.jpg`,
          mimetype: 'image/jpeg',
          size: input.imageBuffer.length,
        },
        overrideAccess: true,
      })
      heroImage = doc.id as number
    } catch {
      heroImage = null
    }
  }

  const flagged = decision.action === 'flagged'
  const news = await payload.create({
    collection: 'news',
    overrideAccess: true,
    data: {
      title,
      status: 'published',
      originPlatform: platform,
      publishedAt,
      excerpt: bodyText.slice(0, 240),
      content: textToLexical(bodyText) as never,
      ...(heroImage ? { heroImage } : {}),
      ...(imageHash !== null ? { imageHash: imageHash.toString() } : {}),
      ...(flagged
        ? {
            needsReviewDuplicate: true,
            duplicateOf: Number(decision.targetId),
            similarityScore: decision.score,
          }
        : {}),
      sources: [newSource] as never,
    },
  })

  await createQueue(payload, input, 'processed', news.id)
  return { status: flagged ? 'flagged' : 'created' }
}

async function createQueue(
  payload: Payload,
  input: SocialInput,
  status: 'pending' | 'processed' | 'merged' | 'discarded',
  linkedNewsPost: number | string,
) {
  try {
    await payload.create({
      collection: 'social-post-queue',
      overrideAccess: true,
      data: {
        platform: input.platform,
        externalId: input.externalId,
        receivedAt: input.publishedAt,
        rawText: input.text,
        url: input.url,
        rawPayload: input.rawPayload as never,
        status,
        linkedNewsPost: Number(linkedNewsPost),
      },
    })
  } catch {
    // уникальный индекс при гонке — не критично
  }
}
