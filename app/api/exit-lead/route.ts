import { NextResponse } from 'next/server'
import { submitExitLeadToGHL } from '@/lib/ghl/client'

interface ExitLeadBody {
  name?: string
  email?: string
  phone?: string
}

export async function POST(req: Request) {
  let body: ExitLeadBody
  try {
    body = (await req.json()) as ExitLeadBody
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const name  = body.name?.trim()
  const email = body.email?.trim()
  const phone = body.phone?.trim()

  if (!name || !email || !phone) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 })
  }

  try {
    const ghl = await submitExitLeadToGHL(name, email, phone)
    return NextResponse.json({ ok: true, contactId: ghl.contact?.id ?? null })
  } catch (err) {
    console.error('[/api/exit-lead] GHL submit failed:', err)
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'unknown' },
      { status: 502 }
    )
  }
}
