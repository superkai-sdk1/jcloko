import { describe, it, expect } from 'vitest'
import { normalizeText, tokenize } from '../normalize'

describe('normalizeText', () => {
  it('убирает ссылки, эмодзи, разметку, пунктуацию и приводит к нижнему регистру', () => {
    const out = normalizeText('Победа! 🥇 Подробнее: https://t.me/club/123 #дзюдо')
    expect(out).toBe('победа подробнее дзюдо')
  })

  it('схлопывает пробелы и переносы строк', () => {
    expect(normalizeText('a\n\n  b   c')).toBe('a b c')
  })

  it('убирает @упоминания и vk-ссылки', () => {
    expect(normalizeText('Смотри @lokomotiv на vk.com/wall-1_2 сегодня')).toBe('смотри на сегодня')
  })
})

describe('tokenize', () => {
  it('отбрасывает короткие слова (<3 символов)', () => {
    const t = tokenize('он был на татами')
    expect(t.has('татами')).toBe(true)
    expect(t.has('был')).toBe(true)
    expect(t.has('на')).toBe(false)
    expect(t.has('он')).toBe(false)
  })
})
