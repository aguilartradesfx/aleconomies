'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GlassCard from '@/components/ui/GlassCard'
import PhoneInput from '@/components/ui/PhoneInput'
import StepHeader, { Em } from '@/components/CalificationForm/StepHeader'
import { TextField, RadioGroup, ConsentCheckbox } from '@/components/CalificationForm/fields'
import ProgressBar from '@/components/CalificationForm/ProgressBar'
import FormNavigation from '@/components/CalificationForm/FormNavigation'
import CierreCalificado from '@/components/CalificationForm/steps/CierreCalificado'
import CierreEducativo from '@/components/CalificationForm/steps/CierreEducativo'
import { INITIAL_FORM_STATE, type FormState } from '@/components/CalificationForm/types'
import type { CalificationResult } from '@/lib/calificationLogic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ease = [0.16, 1, 0.3, 1] as const

// ── Modelo del form corto (independiente del form largo) ────────────────────
type StepId = 'contacto' | 'ingresos' | 'conocimiento' | 'presupuesto' | 'cierre'

type Ingresos =
  | 'ninguno'
  | 'r500_1500'
  | 'r1500_3000'
  | 'r3000_6000'
  | 'r6000_10000'
  | 'r10000_20000'
  | 'mas20000'
type Conocimiento = 'cero' | 'algo' | 'invirtiendo'
type Presupuesto = 'si' | 'no'

const ingresosOpts: ReadonlyArray<{ value: Ingresos; label: string }> = [
  { value: 'ninguno', label: 'No tengo ningún ingreso' },
  { value: 'r500_1500', label: 'De $500 a $1.500 USD' },
  { value: 'r1500_3000', label: 'Entre $1.500 y $3.000 USD' },
  { value: 'r3000_6000', label: 'Entre $3.000 y $6.000 USD' },
  { value: 'r6000_10000', label: 'Entre $6.000 y $10.000 USD' },
  { value: 'r10000_20000', label: 'Entre $10.000 y $20.000 USD' },
  { value: 'mas20000', label: 'Más de $20.000 USD' },
]

const conocimientoOpts: ReadonlyArray<{ value: Conocimiento; label: string }> = [
  { value: 'cero', label: 'No, deseo empezar desde cero' },
  { value: 'algo', label: 'Sí, algo' },
  { value: 'invirtiendo', label: 'Tengo conocimiento y actualmente invierto' },
]

const presupuestoOpts: ReadonlyArray<{ value: Presupuesto; label: string }> = [
  { value: 'si', label: 'Sí, está dentro de mi presupuesto' },
  { value: 'no', label: 'No, no está dentro de mi presupuesto' },
]

// Respuestas de ingresos que descalifican el lead.
const INGRESOS_DESCALIFICA: ReadonlyArray<Ingresos> = ['ninguno', 'r500_1500']

function labelOf<T extends string>(
  opts: ReadonlyArray<{ value: T; label: string }>,
  v: T | null,
): string {
  return opts.find(o => o.value === v)?.label ?? ''
}

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

