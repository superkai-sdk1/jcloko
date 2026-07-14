import { createHash } from 'crypto'

/**
 * Секрет для проверки входящих запросов VK Callback API. Выводится из
 * PAYLOAD_SECRET (не хранится в БД). Тот же секрет пользователь указывает в
 * настройках сообщества ВК; VK присылает его в поле `secret` каждого запроса.
 */
export const vkCallbackSecret = (): string => {
  const base = process.env.PAYLOAD_SECRET || 'dev-secret'
  return createHash('sha256').update(`vk-callback:${base}`).digest('hex').slice(0, 40)
}
