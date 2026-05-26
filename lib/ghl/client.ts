// Cliente para crear/actualizar contactos en GoHighLevel vía API v2.
// Se usa SOLO server-side (Route Handler) — el PIT nunca debe llegar al browser.

import type { FormState } from '@/components/CalificationForm/types'
import type { CalificationResult } from '@/lib/calificationLogic'
import { mapFormToCustomFields } from './fields'

const GHL_BASE = 'https://services.leadconnectorhq.com'
const GHL_VERSION = '2021-07-28'
const GHL_TAGS = ['Leads NS']

interface UpsertContactResponse {
  new?: boolean
  contact?: { id: string; locationId: string }
  traceId?: string
}

export async function submitLeadToGHL(
  form: FormState,
  resultado: CalificationResult
): Promise<UpsertContactResponse> {
  const pit = process.env.GHL_PIT
  const locationId = process.env.GHL_LOCATION_ID
  if (!pit || !locationId) {
    throw new Error('GHL_PIT o GHL_LOCATION_ID no están seteados en el entorno.')
  }

  const payload = {
    locationId,
    firstName: form.nombre || undefined,
    lastName:  form.apellidos || undefined,
    email:     form.correo || undefined,
    phone:     form.telefono || undefined,
    tags:      GHL_TAGS,
    customFields: mapFormToCustomFields(form, resultado),
  }

  const res = await fetch(`${GHL_BASE}/contacts/upsert`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pit}`,
      Version: GHL_VERSION,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GHL upsert ${res.status}: ${text || res.statusText}`)
  }

  return (await res.json()) as UpsertContactResponse
}
