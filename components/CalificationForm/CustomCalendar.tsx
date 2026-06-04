'use client'

import { useEffect, useMemo, useState } from 'react'
import { Calendar, CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

interface Slot {
  /** ISO con offset Costa Rica, ej '2026-05-30T14:00:00-06:00' */
  startISO: string
  endISO: string
}

type Availability = Record<string, Slot[]>

interface Props {
  /** Necesario para crear la cita en GHL; si falta, el botón de confirmar se deshabilita. */
  contactId: string | null
  /** Nombre completo del lead — se concatena al título de la cita en GHL. */
  leadName?: string | null
  onBooked?: (info: { slot: Slot; appointmentId: string | null }) => void
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const DOW_ES = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const CR_TZ = 'America/Costa_Rica'

/** Hoy en zona Costa Rica — independiente del browser del usuario. */
function todayInCR(): { year: number; month: number; day: number; str: string } {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: CR_TZ }).format(new Date())
  const [y, m, d] = parts.split('-').map(Number)
  return {
    year: y,
    month: m,
    day: d,
    str: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
  }
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('es-CR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
    timeZone: CR_TZ,
  }).format(new Date(iso))
}

function formatDateLong(iso: string): string {
  return new Intl.DateTimeFormat('es-CR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: CR_TZ,
  }).format(new Date(iso))
}

function formatDateMedium(dateKey: string): string {
  return new Intl.DateTimeFormat('es-CR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: CR_TZ,
  }).format(new Date(`${dateKey}T12:00:00-06:00`))
}

