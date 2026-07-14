import { createHash } from 'crypto'

/**
 * Секрет для проверки входящих Telegram-вебхуков. Выводится из PAYLOAD_SECRET,
 * поэтому не нужно хранить его в БД. Тот же секрет передаётся в setWebhook,
 * а Telegram присылает его обратно в заголовке X-Telegram-Bot-Api-Secret-Token.
 * (Разрешены только [A-Za-z0-9_-], 1–256 символов.)
 */
export const telegramWebhookSecret = (): string => {
  const base = process.env.PAYLOAD_SECRET || 'dev-secret'
  return createHash('sha256').update(`telegram-webhook:${base}`).digest('hex')
}