export default function ShortForm() {
  const [stepId, setStepId] = useState<StepId>('contacto')

  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [telefono, setTelefono] = useState('')
  const [correo, setCorreo] = useState('')
  const [consent, setConsent] = useState(false)
  const [ingresos, setIngresos] = useState<Ingresos | null>(null)
  const [conocimiento, setConocimiento] = useState<Conocimiento | null>(null)
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null)

  const [contactId, setContactId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState(false)

  const startedRef = useRef(false)
  const submittedRef = useRef(false)
  const reportedRef = useRef<Set<StepId>>(new Set())
  const pendingRef = useRef<{ form: FormState; result: CalificationResult } | null>(null)

  // ── Pasos visibles según el estado (short-circuit por ingresos) ───────────
  const visibleSteps = useMemo<StepId[]>(() => {
    const steps: StepId[] = ['contacto', 'ingresos']
    if (ingresos && INGRESOS_DESCALIFICA.includes(ingresos)) {
      return [...steps, 'cierre']
    }
    steps.push('conocimiento', 'presupuesto', 'cierre')
    return steps
  }, [ingresos])

  const isAtCierre = stepId === 'cierre'
  const stepsForBar = visibleSteps.filter(s => s !== 'cierre')
  const currentBarIndex = isAtCierre
    ? stepsForBar.length
    : Math.max(0, stepsForBar.indexOf(stepId))
  const totalBar = stepsForBar.length

  // ── Validación por paso ───────────────────────────────────────────────────
  const isStepComplete = useCallback(
    (id: StepId): boolean => {
      switch (id) {
        case 'contacto':
          return Boolean(
            nombre.trim() &&
              apellidos.trim() &&
              telefono.trim() &&
              EMAIL_RE.test(correo.trim()) &&
              consent,
          )
        case 'ingresos':
          return ingresos !== null
        case 'conocimiento':
          return conocimiento !== null
        case 'presupuesto':
          return presupuesto !== null
        default:
          return true
      }
    },
    [nombre, apellidos, telefono, correo, consent, ingresos, conocimiento, presupuesto],
  )

  // ── Resultado de calificación (solo en el cierre) ─────────────────────────
  const resultado = useMemo<CalificationResult | null>(() => {
    if (stepId !== 'cierre') return null
    const descIngresos = ingresos ? INGRESOS_DESCALIFICA.includes(ingresos) : false
    const calificado = !descIngresos && presupuesto === 'si'

    const motivos: string[] = [`Ingresos: ${labelOf(ingresosOpts, ingresos)}`]
    if (conocimiento) motivos.push(`Conocimiento: ${labelOf(conocimientoOpts, conocimiento)}`)
    if (presupuesto) motivos.push(`Presupuesto asesoría $97: ${presupuesto === 'si' ? 'Sí' : 'No'}`)
    motivos.push(
      calificado
        ? 'Califica para asesoría'
        : descIngresos
          ? 'Descalifica: ingresos por debajo del umbral'
          : 'Descalifica: asesoría fuera de presupuesto',
    )

    return {
      etiqueta: calificado ? 'CALIFICADO_ALTO' : 'TRACK_EDUCATIVO',
      cierre: calificado ? 'agendar_llamada' : 'cierre_educativo',
      motivos,
    }
  }, [stepId, ingresos, conocimiento, presupuesto])

  function buildForm(): FormState {
    return {
      ...INITIAL_FORM_STATE,
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      // El "$97 sí/no" mapea al campo de compromiso de pago en GHL.
      compromiso: presupuesto === 'si' ? 'A' : presupuesto === 'no' ? 'B' : null,
      consentimientoDatos: true,
    }
  }

  // ── Envío del lead al mismo endpoint que el form largo ────────────────────
  async function sendLead(form: FormState, result: CalificationResult) {
    setSubmitError(false)
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, resultado: result, source: 'aplicar' }),
        keepalive: true,
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; contactId?: string | null }
      if (!res.ok || !data.ok) {
        setSubmitError(true)
        return
      }
      if (data.contactId) setContactId(data.contactId)
    } catch {
      setSubmitError(true)
    }
  }

  function retrySend() {
    if (pendingRef.current) {
      void sendLead(pendingRef.current.form, pendingRef.current.result)
    }
  }

  // ── form_start al montar + form_abandon al cerrar pestaña ──────────────────
  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true
      pushDataLayer({ event: 'form_start', form_name: 'calificacion-corta' })
    }
    const handleBeforeUnload = () => {
      if (submittedRef.current) return
      pushDataLayer({
        event: 'form_abandon',
        form_name: 'calificacion-corta',
        step: currentBarIndex + 1,
      })
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── form_submit + envío al entrar al cierre (una sola vez) ─────────────────
  useEffect(() => {
    if (!resultado || submittedRef.current) return
    submittedRef.current = true

    pushDataLayer({
      event: 'form_submit',
      form_name: 'calificacion-corta',
      form_result: resultado.cierre === 'agendar_llamada' ? 'calificado' : 'cierre_educativo',
      lead_etiqueta: resultado.etiqueta,
    })

    const form = buildForm()
    pendingRef.current = { form, result: resultado }
    void sendLead(form, resultado)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultado])

  // ── Navegación ────────────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    if (!isStepComplete(stepId)) return

    if (!reportedRef.current.has(stepId)) {
      reportedRef.current.add(stepId)
      pushDataLayer({
        event: 'form_step_complete',
        form_name: 'calificacion-corta',
        step: currentBarIndex + 1,
        step_id: stepId,
      })
    }

    const idx = visibleSteps.indexOf(stepId)
    const next = visibleSteps[idx + 1]
    if (next) setStepId(next)
  }, [stepId, isStepComplete, visibleSteps, currentBarIndex])

  const goBack = useCallback(() => {
    const idx = visibleSteps.indexOf(stepId)
    const prev = visibleSteps[idx - 1]
    if (prev) setStepId(prev)
  }, [stepId, visibleSteps])

  // Enter para avanzar (salvo en el cierre).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Enter') return
      const target = e.target as HTMLElement | null
      if (target && target.tagName === 'TEXTAREA') return
      if (stepId === 'cierre' || !isStepComplete(stepId)) return
      e.preventDefault()
      goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stepId, isStepComplete, goNext])

  // ── Render de cada paso ───────────────────────────────────────────────────
  function renderStep() {
    switch (stepId) {
      case 'contacto':
        return (
          <>
            <StepHeader
              eyebrow="Paso 1 — Sus datos"
              title={<>Empecemos por <Em>conocernos.</Em></>}
            />
            <TextField
              label="Nombre"
              name="nombre"
              value={nombre}
              onChange={setNombre}
              placeholder="Su nombre"
              autoComplete="given-name"
              autoFocus
            />
            <TextField
              label="Apellidos"
              name="apellidos"
              value={apellidos}
              onChange={setApellidos}
              placeholder="Sus apellidos"
              autoComplete="family-name"
            />
            <div className="calif-field">
              <label className="calif-label">Número de teléfono</label>
              <PhoneInput value={telefono} onChange={setTelefono} placeholder="8888 8888" />
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
              invalid={correo.trim() !== '' && !EMAIL_RE.test(correo.trim())}
              error={
                correo.trim() !== '' && !EMAIL_RE.test(correo.trim())
                  ? 'Ese correo no parece válido.'
                  : undefined
              }
            />
            <ConsentCheckbox checked={consent} onChange={setConsent} name="consentimientoDatos">
              Autorizo el tratamiento de mis datos conforme a la Ley 8968 de Protección de
              Datos Personales de Costa Rica. No se comparten con terceros.
            </ConsentCheckbox>
          </>
        )
      case 'ingresos':
        return (
          <>
            <StepHeader
              eyebrow="Paso 2 — Sus ingresos"
              title={<>Conozcamos su <Em>punto de partida.</Em></>}
            />
            <RadioGroup<Ingresos>
              legend="¿Cuál es su rango de ingresos mensuales?"
              name="ingresos"
              options={ingresosOpts}
              value={ingresos}
              onChange={setIngresos}
              grid
            />
          </>
        )
      case 'conocimiento':
        return (
          <>
            <StepHeader
              eyebrow="Paso 3 — Su experiencia"
              title={<>¿Qué tanto <Em>conoce de inversiones?</Em></>}
            />
            <RadioGroup<Conocimiento>
              legend="¿Tiene conocimiento en temas de inversión?"
              name="conocimiento"
              options={conocimientoOpts}
              value={conocimiento}
              onChange={setConocimiento}
            />
          </>
        )
      case 'presupuesto':
        return (
          <>
            <StepHeader
              eyebrow="Paso 4 — La asesoría"
              title={<>Un último <Em>detalle.</Em></>}
            />
            <RadioGroup<Presupuesto>
              legend="La asesoría tiene un valor de $97 USD. ¿Eso está dentro de su presupuesto?"
              name="presupuesto"
              options={presupuestoOpts}
              value={presupuesto}
              onChange={setPresupuesto}
            />
          </>
        )
      case 'cierre':
        if (resultado?.cierre === 'agendar_llamada') {
          return (
            <CierreCalificado
              decisorRequerido={false}
              contactId={contactId}
              leadName={`${nombre} ${apellidos}`.trim() || null}
            />
          )
        }
        return <CierreEducativo />
      default:
        return null
    }
  }

  const nextIsCierre = useMemo(() => {
    const idx = visibleSteps.indexOf(stepId)
    return visibleSteps[idx + 1] === 'cierre'
  }, [visibleSteps, stepId])

  const canGoNext = isStepComplete(stepId)
  const canGoBack = !isAtCierre && stepsForBar.indexOf(stepId) > 0

  return (
    <>
      {!isAtCierre && <ProgressBar current={currentBarIndex + 1} total={totalBar} />}

      <GlassCard variant="heavy" className="calif-card">
        {isAtCierre && submitError && (
          <p className="calif-error" role="alert" style={{ marginBottom: 16 }}>
            No pudimos guardar su información.{' '}
            <button type="button" onClick={retrySend} className="aplicar-retry">
              Reintentar
            </button>
          </p>
        )}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stepId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {!isAtCierre && (
          <FormNavigation
            onBack={goBack}
            onNext={goNext}
            canGoBack={canGoBack}
            canGoNext={canGoNext}
            nextLabel={nextIsCierre ? 'Continuar' : 'Siguiente'}
          />
        )}
      </GlassCard>
    </>
  )
}
