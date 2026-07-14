import { describe, it, expect } from 'vitest'
import { jaccard, dice, textSimilarity } from '../similarity'

describe('jaccard / dice', () => {
  it('одинаковые множества → 1', () => {
    const A = new Set(['a', 'b', 'c'])
    expect(jaccard(A, A)).toBe(1)
    expect(dice(A, A)).toBe(1)
  })

  it('jaccard ≤ dice для частичного пересечения', () => {
    const A = new Set(['a', 'b', 'c'])
    const B = new Set(['b', 'c', 'd'])
    expect(jaccard(A, B)).toBeLessThanOrEqual(dice(A, B))
  })
})

describe('textSimilarity', () => {
  it('идентичные тексты → 1', () => {
    expect(textSimilarity('клуб дзюдо локомотив', 'клуб дзюдо локомотив')).toBe(1)
  })

  it('непересекающиеся тексты → 0', () => {
    expect(textSimilarity('кошка собака', 'самолёт поезд')).toBe(0)
  })

  it('кросс-пост (тот же смысл, разная обёртка) → выше порога ручной проверки', () => {
    const tg = 'Наши спортсмены завоевали восемь медалей на первенстве города'
    const vk = 'Спортсмены клуба завоевали восемь медалей на первенстве города 🥇 подробнее vk.com/wall'
    expect(textSimilarity(tg, vk)).toBeGreaterThan(0.6)
  })

  it('разные новости в одном окне → ниже порога мержа', () => {
    const a = 'Открыт набор в младшие группы по дзюдо с пяти лет'
    const b = 'Расписание тренировок на новый сезон опубликовано'
    expect(textSimilarity(a, b)).toBeLessThan(0.5)
  })
})