export default function CustomCalendar({ contactId, leadName, onBooked }: Props) {
  const today = useMemo(() => todayInCR(), [])

  const [viewYear, setViewYear] = useState(today.year)
  const [viewMonth, setViewMonth] = useState(today.month)  // 1-12

  const [availability, setAvailability] = useState<Availability>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  const [booking, setBooking] = useState(false)
  const [booked, setBooked] = useState<{ slot: Slot; appointmentId: string | null } | null>(null)
  const [bookError, setBookError] = useState<string | null>(null)

  const monthRange = useMemo(() => {
    const pad = (n: number) => String(n).padStart(2, '0')
    const lastDay = new Date(viewYear, viewMonth, 0).getDate()
    return {
      startDate: `${viewYear}-${pad(viewMonth)}-01`,
      endDate: `${viewYear}-${pad(viewMonth)}-${pad(lastDay)}`,
      lastDay,
    }
  }, [viewYear, viewMonth])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`/api/calendar/slots?startDate=${monthRange.startDate}&endDate=${monthRange.endDate}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        if (!data.ok) {
          setError('No pudimos cargar la disponibilidad. Intentá de nuevo.')
        } else {
          setAvailability((data.slots ?? {}) as Availability)
        }
      })
      .catch(() => {
        if (!cancelled) setError('Error de red al cargar la disponibilidad.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [monthRange.startDate, monthRange.endDate])

  useEffect(() => {
    setSelectedSlot(null)
  }, [selectedDate])

  function goPrevMonth() {
    if (viewYear === today.year && viewMonth === today.month) return
    if (viewMonth === 1) {
      setViewMonth(12); setViewYear(y => y - 1)
    } else {
      setViewMonth(m => m - 1)
    }
    setSelectedDate(null)
  }
  function goNextMonth() {
    if (viewMonth === 12) {
      setViewMonth(1); setViewYear(y => y + 1)
    } else {
      setViewMonth(m => m + 1)
    }
    setSelectedDate(null)
  }

  const grid = useMemo(() => {
    type Cell = { date: string | null; available: boolean; isPast: boolean }
    const cells: Cell[] = []
    const firstWeekday = new Date(viewYear, viewMonth - 1, 1).getDay() // 0=dom
    const firstColumn = (firstWeekday + 6) % 7 // lunes primero
    for (let i = 0; i < firstColumn; i++) cells.push({ date: null, available: false, isPast: false })
    const pad = (n: number) => String(n).padStart(2, '0')
    for (let d = 1; d <= monthRange.lastDay; d++) {
      const dateStr = `${viewYear}-${pad(viewMonth)}-${pad(d)}`
      const isPast = dateStr < today.str
      const available = !isPast && (availability[dateStr]?.length ?? 0) > 0
      cells.push({ date: dateStr, available, isPast })
    }
    return cells
  }, [viewYear, viewMonth, monthRange.lastDay, availability, today.str])

  const slotsForDate = selectedDate ? availability[selectedDate] ?? [] : []

  async function handleConfirm() {
    if (!selectedSlot || !contactId || booking) return
    setBooking(true)
    setBookError(null)
    try {
      const cleanName = (leadName ?? '').trim()
      const title = cleanName
        ? `Asesoría de Inversión | ${cleanName}`
        : 'Asesoría de Inversión'
      const res = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId,
          startISO: selectedSlot.startISO,
          endISO: selectedSlot.endISO,
          title,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        appointmentId?: string | null
        error?: string
      }
      if (!res.ok || !data.ok) {
        setBookError(
          data.error === 'slot_in_past'
            ? 'Ese horario ya no está disponible. Elegí otro.'
            : 'No pudimos confirmar la cita. Intentá de nuevo en un momento.',
        )
        setBooking(false)
        return
      }
      const info = { slot: selectedSlot, appointmentId: data.appointmentId ?? null }
      setBooked(info)

      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: 'appointment_booked',
          appointment_id: info.appointmentId,
          appointment_start: info.slot.startISO,
        })
      }

      onBooked?.(info)
    } catch {
      setBookError('Error de red al confirmar. Verificá tu conexión.')
      setBooking(false)
    }
  }

  if (booked) {
    return (
      <div className="custom-calendar-success">
        <CheckCircle2 size={36} className="custom-calendar-success-icon" />
        <h3>¡Listo! Tu asesoría está agendada.</h3>
        <p className="custom-calendar-success-date">
          {formatDateLong(booked.slot.startISO)}
        </p>
        <p className="custom-calendar-success-time">
          {formatTime(booked.slot.startISO)} – {formatTime(booked.slot.endISO)} · hora Costa Rica
        </p>
        <p className="custom-calendar-success-note">
          Te llegará un correo con los detalles. El pago de USD 97 lo coordinamos
          previo a la sesión.
        </p>
      </div>
    )
  }

  const prevDisabled = viewYear === today.year && viewMonth === today.month

  return (
    <div className="custom-calendar">
      <header className="custom-calendar-head">
        <button
          type="button"
          onClick={goPrevMonth}
          disabled={prevDisabled}
          className="custom-calendar-nav"
          aria-label="Mes anterior"
        >
          <ChevronLeft size={16} />
        </button>
        <h4 className="custom-calendar-month">
          {MONTHS_ES[viewMonth - 1]} {viewYear}
        </h4>
        <button
          type="button"
          onClick={goNextMonth}
          className="custom-calendar-nav"
          aria-label="Mes siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </header>

      <div className="custom-calendar-dow">
        {DOW_ES.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      {loading ? (
        <div className="custom-calendar-loading">
          <Loader2 size={18} className="custom-calendar-spinner" />
          Cargando disponibilidad…
        </div>
      ) : error ? (
        <div className="custom-calendar-msg">{error}</div>
      ) : (
        <div className="custom-calendar-grid">
          {grid.map((cell, i) => {
            if (!cell.date) {
              return <span key={i} className="custom-calendar-day custom-calendar-day-empty" />
            }
            const day = Number(cell.date.split('-')[2])
            const selected = cell.date === selectedDate
            return (
              <button
                key={i}
                type="button"
                onClick={() => cell.available && setSelectedDate(cell.date)}
                disabled={!cell.available}
                className="custom-calendar-day"
                data-available={cell.available ? 'true' : undefined}
                data-selected={selected ? 'true' : undefined}
                data-past={cell.isPast ? 'true' : undefined}
              >
                <span>{day}</span>
                {cell.available && <span className="custom-calendar-dot" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      )}

      {selectedDate && !loading && (
        <>
          <h4 className="custom-calendar-slots-title">
            Horarios disponibles · {formatDateMedium(selectedDate)}
          </h4>
          {slotsForDate.length === 0 ? (
            <p className="custom-calendar-msg">No hay horarios libres para este día.</p>
          ) : (
            <div className="custom-calendar-slots">
              {slotsForDate.map(s => {
                const selected = s.startISO === selectedSlot?.startISO
                return (
                  <button
                    key={s.startISO}
                    type="button"
                    onClick={() => setSelectedSlot(s)}
                    className="custom-calendar-slot"
                    data-selected={selected ? 'true' : undefined}
                  >
                    {formatTime(s.startISO)}
                  </button>
                )
              })}
            </div>
          )}
        </>
      )}

      {selectedSlot && (
        <div className="custom-calendar-confirm">
          <div className="custom-calendar-confirm-info">
            <Calendar size={18} className="custom-calendar-confirm-icon" />
            <div>
              <strong>{formatDateLong(selectedSlot.startISO)}</strong>
              <span>
                {formatTime(selectedSlot.startISO)} – {formatTime(selectedSlot.endISO)} · hora CR
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleConfirm}
            className="btn-primary custom-calendar-confirm-cta"
            disabled={booking || !contactId}
          >
            {booking ? 'Agendando…' : 'Confirmar asesoría'}
          </button>
          {!contactId && (
            <p className="custom-calendar-warn">
              Falta tu información de contacto. Volvé al paso anterior y completá el form.
            </p>
          )}
          {bookError && <p className="custom-calendar-warn">{bookError}</p>}
        </div>
      )}
    </div>
  )
}
