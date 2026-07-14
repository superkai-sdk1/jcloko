import type { Payload } from 'payload'
import { TelegramClient } from './client'
import { textToLexical } from '../lexical'

type TgPhoto = { file_id: string; width: number; height: number }
type TgMessage = {
  message_id: number
  date: number
  text?: string
  caption?: string
  photo?: TgPhoto[]
  chat?: { id: number; username?: string; title?: string }
}
type TgUpdate = {
  update_id?: number
  channel_post?: TgMessage
  edited_channel_post?: TgMessage
}

const firstLine = (t: string, max = 120): string => {
  const line = (t || '').split('\n')[0].trim()
  return line.length > max ? `${line.slice(0, max - 1)}…` : line || 'Новость из Telegram'
}

/** Импортирует лучшую (по разрешению) картинку поста в Media, возвращает id или null. */
async function importPhoto(
  payload: Payload,
  client: TelegramClient,
  photos: TgPhoto[] | undefined,
  alt: string,
): Promise<number | null> {
  if (!photos || photos.length === 0) return null
  try {
    const best = photos.reduce((a, b) => (a.width * a.height >= b.width * b.height ? a : b))
    const file = await client.getFile(best.file_id)
    const res = await fetch(client.fileUrl(file.file_path))
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    const name = file.file_path.split('/').pop() || `tg-${best.file_id}.jpg`
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

/**
 * Обрабатывает входящий Telegram-update. Идемпотентно по externalId.
 * Создаёт запись в SocialPostQueue и NewsPost (originPlatform=telegram).
 */
export async function ingestTelegramUpdate(
  payload: Payload,
  update: TgUpdate,
  botToken: string,
): Promise<{ status: 'created' | 'duplicate' | 'ignored' }> {
  const msg = update.channel_post || update.edited_channel_post
  if (!msg) return { status: 'ignored' }

  const chatId = msg.chat?.id
  const externalId = `${chatId ?? 'ch'}_${msg.message_id}`
  const bodyText = (msg.text || msg.caption || '').trim()
  if (!bodyText && !(msg.photo && msg.photo.length)) return { status: 'ignored' }

  // Идемпотентность: уже импортировали этот пост?
  const existing = await payload.find({
    collection: 'news',
    where: {
      and: [
        { 'sources.platform': { equals: 'telegram' } },
        { 'sources.externalId': { equals: externalId } },
      ],
    },
    limit: 1,
    overrideAccess: true,
    depth: 0,
  })
  if (existing.totalDocs > 0) return { status: 'duplicate' }

  const url = msg.chat?.username
    ? `https://t.me/${msg.chat.username}/${msg.message_id}`
    : undefined
  const publishedAt = new Date((msg.date || 0) * 1000).toISOString()
  const title = firstLine(bodyText)

  const client = new TelegramClient(botToken)
  const heroImage = await importPhoto(payload, client, msg.photo, title)

  const news = await payload.create({
    collection: 'news',
    overrideAccess: true,
    data: {
      title,
      status: 'published',
      originPlatform: 'telegram',
      publishedAt,
      excerpt: bodyText.slice(0, 240),
      content: textToLexical(bodyText) as never,
      ...(heroImage ? { heroImage } : {}),
      sources: [{ platform: 'telegram', externalId, url, rawPayload: msg as never }],
    },
  })

  // Служебная запись в очередь (для трассировки и будущего пайплайна дедупликации)
  try {
    await payload.create({
      collection: 'social-post-queue',
      overrideAccess: true,
      data: {
        platform: 'telegram',
        externalId,
        receivedAt: publishedAt,
        rawText: bodyText,
        url,
        rawPayload: msg as never,
        status: 'processed',
        linkedNewsPost: news.id,
      },
    })
  } catch {
    // уникальный индекс мог сработать при гонке — не критично
  }

  return { status: 'created' }
}
