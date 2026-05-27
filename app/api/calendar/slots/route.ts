import { NextResponse } from 'next/server'
import { computeAvailability } from '@/lib/ghl/calendar'

// No queremos cache: la disponibilidad cambia con cada cita creada.
export const dynamic = 'force-dynamic'

const YMD = /^\d{4}-\d{2}-\d{2}$/

export async function GET(req: Request) {
  const url = new URL(req.url)
  const startDate = url.searchParams.get('startDate') ?? ''
  const endDate = url.searchParams.get('endDate') ?? ''

  if (!YMD.test(startDate) || !YMD.test(endDate)) {
    return NextResponse.json(
      { ok: false, error: 'invalid_date_format' },
      { status: 400 },
    )
  }

  try {
    const slots = await computeAvailability(startDate, endDate)
    return NextResponse.json({ ok: true, slots })
  } catch (err) {
    console.error('[/api/calendar/slots] error:', err)
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'unknown' },
      { status: 502 },
    )
  }
}
