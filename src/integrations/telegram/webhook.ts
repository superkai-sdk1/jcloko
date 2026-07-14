import type { Payload } from 'payload'
import { TelegramClient } from './client'
import { ingestSocialPost, type IngestResult } from '../ingest'

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

/** Скачивает лучшую (по разрешению) картинку поста как Buffer. */
async function downloadPhoto(
  client: TelegramClient,
  photos: TgPhoto[] | undefined,
): Promise<{ buffer: Buffer; name: string } | null> {
  if (!photos || photos.length === 0) return null
  try {
    const best = photos.reduce((a, b) => (a.width * a.height >= b.width * b.height ? a : b))
    const file = await client.getFile(best.file_id)
    const res = await fetch(client.fileUrl(file.file_path))
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    return { buffer, name: file.file_path.split('/').pop() || `tg-${best.file_id}.jpg` }
  } catch {
    return null
  }
}

/** Обрабатывает входящий Telegram-update через общий пайплайн приёма. */
export async function ingestTelegramUpdate(
  payload: Payload,
  update: TgUpdate,
  botToken: string,
): Promise<IngestResult> {
  const msg = update.channel_post || update.edited_channel_post
  if (!msg) return { status: 'ignored' }

  const chatId = msg.chat?.id
  const externalId = `${chatId ?? 'ch'}_${msg.message_id}`
  const bodyText = (msg.text || msg.caption || '').trim()
  const url = msg.chat?.username ? `https://t.me/${msg.chat.username}/${msg.message_id}` : undefined
  const publishedAt = new Date((msg.date || 0) * 1000).toISOString()

  const client = new TelegramClient(botToken)
  const photo = await downloadPhoto(client, msg.photo)

  return ingestSocialPost(payload, {
    platform: 'telegram',
    externalId,
    url,
    text: bodyText,
    publishedAt,
    imageBuffer: photo?.buffer ?? null,
    imageName: photo?.name,
    rawPayload: msg,
  })
}
