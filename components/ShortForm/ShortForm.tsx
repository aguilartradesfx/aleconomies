'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import PhoneInput from '@/components/ui/PhoneInput'
import StepHeader, { Em } from '@/components/CalificationForm/StepHeader'
import { TextField, RadioGroup, ConsentCheckbox } from '@/components/CalificationForm/fields'
import CierreCalificado from '@/components/CalificationForm/steps/CierreCalificado'
import CierreEducativo from '@/components/CalificationForm/steps/CierreEducativo'
import {
  INITIAL_FORM_STATE,
  type FormState,
  type IngresosRango,
  type Solvencia,
  type RangoCapital,
} from '@/components/CalificationForm/types'
import { calificarLead, type CalificationResult } from '@/lib/calificationLogic'
import { ingresosOpts, solvenciaOpts, rangoCapitalOpts } from '@/data/calificationForm'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Un solo control de capital que setea capitalDisponible + rangoCapital del FormState.
type CapitalChoice = 'cero' | 'A' | 'B' | 'C' | 'D'
const capitalOpts: ReadonlyArray<{ value: CapitalChoice; label: string }> = [
  { value: 'cero', label: 'Aún no, deseo empezar desde cero' },
  ...rangoCapitalOpts.map(o => ({ value: o.value as Exclude<CapitalChoice, 'cero'>, label: o.label })),
]

type DataLayerEntry = Record<string, unknown>
declare global {
  interface Window {
    dataLayer?: DataLayerEntry[]
  }
}
function pushDataLayer(entry: DataLayerEntry) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(entry)
}

type FieldKey = 'nombre' | 'apellidos' | 'telefono' | 'correo' | 'ingresos' | 'capital' | 'solvencia' | 'consent'
type FieldErrors = Partial<Record<FieldKey, string>>

