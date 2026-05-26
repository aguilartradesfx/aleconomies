import { NextResponse } from 'next/server'
import { submitLeadMagnetToGHL } from '@/lib/ghl/client'
import { getLeadMagnetBySlug } from '@/lib/lead-magnets'

interface LeadCaptureBody {
  name?: string
  email?: string
  phone?: string
  slug?: string
}

// RFC-5322 simplificado, suficiente para validación client/server básica.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let body: LeadCaptureBody
  try {
    body = (await req.json()) as LeadCaptureBody
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const name  = body.name?.trim()
  const email = body.email?.trim()
  const phone = body.phone?.trim() || undefined
  const slug  = body.slug?.trim()

  if (!name || !email || !slug) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }

  const piece = getLeadMagnetBySlug(slug)
  if (!piece) {
    return NextResponse.json({ ok: false, error: 'unknown_slug' }, { status: 404 })
  }

  try {
    const ghl = await submitLeadMagnetToGHL({
      name,
      email,
      phone,
      pieceSlug: piece.slug,
      pieceTitle: piece.title,
    })
    return NextResponse.json({
      ok: true,
      contactId: ghl.contact?.id ?? null,
      redirectUrl: piece.htmlPath,
    })
  } catch (err) {
    console.error('[/api/lead-capture] GHL submit failed:', err)
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'unknown' },
      { status: 502 },
    )
  }
}
