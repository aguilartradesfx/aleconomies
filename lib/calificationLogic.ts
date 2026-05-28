import type { FormState, LeadEtiqueta, CierreTipo, StepId } from '@/components/CalificationForm/types'

export interface CalificationResult {
  etiqueta: LeadEtiqueta
  cierre: CierreTipo
  motivos: string[]
}

// Función pura que califica al lead a partir del FormState completo.
// El orden de reglas refleja prioridad: hard stops primero, luego soft signals,
// finalmente la decisión ALTO vs MEDIO.
export function calificarLead(form: FormState): CalificationResult {
  const motivos: string[] = []

  if (form.solvencia === 'B') {
    motivos.push('Sin solvencia económica (P4 = B)')
    return { etiqueta: 'TRACK_EDUCATIVO', cierre: 'cierre_educativo', motivos }
  }

  if (form.compromiso === 'B') {
    motivos.push('No puede cubrir el costo de la asesoría de $97 USD (P18 = B)')
    return { etiqueta: 'TRACK_EDUCATIVO', cierre: 'cierre_educativo', motivos }
  }

  if (form.aporteMinimo === 'B') {
    motivos.push('No puede comprometerse con el aporte mínimo de ₡25.000 mensuales (P18.1 = B)')
    return { etiqueta: 'TRACK_EDUCATIVO', cierre: 'cierre_educativo', motivos }
  }

  if (form.deudas === 'C' && form.deudaPct === 'C') {
    motivos.push('Deudas no controladas con más del 50% del salario (P5.1 = C)')
    return { etiqueta: 'NO_CALIFICADO_HOY', cierre: 'cierre_educativo', motivos }
  }

  if (form.perfilInversor === 'E') {
    motivos.push('Necesita ordenarse financieramente para salir de deudas (P10 = E)')
    return { etiqueta: 'TRACK_EDUCATIVO', cierre: 'cierre_educativo', motivos }
  }

  const ingresosBajos = form.ingresos === 'A'
  if (ingresosBajos) {
    motivos.push('Ingresos menores a $1.500 USD (P3 = A)')
    return { etiqueta: 'TRACK_EDUCATIVO', cierre: 'cierre_educativo', motivos }
  }

  if (form.decision === 'A') {
    if (!form.decisorNombre || !form.decisorRelacion || !form.decisorConfirmado) {
      motivos.push('Falta información del decisor (estado inválido)')
      return { etiqueta: 'NO_CALIFICADO_HOY', cierre: 'cierre_educativo', motivos }
    }
    motivos.push('Califica medio: requiere consultar con otra persona (P19 = A)')
    return { etiqueta: 'CALIFICADO_MEDIO', cierre: 'agendar_llamada', motivos }
  }

  motivos.push('Califica alto: solvencia + control de deudas + decisión propia')
  return { etiqueta: 'CALIFICADO_ALTO', cierre: 'agendar_llamada', motivos }
}

// Calcula la lista de pasos visibles dado el estado actual.
// La barra de progreso y "Paso X de Y" usan esta lista.
// Si un short-circuit aplica (P4=B, deuda >50% no controlada, o P18/18.1=B),
// el flujo termina en 'cierre'.
export function getVisibleSteps(form: FormState): StepId[] {
  const steps: StepId[] = ['contacto', 'perfilPersonal', 'solvencia']

  if (form.solvencia === 'B') {
    return [...steps, 'cierre']
  }

  steps.push('deudas')

  // Short-circuit: deudas no controladas con más del 50% del salario descalifican
  // de inmediato, sin hacerle completar el resto del formulario.
  if (form.deudas === 'C' && form.deudaPct === 'C') {
    return [...steps, 'cierre']
  }

  steps.push(
    'ahorro',
    'experiencia',
    'perfilInversor',
    'objetivos',
    'capital',
    'motivacion',
    'compromiso',
  )

  if (form.compromiso === 'B' || form.aporteMinimo === 'B') {
    return [...steps, 'cierre']
  }

  steps.push('decision', 'consentimiento', 'cierre')
  return steps
}
