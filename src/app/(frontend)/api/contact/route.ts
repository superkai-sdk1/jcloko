import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const contact = typeof body.contact === 'string' ? body.contact.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const consent = body.consent === true
  const sourcePage = typeof body.sourcePage === 'string' ? body.sourcePage : ''

  // Серверная валидация (152-ФЗ: согласие обязательно, не предустановлено)
  if (!name || name.length < 2) {
    return NextResponse.json({ error: 'Укажите имя' }, { status: 422 })
  }
  if (!contact || contact.length < 5) {
    return NextResponse.json({ error: 'Укажите телефон или email' }, { status: 422 })
  }
  if (!consent) {
    return NextResponse.json(
      { error: 'Необходимо согласие на обработку персональных данных' },
      { status: 422 },
    )
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'form-submissions',
      data: { name, contact, message, consent, sourcePage },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Не удалось отправить заявку. Попробуйте позже.' }, { status: 500 })
  }
}
