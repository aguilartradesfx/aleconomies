'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GlassCard from '@/components/ui/GlassCard'
import { calificarLead, getVisibleSteps, type CalificationResult } from '@/lib/calificationLogic'
import { isStepComplete } from './validation'
import ProgressBar from './ProgressBar'
import FormNavigation from './FormNavigation'
import Step01Contacto from './steps/Step01Contacto'
import Step02PerfilPersonal from './steps/Step02PerfilPersonal'
import Step03Solvencia from './steps/Step03Solvencia'
import Step04Deudas from './steps/Step04Deudas'
import Step05Ahorro from './steps/Step05Ahorro'
import Step06ExperienciaInversion from './steps/Step06ExperienciaInversion'
import Step07PerfilInversor from './steps/Step07PerfilInversor'
import Step08Objetivos from './steps/Step08Objetivos'
import Step09Capital from './steps/Step09Capital'
import Step10Motivacion from './steps/Step10Motivacion'
import Step11Compromiso from './steps/Step11Compromiso'
import Step12Decision from './steps/Step12Decision'
import StepConsentimiento from './steps/StepConsentimiento'
import CierreCalificado from './steps/CierreCalificado'
import CierreEducativo from './steps/CierreEducativo'
import { INITIAL_FORM_STATE, type FormState, type StepId } from './types'

const STORAGE_KEY = 'calificacion-form-v1'
const ease = [0.16, 1, 0.3, 1] as const

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

// Envía el lead al endpoint server-side que crea/actualiza el contacto en GHL.
// Retorna el contactId si GHL respondió OK — lo necesitamos para crear la cita
// si el usuario decide agendar la asesoría desde el cierre.
async function enviarLead(form: FormState, resultado: CalificationResult): Promise<string | null> {
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form, resultado }),
      keepalive: true,
    })
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn('[lead] envío no OK:', res.status, await res.text().catch(() => ''))
      return null
    }
    const data = (await res.json().catch(() => ({}))) as { contactId?: string | null }
    return data.contactId ?? null
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[lead] error de red al enviar:', err)
    return null
  }
}

