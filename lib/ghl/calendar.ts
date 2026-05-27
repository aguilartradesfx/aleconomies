// Cliente para consultar disponibilidad y crear citas en GoHighLevel.
// Server-side only — el PIT nunca debe llegar al browser.
//
// Parámetros del calendario (los manejamos del lado nuestro, el calendario
// en GHL está configurado abierto para no chocar):
//   - Horario:        08:00 – 20:00 hora Costa Rica (UTC-6, sin DST)
//   - Duración cita:  1.5 horas (90 min)
//   - Buffer:         30 min entre citas
//   - Granularidad:   slots candidatos cada 30 min
//   - Sin máximo de citas por día.

const GHL_BASE = 'https://services.leadconnectorhq.com'
const GHL_VERSION_CAL = '2021-04-15'

export const CALENDAR_ID = 'GXK5DdKpcpi3rSKBFdNB'
export const TIMEZONE = 'America/Costa_Rica'
const CR_UTC_OFFSET = '-06:00'

export const DAY_START_HOUR = 8
export const DAY_END_HOUR = 20
export const APPT_DURATION_MIN = 90
export const BUFFER_MIN = 30
const SLOT_GRANULARITY_MIN = 30

interface GHLEvent {
  id: string
  startTime: string  // ISO con offset
  endTime: string
  appointmentStatus?: string
}

interface EventsResponse {
  events?: GHLEvent[]
}

interface AppointmentResponse {
  id?: string
  appointmentId?: string
}

function authHeaders(): Record<string, string> {
  const pit = process.env.GHL_PIT
  if (!pit) throw new Error('GHL_PIT no está seteado en el entorno.')
  return {
    Authorization: `Bearer ${pit}`,
    Version: GHL_VERSION_CAL,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
}

/** Obtiene los eventos existentes del calendario en un rango (epoch ms). */
export async function getCalendarEvents(
  startEpochMs: number,
  endEpochMs: number,
): Promise<GHLEvent[]> {
  const locationId = process.env.GHL_LOCATION_ID
  if (!locationId) throw new Error('GHL_LOCATION_ID no está seteado.')

  const url = new URL(`${GHL_BASE}/calendars/events`)
  url.searchParams.set('locationId', locationId)
  url.searchParams.set('calendarId', CALENDAR_ID)
  url.searchParams.set('startTime', String(startEpochMs))
  url.searchParams.set('endTime', String(endEpochMs))

  const res = await fetch(url, { headers: authHeaders(), cache: 'no-store' })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GHL events ${res.status}: ${text || res.statusText}`)
  }
  const data = (await res.json()) as EventsResponse
  return data.events ?? []
}

/** Crea una cita en GHL. startISO y endISO deben incluir offset (-06:00). */
export async function createAppointment(args: {
  contactId: string
  startISO: string
  endISO: string
  title?: string
}): Promise<string | null> {
  const locationId = process.env.GHL_LOCATION_ID
  if (!locationId) throw new Error('GHL_LOCATION_ID no está seteado.')

  const res = await fetch(`${GHL_BASE}/calendars/events/appointments`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      calendarId: CALENDAR_ID,
      locationId,
      contactId: args.contactId,
      startTime: args.startISO,
      endTime: args.endISO,
      title: args.title ?? 'Asesoría de inversión',
      appointmentStatus: 'confirmed',
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GHL appointment ${res.status}: ${text || res.statusText}`)
  }
  const data = (await res.json()) as AppointmentResponse
  return data.id ?? data.appointmentId ?? null
}

// ── Generación y filtrado de slots ─────────────────────────────────────────

export interface Slot {
  /** ISO con offset CR, ej '2026-05-30T14:00:00-06:00' */
  startISO: string
  endISO: string
}

/** Construye un ISO en CR (-06:00) a partir de Y/M/D y minutos del día. */
function buildCrISO(year: number, month: number, day: number, minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${year}-${pad(month)}-${pad(day)}T${pad(h)}:${pad(m)}:00${CR_UTC_OFFSET}`
}

/** Genera todos los slots candidatos del día (en CR), cada 30 min. */
function generateCandidates(date: { y: number; m: number; d: number }): Slot[] {
  const out: Slot[] = []
  const startMin = DAY_START_HOUR * 60
  const endMin = DAY_END_HOUR * 60
  for (let mins = startMin; mins + APPT_DURATION_MIN <= endMin; mins += SLOT_GRANULARITY_MIN) {
    out.push({
      startISO: buildCrISO(date.y, date.m, date.d, mins),
      endISO: buildCrISO(date.y, date.m, date.d, mins + APPT_DURATION_MIN),
    })
  }
  return out
}

/** Convierte un ISO a epoch ms. */
const toMs = (iso: string) => new Date(iso).getTime()

/** Parsea 'YYYY-MM-DD' a partes (UTC-neutral). */
function parseYMD(s: string): { y: number; m: number; d: number } {
  const [y, m, d] = s.split('-').map(n => Number(n))
  return { y, m, d }
}

/** Devuelve los slots disponibles por fecha en el rango (inclusive). */
export async function computeAvailability(
  startDate: string,
  endDate: string,
): Promise<Record<string, Slot[]>> {
  const start = parseYMD(startDate)
  const end = parseYMD(endDate)
  const startMs = toMs(buildCrISO(start.y, start.m, start.d, 0))
  // sumamos 24h para incluir el día end completo
  const endMs = toMs(buildCrISO(end.y, end.m, end.d, 24 * 60))

  const events = await getCalendarEvents(startMs, endMs)
  const eventRanges = events
    .filter(e => e.appointmentStatus !== 'cancelled')
    .map(e => ({ start: toMs(e.startTime), end: toMs(e.endTime) }))

  const nowMs = Date.now()
  const bufferMs = BUFFER_MIN * 60_000

  const result: Record<string, Slot[]> = {}

  // Iterar día a día
  const cursor = new Date(buildCrISO(start.y, start.m, start.d, 12 * 60))  // mediodía evita issues DST
  const endCursor = new Date(buildCrISO(end.y, end.m, end.d, 12 * 60))

  while (cursor.getTime() <= endCursor.getTime()) {
    const y = cursor.getFullYear()
    const m = cursor.getMonth() + 1
    const d = cursor.getDate()
    const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`

    // Todos los días incluidos (cliente puede bloquear fines de semana en GHL si quiere).
    const candidates = generateCandidates({ y, m, d })
    const available = candidates.filter(c => {
      const cStart = toMs(c.startISO)
      const cEnd = toMs(c.endISO)
      if (cStart < nowMs) return false
      for (const ev of eventRanges) {
        if (cEnd + bufferMs > ev.start && cStart - bufferMs < ev.end) return false
      }
      return true
    })
    if (available.length > 0) result[dateKey] = available

    cursor.setDate(cursor.getDate() + 1)
  }

  return result
}
