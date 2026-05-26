import type { FormState, StepId } from './types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// CR: 8 dígitos sin separadores, o internacional con + y 7-15 dígitos.
const PHONE_RE = /^(?:\+\d{7,15}|\d{8})$/

export function isStepComplete(stepId: StepId, form: FormState): boolean {
  switch (stepId) {
    case 'contacto':
      return (
        form.nombre.trim().length >= 2 &&
        form.apellidos.trim().length >= 2 &&
        PHONE_RE.test(form.telefono.replace(/[\s-]/g, '')) &&
        EMAIL_RE.test(form.correo.trim())
      )
    case 'perfilPersonal':
      return (
        typeof form.edad === 'number' &&
        form.edad >= 18 &&
        form.edad <= 90 &&
        form.profesion.trim().length >= 3 &&
        form.ingresos !== null
      )
    case 'solvencia':
      return form.solvencia !== null
    case 'deudas':
      if (form.deudas === null) return false
      if (form.deudas === 'C' && form.deudaPct === null) return false
      return true
    case 'ahorro': {
      if (form.fondoEmergencia === null) return false
      if (form.ahorro === null) return false
      if ((form.ahorro === 'A' || form.ahorro === 'B') && form.montoAhorro === null) return false
      return true
    }
    case 'experiencia': {
      if (form.experienciaInversion === null) return false
      if (form.experienciaInversion === 'A') {
        if (form.nivelConocimiento === null || form.nivelConocimiento === 'Nulo') return false
        if (form.nivelConocimiento === 'C') {
          if (form.instrumentos.length === 0) return false
          if (form.instrumentos.includes('Otros') && form.instrumentoOtro.trim().length < 2) return false
        }
      }
      return true
    }
    case 'perfilInversor':
      return (
        form.perfilInversor !== null &&
        form.tolerancia !== null &&
        form.horizonte !== null &&
        form.administracion !== null
      )
    case 'objetivos':
      return form.objetivos.length >= 1 && form.objetivos.length <= 3
    case 'capital': {
      if (form.capitalDisponible === null) return false
      if (form.capitalDisponible === 'A' && form.rangoCapital === null) return false
      if (form.garantias === null) return false
      return true
    }
    case 'motivacion':
      return form.razones.trim().length >= 50
    case 'compromiso': {
      if (form.compromiso === null) return false
      if (form.compromiso === 'A' && form.aporteMinimo === null) return false
      return true
    }
    case 'decision': {
      if (form.decision === null) return false
      if (form.decision === 'A') {
        if (form.decisorNombre.trim().length < 3) return false
        if (form.decisorRelacion === null) return false
        if (form.decisorRelacion === 'Otro' && form.decisorRelacionOtro.trim().length < 2) return false
        if (!form.decisorConfirmado) return false
      }
      return true
    }
    case 'consentimiento':
      return form.consentimientoDatos === true
    case 'cierre':
      return true
    default:
      return false
  }
}
