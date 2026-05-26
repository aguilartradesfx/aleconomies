import { NextResponse } from 'next/server'
import { submitLeadToGHL } from '@/lib/ghl/client'
import type { FormState } from '@/components/CalificationForm/types'
import type { CalificationResult } from '@/lib/calificationLogic'

interface LeadBody {
  form?: FormState
  resultado?: CalificationResult
}

export async function POST(req: Request) {
  let body: LeadBody
  try {
    body = (await req.json()) as LeadBody
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  if (!body.form || !body.resultado) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 })
  }

  try {
    const ghl = await submitLeadToGHL(body.form, body.resultado)
    return NextResponse.json({ ok: true, contactId: ghl.contact?.id ?? null })
  } catch (err) {
    console.error('[/api/lead] GHL submit failed:', err)
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'unknown' },
      { status: 502 }
    )
  }
}
