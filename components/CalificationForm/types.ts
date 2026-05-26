// Tipos del formulario de calificación de leads.
// Las letras (A/B/C/...) son etiquetas estables que se envían al CRM —
// no las cambie sin coordinar con la lógica de scoring.

export type IngresosRango = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
export type Solvencia = 'A' | 'B'
export type Deudas = 'A' | 'B' | 'C'
export type DeudaPct = 'A' | 'B' | 'C'
export type FondoEmergencia = 'A' | 'B'
export type Ahorro = 'A' | 'B' | 'C'
export type MontoAhorro = 'A' | 'B' | 'C' | 'D'
export type ExperienciaInversion = 'A' | 'B'
export type NivelConocimiento = 'A' | 'B' | 'C' | 'Nulo'
export type Tolerancia = 'A' | 'B' | 'C'
export type Horizonte = 'A' | 'B' | 'C' | 'D'
export type Administracion = 'A' | 'B' | 'C'
export type CapitalDisponible = 'A' | 'B'
export type RangoCapital = 'A' | 'B' | 'C' | 'D'
export type Garantias = 'A' | 'B'
export type Compromiso = 'A' | 'B'
export type Decision = 'A' | 'B'
export type PerfilInversor = 'A' | 'B' | 'C' | 'D' | 'E'
export type RelacionDecisor = 'Pareja' | 'Socio' | 'Familiar' | 'Otro'

export interface FormState {
  // Sección 1 — Contacto
  nombre: string
  apellidos: string
  telefono: string
  correo: string

  // Sección 2 — Perfil Personal
  edad: number | null
  profesion: string
  ingresos: IngresosRango | null

  // Sección 3 — Situación Financiera
  solvencia: Solvencia | null
  deudas: Deudas | null
  deudaPct: DeudaPct | null
  fondoEmergencia: FondoEmergencia | null
  ahorro: Ahorro | null
  montoAhorro: MontoAhorro | null

  // Sección 4 — Perfil de Inversor
  experienciaInversion: ExperienciaInversion | null
  nivelConocimiento: NivelConocimiento | null
  instrumentos: string[]
  instrumentoOtro: string
  perfilInversor: PerfilInversor | null
  tolerancia: Tolerancia | null
  horizonte: Horizonte | null
  administracion: Administracion | null

  // Sección 5 — Objetivos y Motivación
  objetivos: string[]
  capitalDisponible: CapitalDisponible | null
  rangoCapital: RangoCapital | null
  garantias: Garantias | null
  razones: string

  // Sección 6 — Compromiso y Decisión
  compromiso: Compromiso | null
  aporteMinimo: Compromiso | null
  decision: Decision | null
  decisorNombre: string
  decisorRelacion: RelacionDecisor | null
  decisorRelacionOtro: string
  decisorConfirmado: boolean

  // Consentimiento Ley 8968
  consentimientoDatos: boolean
}

export type LeadEtiqueta =
  | 'CALIFICADO_ALTO'
  | 'CALIFICADO_MEDIO'
  | 'NO_CALIFICADO_HOY'
  | 'TRACK_EDUCATIVO'

export type CierreTipo = 'agendar_llamada' | 'cierre_educativo'

// Identificadores estables de pasos visibles.
// El orden + visibilidad real se calcula en getVisibleSteps() según el estado.
export type StepId =
  | 'contacto'
  | 'perfilPersonal'
  | 'solvencia'
  | 'deudas'
  | 'ahorro'
  | 'experiencia'
  | 'perfilInversor'
  | 'objetivos'
  | 'capital'
  | 'motivacion'
  | 'compromiso'
  | 'decision'
  | 'consentimiento'
  | 'cierre'

export const INITIAL_FORM_STATE: FormState = {
  nombre: '',
  apellidos: '',
  telefono: '',
  correo: '',
  edad: null,
  profesion: '',
  ingresos: null,
  solvencia: null,
  deudas: null,
  deudaPct: null,
  fondoEmergencia: null,
  ahorro: null,
  montoAhorro: null,
  experienciaInversion: null,
  nivelConocimiento: null,
  instrumentos: [],
  instrumentoOtro: '',
  perfilInversor: null,
  tolerancia: null,
  horizonte: null,
  administracion: null,
  objetivos: [],
  capitalDisponible: null,
  rangoCapital: null,
  garantias: null,
  razones: '',
  compromiso: null,
  aporteMinimo: null,
  decision: null,
  decisorNombre: '',
  decisorRelacion: null,
  decisorRelacionOtro: '',
  decisorConfirmado: false,
  consentimientoDatos: false,
}
