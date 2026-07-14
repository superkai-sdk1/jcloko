import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

async function requireAdmin(req: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || (user as { role?: string }).role !== 'admin') return null
  return payload
}

/** Список новостей, помеченных как возможные дубликаты. */
export async function GET(req: Request) {
  const payload = await requireAdmin(req)
  if (!payload) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const res = await payload.find({
    collection: 'news',
    where: { needsReviewDuplicate: { equals: true } },
    depth: 1,
    limit: 100,
    overrideAccess: true,
  })
  return NextResponse.json({ docs: res.docs, total: res.totalDocs })
}

/** Действия ручного разбора: merge (слить) или reject (оставить отдельной). */
export async function POST(req: Request) {
  const payload = await requireAdmin(req)
  if (!payload) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const body = (await req.json().catch(() => ({}))) as {
    action?: string
    id?: number | string
    targetId?: number | string
  }
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 422 })

  const source = await payload.findByID({ collection: 'news', id: body.id, depth: 0, overrideAccess: true })
  if (!source) return NextResponse.json({ error: 'not found' }, { status: 404 })

  if (body.action === 'reject') {
    await payload.update({
      collection: 'news',
      id: body.id,
      overrideAccess: true,
      data: { needsReviewDuplicate: false, duplicateOf: null } as never,
    })
    return NextResponse.json({ ok: true, action: 'reject' })
  }

  if (body.action === 'merge') {
    const targetId = body.targetId ?? (source.duplicateOf as number | string | undefined)
    if (!targetId) return NextResponse.json({ error: 'targetId required' }, { status: 422 })

    const target = await payload.findByID({ collection: 'news', id: targetId, depth: 0, overrideAccess: true })
    if (!target) return NextResponse.json({ error: 'target not found' }, { status: 404 })

    type Src = { platform: string; externalId: string; url?: string }
    const tSources = (Array.isArray(target.sources) ? target.sources : []) as Src[]
    const sSources = (Array.isArray(source.sources) ? source.sources : []) as Src[]
    const tMerged = (Array.isArray(target.mergedFrom) ? target.mergedFrom : []) as Array<{
      platform: string
      externalId: string
    }>

    await payload.update({
      collection: 'news',
      id: targetId,
      overrideAccess: true,
      data: {
        sources: [...tSources, ...sSources] as never,
        mergedFrom: [
          ...tMerged,
          ...sSources.map((s) => ({ platform: s.platform, externalId: s.externalId })),
        ] as never,
      },
    })
    await payload.delete({ collection: 'news', id: body.id, overrideAccess: true })
    return NextResponse.json({ ok: true, action: 'merge', targetId })
  }

  return NextResponse.json({ error: 'unknown action' }, { status: 422 })
}
