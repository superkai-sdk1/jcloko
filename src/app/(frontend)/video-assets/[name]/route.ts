import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import { Readable } from 'stream'
import path from 'path'

export const dynamic = 'force-dynamic'

const VIDEO_DIR = path.resolve(process.cwd(), 'media/videos')

const typeFor = (ext: string): string =>
  ext === '.webm' ? 'video/webm' : ext === '.webp' ? 'image/webp' : ext === '.mp4' ? 'video/mp4' : 'application/octet-stream'

export async function GET(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const safe = path.basename(decodeURIComponent(name)) // защита от path traversal
  const filePath = path.join(VIDEO_DIR, safe)

  let size: number
  try {
    size = (await stat(filePath)).size
  } catch {
    return new Response('Not found', { status: 404 })
  }

  const type = typeFor(path.extname(safe).toLowerCase())
  const range = req.headers.get('range')

  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range)
    const start = m && m[1] ? parseInt(m[1], 10) : 0
    const end = m && m[2] ? parseInt(m[2], 10) : size - 1
    const chunk = createReadStream(filePath, { start, end })
    return new Response(Readable.toWeb(chunk) as ReadableStream, {
      status: 206,
      headers: {
        'Content-Type': type,
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(end - start + 1),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }

  const stream = createReadStream(filePath)
  return new Response(Readable.toWeb(stream) as ReadableStream, {
    headers: {
      'Content-Type': type,
      'Content-Length': String(size),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