export default function CalificationForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE)
  const [currentStepId, setCurrentStepId] = useState<StepId>('contacto')
  const [hydrated, setHydrated] = useState(false)
  const [contactId, setContactId] = useState<string | null>(null)
  const startedRef = useRef(false)
  const submittedRef = useRef(false)
  const reportedStepsRef = useRef<Set<StepId>>(new Set())

  // ── Hydration desde sessionStorage ─────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { form?: FormState; stepId?: StepId }
        if (parsed.form) setForm({ ...INITIAL_FORM_STATE, ...parsed.form })
        if (parsed.stepId) setCurrentStepId(parsed.stepId)
      }
    } catch {
      // estado corrupto — ignoramos y arrancamos limpios
    }
    setHydrated(true)
  }, [])

  // ── Persistencia ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ form, stepId: currentStepId }))
    } catch {
      // sessionStorage lleno o bloqueado — sin acción
    }
  }, [form, currentStepId, hydrated])

  // ── form_start (una vez) y form_abandon al cerrar la pestaña ──────────────
  useEffect(() => {
    if (!hydrated) return
    if (!startedRef.current) {
      pushDataLayer({ event: 'form_start', form_name: 'calificacion' })
      startedRef.current = true
    }
    const handleBeforeUnload = () => {
      if (submittedRef.current) return
      pushDataLayer({
        event: 'form_abandon',
        form_name: 'calificacion',
        step: stepIndex + 1,
      })
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated])

  const update = useCallback((patch: Partial<FormState>) => {
    setForm(prev => ({ ...prev, ...patch }))
  }, [])

  // ── Lista de pasos visibles según estado actual ───────────────────────────
  const visibleSteps = useMemo(() => getVisibleSteps(form), [form])
  const stepIndex = Math.max(0, visibleSteps.indexOf(currentStepId))
  const isAtCierre = currentStepId === 'cierre'
  // Pasos totales mostrados al usuario (excluyendo cierre — el cierre se ve como "Paso final").
  const visibleStepsForBar = visibleSteps.filter(s => s !== 'cierre')
  const currentVisibleIndex = isAtCierre
    ? visibleStepsForBar.length
    : Math.max(0, visibleStepsForBar.indexOf(currentStepId))
  const totalBar = visibleStepsForBar.length

  // ── Cómputo de resultado (solo cuando estamos en cierre) ──────────────────
  const resultado = useMemo<CalificationResult | null>(() => {
    if (currentStepId !== 'cierre') return null
    return calificarLead(form)
  }, [currentStepId, form])

  // ── Enviar lead + dataLayer al entrar al cierre ───────────────────────────
  useEffect(() => {
    if (!resultado || submittedRef.current) return
    submittedRef.current = true

    pushDataLayer({
      event: 'form_submit',
      form_name: 'calificacion',
      form_result: resultado.cierre === 'agendar_llamada' ? 'calificado' : 'cierre_educativo',
      lead_etiqueta: resultado.etiqueta,
    })

    enviarLead(form, resultado).then(id => {
      if (id) setContactId(id)
    })

    // Limpiar sessionStorage al cerrar el flujo.
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // sin acción
    }
  }, [resultado, form])

  // ── Navegación ────────────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    if (!isStepComplete(currentStepId, form)) return

    // Disparar form_step_complete una sola vez por paso.
    if (!reportedStepsRef.current.has(currentStepId)) {
      reportedStepsRef.current.add(currentStepId)
      pushDataLayer({
        event: 'form_step_complete',
        form_name: 'calificacion',
        step: currentVisibleIndex + 1,
        step_id: currentStepId,
      })
    }

    // Recalcular pasos con el estado actual (form ya está actualizado).
    const steps = getVisibleSteps(form)
    const idx = steps.indexOf(currentStepId)
    const next = steps[idx + 1]
    if (next) setCurrentStepId(next)
  }, [currentStepId, form, currentVisibleIndex])

  const goBack = useCallback(() => {
    const steps = getVisibleSteps(form)
    const idx = steps.indexOf(currentStepId)
    const prev = steps[idx - 1]
    if (prev) setCurrentStepId(prev)
  }, [currentStepId, form])

  // Enter para avanzar (salvo cuando hay textarea con foco — Enter ahí inserta salto).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Enter') return
      const target = e.target as HTMLElement | null
      if (target && target.tagName === 'TEXTAREA') return
      if (currentStepId === 'cierre') return
      if (!isStepComplete(currentStepId, form)) return
      e.preventDefault()
      goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentStepId, form, goNext])

  // ── Render del paso ───────────────────────────────────────────────────────
  function renderStep() {
    switch (currentStepId) {
      case 'contacto':
        return <Step01Contacto form={form} update={update} />
      case 'perfilPersonal':
        return <Step02PerfilPersonal form={form} update={update} />
      case 'solvencia':
        return <Step03Solvencia form={form} update={update} />
      case 'deudas':
        return <Step04Deudas form={form} update={update} />
      case 'ahorro':
        return <Step05Ahorro form={form} update={update} />
      case 'experiencia':
        return <Step06ExperienciaInversion form={form} update={update} />
      case 'perfilInversor':
        return <Step07PerfilInversor form={form} update={update} />
      case 'objetivos':
        return <Step08Objetivos form={form} update={update} />
      case 'capital':
        return <Step09Capital form={form} update={update} />
      case 'motivacion':
        return <Step10Motivacion form={form} update={update} />
      case 'compromiso':
        return <Step11Compromiso form={form} update={update} />
      case 'decision':
        return <Step12Decision form={form} update={update} />
      case 'consentimiento':
        return <StepConsentimiento form={form} update={update} />
      case 'cierre':
        if (resultado?.cierre === 'agendar_llamada') {
          const leadName = `${form.nombre} ${form.apellidos}`.trim()
          return (
            <CierreCalificado
              decisorRequerido={form.decision === 'A'}
              contactId={contactId}
              leadName={leadName || null}
            />
          )
        }
        return <CierreEducativo />
      default:
        return null
    }
  }

  // En cierre B (no calificado o educativo), el botón previo lleva a "Continuar →"
  // El paso compromiso, si responde B, debe permitir cliquear "Continuar →" para llegar al cierre.
  const isShortCircuitFromCompromiso =
    currentStepId === 'compromiso' &&
    (form.compromiso === 'B' || (form.compromiso === 'A' && form.aporteMinimo === 'B'))

  const isShortCircuitFromSolvencia = currentStepId === 'solvencia' && form.solvencia === 'B'

  const nextLabel =
    isShortCircuitFromSolvencia || isShortCircuitFromCompromiso ? 'Continuar' : 'Siguiente'

  const canGoNext = isStepComplete(currentStepId, form)
  const canGoBack = stepIndex > 0 && !isAtCierre

  // Evitamos flicker en la hidratación: mostramos el shell pero con el primer paso.
  if (!hydrated) {
    return (
      <div className="calif-shell" aria-hidden="true">
        <div className="calif-progress-wrap">
          <div className="calif-progress-track">
            <div className="calif-progress-fill" style={{ width: '0%' }} />
          </div>
        </div>
        <GlassCard variant="heavy" className="calif-card">
          <div style={{ height: 320 }} />
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="calif-shell">
      {!isAtCierre && (
        <ProgressBar
          current={currentVisibleIndex + 1}
          total={totalBar}
        />
      )}

      <GlassCard variant="heavy" className="calif-card">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStepId}
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
            nextLabel={nextLabel}
          />
        )}
      </GlassCard>
    </div>
  )
}
