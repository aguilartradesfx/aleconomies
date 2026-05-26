'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

interface Props {
  slug: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FieldErrors = Partial<Record<'name' | 'email', string>>

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export default function LeadMagnetForm({ slug }: Props) {
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting]   = useState(false)
  const [errors, setErrors]           = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)

  function validate(): FieldErrors {
    const next: FieldErrors = {}
    if (!name.trim()) next.name = 'Ingresá tu nombre.'
    if (!email.trim()) next.email = 'Ingresá tu correo.'
    else if (!EMAIL_RE.test(email.trim())) next.email = 'Ese correo no parece válido.'
    return next
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length > 0) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          slug,
        }),
      })

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        redirectUrl?: string
        error?: string
      }

      if (!res.ok || !data.ok || !data.redirectUrl) {
        setServerError(
          data.error === 'invalid_email'
            ? 'Ese correo no parece válido.'
            : 'No pudimos procesar tu solicitud. Intentá de nuevo en un momento.',
        )
        setSubmitting(false)
        return
      }

      window.dataLayer?.push({
        event: 'lead_magnet_submit',
        lead_magnet_slug: slug,
      })

      window.location.href = data.redirectUrl
    } catch {
      setServerError('Hubo un problema de red. Verificá tu conexión e intentá de nuevo.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="glass recurso-form-card">
      <h2 className="recurso-form-title">Accedé a la guía gratuita</h2>
      <p className="recurso-form-sub">
        Te lleva a la guía interactiva con opción de descargar el PDF.
      </p>

      <div className="recurso-form-row">
        <label htmlFor="lm-name">Nombre *</label>
        <input
          id="lm-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={e => setName(e.target.value)}
          aria-invalid={!!errors.name}
          required
        />
        {errors.name && <span className="recurso-form-error">{errors.name}</span>}
      </div>

      <div className="recurso-form-row">
        <label htmlFor="lm-email">Correo *</label>
        <input
          id="lm-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          required
        />
        {errors.email && <span className="recurso-form-error">{errors.email}</span>}
      </div>

      <div className="recurso-form-row">
        <label htmlFor="lm-phone">Teléfono (opcional)</label>
        <input
          id="lm-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
      </div>

      <p className="recurso-form-legal">
        Al enviar aceptás recibir comunicaciones de ALECONOMIES. Podés darte de
        baja cuando quieras.
      </p>

      <button
        type="submit"
        className="btn-primary recurso-form-submit"
        disabled={submitting}
      >
        {submitting ? 'Procesando…' : 'Acceder a la guía'}
        {!submitting && <ArrowRight size={16} strokeWidth={2} />}
      </button>

      {serverError && (
        <p className="recurso-form-feedback" role="alert">
          {serverError}
        </p>
      )}
    </form>
  )
}