export default function ShortForm() {
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [telefono, setTelefono] = useState('')
  const [correo, setCorreo] = useState('')
  const [ingresos, setIngresos] = useState<IngresosRango | null>(null)
  const [capital, setCapital] = useState<CapitalChoice | null>(null)
  const [solvencia, setSolvencia] = useState<Solvencia | null>(null)
  const [consent, setConsent] = useState(false)

  const [errors, setErrors] = useState<FieldErrors>({})
  const [resultado, setResultado] = useState<CalificationResult | null>(null)
  const [contactId, setContactId] = useState<string | null>(null)

  const startedRef = useRef(false)
  const submittedRef = useRef(false)

  // form_start una sola vez al montar.
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    pushDataLayer({ event: 'form_start', form_name: 'calificacion-corta' })
  }, [])

  function validate(): FieldErrors {
    const e: FieldErrors = {}
    if (!nombre.trim()) e.nombre = 'Ingrese su nombre.'
    if (!apellidos.trim()) e.apellidos = 'Ingrese sus apellidos.'
    if (!telefono.trim()) e.telefono = 'Ingrese su teléfono.'
    if (!correo.trim()) e.correo = 'Ingrese su correo.'
    else if (!EMAIL_RE.test(correo.trim())) e.correo = 'Ese correo no parece válido.'
    if (!ingresos) e.ingresos = 'Seleccione una opción.'
    if (!capital) e.capital = 'Seleccione una opción.'
    if (!solvencia) e.solvencia = 'Seleccione una opción.'
    if (!consent) e.consent = 'Necesitamos su consentimiento para continuar.'
    return e
  }

  function buildForm(): FormState {
    const capitalDisponible = capital === 'cero' ? 'B' : 'A'
    const rangoCapital = capital === 'cero' ? null : (capital as RangoCapital)
    return {
      ...INITIAL_FORM_STATE,
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      telefono: telefono.trim(),
      correo: correo.trim(),
      ingresos,
      solvencia,
      capitalDisponible,
      rangoCapital,
      consentimientoDatos: true,
    }
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (submittedRef.current) return
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length > 0) return
    submittedRef.current = true

    const form = buildForm()
    const result = calificarLead(form)

    pushDataLayer({
      event: 'form_submit',
      form_name: 'calificacion-corta',
      form_result: result.cierre === 'agendar_llamada' ? 'calificado' : 'cierre_educativo',
      lead_etiqueta: result.etiqueta,
    })

    // Mostramos el cierre de inmediato; el contactId llega en segundo plano
    // y habilita el botón de confirmar cita (mismo patrón que el form largo).
    setResultado(result)

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, resultado: result, source: 'aplicar' }),
        keepalive: true,
      })
      const data = (await res.json().catch(() => ({}))) as { contactId?: string | null }
      if (data.contactId) setContactId(data.contactId)
    } catch {
      // El lead pudo no guardarse; el cierre calificado mostrará el aviso
      // de "falta tu información" si no hay contactId para agendar.
    }
  }

  // ── Cierre inline ──
  if (resultado) {
    return (
      <GlassCard variant="heavy" className="calif-card">
        {resultado.cierre === 'agendar_llamada' ? (
          <CierreCalificado
            decisorRequerido={false}
            contactId={contactId}
            leadName={`${nombre} ${apellidos}`.trim() || null}
          />
        ) : (
          <CierreEducativo />
        )}
      </GlassCard>
    )
  }

  // ── Formulario ──
  return (
    <GlassCard variant="heavy" className="calif-card">
      <StepHeader
        eyebrow="Asesoría financiera 1 a 1"
        title={<>Agende su <Em>diagnóstico sin costo.</Em></>}
      />

      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Nombre"
          name="nombre"
          value={nombre}
          onChange={setNombre}
          placeholder="Su nombre"
          autoComplete="given-name"
          invalid={!!errors.nombre}
          error={errors.nombre}
        />
        <TextField
          label="Apellidos"
          name="apellidos"
          value={apellidos}
          onChange={setApellidos}
          placeholder="Sus apellidos"
          autoComplete="family-name"
          invalid={!!errors.apellidos}
          error={errors.apellidos}
        />

        <div className="calif-field">
          <label className="calif-label">Número de teléfono</label>
          <PhoneInput value={telefono} onChange={setTelefono} placeholder="8888 8888" />
          {errors.telefono && <p className="calif-error">{errors.telefono}</p>}
        </div>

        <TextField
          label="Correo electrónico"
          name="correo"
          type="email"
          inputMode="email"
          value={correo}
          onChange={setCorreo}
          placeholder="usted@ejemplo.com"
          autoComplete="email"
          invalid={!!errors.correo}
          error={errors.correo}
        />

        <RadioGroup<IngresosRango>
          legend="¿Cuál es su rango de ingresos mensuales?"
          name="ingresos"
          options={ingresosOpts as ReadonlyArray<{ value: IngresosRango; label: string }>}
          value={ingresos}
          onChange={setIngresos}
        />
        {errors.ingresos && <p className="calif-error">{errors.ingresos}</p>}

        <RadioGroup<CapitalChoice>
          legend="¿Con cuánto capital cuenta hoy para invertir?"
          name="capital"
          options={capitalOpts}
          value={capital}
          onChange={setCapital}
        />
        {errors.capital && <p className="calif-error">{errors.capital}</p>}

        <RadioGroup<Solvencia>
          legend="Para iniciar a invertir es importante tener solvencia (gastar menos de lo que se gana al mes). ¿Considera que la tiene hoy?"
          name="solvencia"
          options={solvenciaOpts as ReadonlyArray<{ value: Solvencia; label: string }>}
          value={solvencia}
          onChange={setSolvencia}
        />
        {errors.solvencia && <p className="calif-error">{errors.solvencia}</p>}

        <ConsentCheckbox checked={consent} onChange={setConsent} name="consentimientoDatos">
          Autorizo el tratamiento de mis datos conforme a la Ley 8968 de Protección de
          Datos Personales de Costa Rica. No se comparten con terceros.
        </ConsentCheckbox>
        {errors.consent && <p className="calif-error">{errors.consent}</p>}

        <button
          type="submit"
          className="btn-primary recurso-form-submit"
          style={{ marginTop: 20 }}
        >
          Enviar y agendar
          <ArrowRight size={16} strokeWidth={2} />
        </button>
      </form>
    </GlassCard>
  )
}
