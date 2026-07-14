/**
 * Нормализация текста поста для сравнения: убираем ссылки, эмодзи, разметку и
 * пунктуацию, приводим к нижнему регистру и схлопываем пробелы.
 */

// Ссылки (http/https, t.me, vk.com, @упоминания)
const URL_RE = /(https?:\/\/[^\s]+)|(\b(?:t\.me|vk\.com|vk\.ru|youtu\.be|rutube\.ru)\/[^\s]+)|(@[\w_]+)/gi
// Эмодзи и пиктограммы (основные unicode-диапазоны)
const EMOJI_RE =
  /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}]/gu

export function normalizeText(input: string): string {
  return (input || '')
    .toLowerCase()
    .replace(URL_RE, ' ')
    .replace(EMOJI_RE, ' ')
    .replace(/[#*_`~>|]/g, ' ') // markdown-символы
    .replace(/[^\p{L}\p{N}\s]/gu, ' ') // прочая пунктуация, оставляем буквы/цифры
    .replace(/\s+/g, ' ')
    .trim()
}

/** Множество значимых слов (для similarity). Короткие слова (<3) отбрасываем. */
export function tokenize(input: string): Set<string> {
  const norm = normalizeText(input)
  return new Set(norm.split(' ').filter((w) => w.length >= 3))
}
