import sharp from 'sharp'

/**
 * Перцептивный хэш изображения (dHash, 64 бита). Устойчив к ресайзу/сжатию —
 * усиливающий сигнал для дедупликации: одинаковая картинка в TG и ВК.
 */
export async function dHash(buffer: Buffer): Promise<bigint | null> {
  try {
    // 9x8 в градациях серого; сравниваем соседние пиксели по строкам → 8x8 бит.
    const px = await sharp(buffer).greyscale().resize(9, 8, { fit: 'fill' }).raw().toBuffer()
    let hash = 0n
    let bit = 0n
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const left = px[row * 9 + col]
        const right = px[row * 9 + col + 1]
        if (left < right) hash |= 1n << bit
        bit++
      }
    }
    return hash
  } catch {
    return null
  }
}

/** Расстояние Хэмминга между двумя 64-битными хэшами (0..64). */
export function hamming(a: bigint, b: bigint): number {
  let x = a ^ b
  let count = 0
  while (x > 0n) {
    count += Number(x & 1n)
    x >>= 1n
  }
  return count
}

/** Похожи ли изображения (порог по умолчанию — 10 бит различий из 64). */
export function imagesSimilar(a: bigint | null, b: bigint | null, threshold = 10): boolean {
  if (a === null || b === null) return false
  return hamming(a, b) <= threshold
}
