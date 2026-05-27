import { NextResponse } from 'next/server'
import { createAppointment } from '@/lib/ghl/calendar'

export const dynamic = 'force-dynamic'

interface BookBody {
  contactId?: string
  startISO?: string
  endISO?: string
  title?: string
}

const ISO_OFFSET = /T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/

export async function POST(req: Request) {
  let body: BookBody
  try {
    body = (await req.json()) as BookBody
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const { contactId, startISO, endISO, title } = body
  if (!contactId || !startISO || !endISO) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 })
  }
  if (!ISO_OFFSET.test(startISO) || !ISO_OFFSET.test(endISO)) {
    return NextResponse.json({ ok: false, error: 'invalid_iso' }, { status: 400 })
  }
  if (new Date(startISO).getTime() < Date.now()) {
    return NextResponse.json({ ok: false, error: 'slot_in_past' }, { status: 400 })
  }

  try {
    const appointmentId = await createAppointment({ contactId, startISO, endISO, title })
    return NextResponse.json({ ok: true, appointmentId })
  } catch (err) {
    console.error('[/api/calendar/book] error:', err)
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'unknown' },
      { status: 502 },
    )
  }
}
