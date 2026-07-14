import type { Payload } from 'payload'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { access } from 'fs/promises'

const dirname = path.dirname(fileURLToPath(import.meta.url))
// /app/src/integrations/video → /app/media/videos
const VIDEO_DIR = path.resolve(dirname, '../../../media/videos')

const run = (cmd: string, args: string[], onLine?: (line: string) => void): Promise<void> =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args)
    let stderr = ''
    p.stderr.on('data', (d) => {
      stderr += d.toString()
    })
    if (onLine) {
      p.stdout.on('data', (d) => d.toString().split('\n').forEach((l: string) => onLine(l.trim())))
    }
    p.on('error', reject)
    p.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}: ${stderr.slice(-500)}`)),
    )
  })

async function ffprobeDuration(input: string): Promise<number> {
  return new Promise((resolve) => {
    const p = spawn('ffprobe', [
      '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', input,
    ])
    let out = ''
    p.stdout.on('data', (d) => (out += d.toString()))
    p.on('close', () => resolve(parseFloat(out.trim()) || 0))
    p.on('error', () => resolve(0))
  })
}

/**
 * Транскодирует загруженное видео в WebM (VP9, без звука — для hero) и снимает
 * постер-кадр. Обновляет прогресс в документе. Настроено под слабый VPS.
 */
export async function transcodeVideo(payload: Payload, videoId: string): Promise<void> {
  const video = await payload.findByID({ collection: 'videos', id: videoId, depth: 0, overrideAccess: true })
  if (!video || typeof video.filename !== 'string') return

  const input = path.join(VIDEO_DIR, video.filename)
  try {
    await access(input)
  } catch {
    await payload.update({ collection: 'videos', id: videoId, overrideAccess: true, data: { status: 'failed', errorText: 'Исходный файл не найден' } })
    return
  }

  // Имя вывода по ID документа — гарантированно отличается от входного файла
  // (иначе, если загрузили уже .webm, вход == выход и ffmpeg падает).
  const webmName = `hero-${videoId}.webm`
  const posterName = `hero-${videoId}-poster.webp`
  const webmPath = path.join(VIDEO_DIR, webmName)
  const posterPath = path.join(VIDEO_DIR, posterName)

  const duration = await ffprobeDuration(input)
  const trim = typeof video.trimSeconds === 'number' && video.trimSeconds > 0 ? video.trimSeconds : 0
  const effDuration = trim > 0 ? Math.min(trim, duration || trim) : duration

  await payload.update({
    collection: 'videos',
    id: videoId,
    overrideAccess: true,
    data: { status: 'processing', progress: 0, durationSeconds: Math.round(effDuration) },
  })

  const args = [
    '-y',
    '-i', input,
    ...(trim > 0 ? ['-t', String(trim)] : []),
    '-map', '0:v:0', // только первый видеопоток (игнорируем аудио/данные)
    '-vf', "scale='min(1280,iw)':-2",
    '-c:v', 'libvpx-vp9',
    '-b:v', '1200k',
    '-deadline', 'realtime',
    '-cpu-used', '6',
    '-row-mt', '1',
    '-an', // без звука — hero-видео проигрывается muted
    '-progress', 'pipe:1',
    '-nostats',
    webmPath,
  ]

  let lastReported = 0
  try {
    await run('ffmpeg', args, (line) => {
      const m = line.match(/^out_time_us=(\d+)/)
      if (m && effDuration > 0) {
        const sec = parseInt(m[1], 10) / 1_000_000
        const pct = Math.min(99, Math.round((sec / effDuration) * 100))
        if (pct >= lastReported + 3) {
          lastReported = pct
          payload
            .update({ collection: 'videos', id: videoId, overrideAccess: true, data: { progress: pct } })
            .catch(() => {})
        }
      }
    })

    // Постер-кадр (1-я секунда)
    await run('ffmpeg', [
      '-y', '-ss', '1', '-i', input, '-map', '0:v:0', '-frames:v', '1',
      '-vf', "scale='min(1280,iw)':-2", posterPath,
    ]).catch(() => {})

    await payload.update({
      collection: 'videos',
      id: videoId,
      overrideAccess: true,
      data: { status: 'ready', progress: 100, webmFilename: webmName, posterFilename: posterName, errorText: '' },
    })
  } catch (err) {
    await payload.update({
      collection: 'videos',
      id: videoId,
      overrideAccess: true,
      data: { status: 'failed', errorText: err instanceof Error ? err.message.slice(0, 800) : 'Ошибка транскода' },
    })
    throw err
  }
}
