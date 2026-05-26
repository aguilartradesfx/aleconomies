// Cliente para crear/actualizar contactos en GoHighLevel vía API v2.
// Se usa SOLO server-side (Route Handler) — el PIT nunca debe llegar al browser.

import type { FormState } from '@/components/CalificationForm/types'
import type { CalificationResult } from '@/lib/calificationLogic'
import { mapFormToCustomFields, type GHLCustomField } from './fields'

const GHL_BASE = 'https://services.leadconnectorhq.com'
const GHL_VERSION = '2021-07-28'
const GHL_TAGS = ['Leads NS']

interface UpsertContactResponse {
  new?: boolean
  contact?: { id: string; locationId: string }
  traceId?: string
}

interface ContactPayload {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  tags?: string[]
  customFields?: GHLCustomField[]
}

async function upsertContact(payload: ContactPayload): Promise<UpsertContactResponse> {
  const pit = process.env.GHL_PIT
  const locationId = process.env.GHL_LOCATION_ID
  if (!pit || !locationId) {
    throw new Error('GHL_PIT o GHL_LOCATION_ID no están seteados en el entorno.')
  }

  const res = await fetch(`${GHL_BASE}/contacts/upsert`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pit}`,
      Version: GHL_VERSION,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ locationId, ...payload }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GHL upsert ${res.status}: ${text || res.statusText}`)
  }

  return (await res.json()) as UpsertContactResponse
}

export async function submitLeadToGHL(
  form: FormState,
  resultado: CalificationResult
): Promise<UpsertContactResponse> {
  return upsertContact({
    firstName: form.nombre || undefined,
    lastName:  form.apellidos || undefined,
    email:     form.correo || undefined,
    phone:     form.telefono || undefined,
    tags:      [...GHL_TAGS, 'Calificación', `Calificación: ${resultado.etiqueta}`],
    customFields: mapFormToCustomFields(form, resultado),
  })
}

export async function submitExitLeadToGHL(
  name: string,
  email: string,
  phone: string
): Promise<UpsertContactResponse> {
  const trimmed = name.trim()
  const sp = trimmed.indexOf(' ')
  const firstName = sp === -1 ? trimmed : trimmed.slice(0, sp)
  const lastName  = sp === -1 ? undefined : trimmed.slice(sp + 1)

  return upsertContact({
    firstName,
    lastName,
    email: email || undefined,
    phone: phone || undefined,
    tags:  [...GHL_TAGS, 'Popup'],
  })
}

export async function submitLeadMagnetToGHL(args: {
  name: string
  email: string
  phone?: string
  pieceSlug: string
  pieceTitle: string
}): Promise<UpsertContactResponse> {
  const trimmed = args.name.trim()
  const sp = trimmed.indexOf(' ')
  const firstName = sp === -1 ? trimmed : trimmed.slice(0, sp)
  const lastName  = sp === -1 ? undefined : trimmed.slice(sp + 1)

  return upsertContact({
    firstName,
    lastName,
    email: args.email || undefined,
    phone: args.phone || undefined,
    tags: [...GHL_TAGS, 'Lead Magnet', `LM: ${args.pieceSlug}`],
  })
}
