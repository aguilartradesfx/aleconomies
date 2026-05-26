// Mapeo del FormState (códigos A/B/C/D del form) → custom fields de GoHighLevel.
//
// GHL valida los SINGLE_OPTIONS / MULTIPLE_OPTIONS contra el texto EXACTO
// de las picklistOptions del campo. Si el label no calza 1:1, el valor
// se descarta silenciosamente. Por eso cada map de aquí abajo debe
// coincidir con `picklistOptions` del campo en GHL.
//
// IDs y opciones se obtuvieron con el MCP de GHL (locations_get-custom-fields)
// sobre la sub-cuenta locationId=quAPDDnB8ZH3pZghUkCa.

import type { FormState } from '@/components/CalificationForm/types'
import type { CalificationResult } from '@/lib/calificationLogic'

export const FIELD_IDS = {
  edad:                 '2CMOYKJh5pVGHMGDPgzc',
  profesion:            'rxBHKt12GuLUr8u2cJ4m',
  ingresos:             '4ckBmJdTSuId6SplIRqx',
  solvencia:            'JFRbsXQhNZy8yR9Qqc7W',
  deudas:               'x9vtvmS03rT1n3OXtxgI',
  deudaPct:             'JlzhVBpCe4AsXxbvnxZy',
  fondoEmergencia:      'OMPJnDl26S0jlmBLpBCJ',
  ahorro:               'E7LIZqh9ToVRusvgiT2s',
  montoAhorro:          'Lsf744Y0dwGvhVdZMpv7',
  experienciaInversion: 'JcfMCxUfVj4DnFmSmlLp',
  nivelConocimiento:    'fjyd1Op41Hh47TCRFGJI',
  instrumentos:         '5XBnUDVDgAMD1rWzymn5',
  instrumentosOtros:    'ZyOadmnLQqSEiJJKtsmV',
  perfilInversor:       'eIKvL19IEAekZc4kuPws',
  tolerancia:           'PN7ckhV9Cg1ipfN0I5ZP',
  horizonte:            'UY2bRPBexhHICZHHJyYy',
  administracion:       '1oLRORSwm7LPo1ErV3mg',
  objetivos:            'PcWrmCm6GQCBnhIhKCh4',
  capitalDisponible:    'hSiM0ajUVoNppyqmjFh2',
  rangoCapital:         'eufpHw7kZdjbTMyIvlcZ',
  garantias:            'eHdG1cCYwjBGtOk9SmOQ',
  razones:              'xaDOBhey6oFLK4zCCeIm',
  compromisoPago:       'EP4OomyVrN2sQVKUPwCi',
  aporteMinimo:         'xH0L31Doaa1m1mc9BmLZ',
  decision:             'itCAGofzsjYh2XJ1X2Oy',
  decisorNombre:        'AQHIpXTSQDHKoXu67ayJ',
  decisorRelacion:      'Nx30rzqXo5DuNGbyl8y3',
  etiquetaLead:         'VLbYHi4GCLkdTN6gsGWC',
  cierre:               '0P1th9NwPQjAYpFj9ma6',
  motivos:              'WNGHU71pik79aZfJPgrT',
} as const

// ── Maps código del form → label exacto de la picklist en GHL ─────────────

const siNo = { A: 'Sí', B: 'No' } as const

const ingresosMap = {
  A: 'Menos de $1.500 USD',
  B: 'Entre $1.500 y $3.000 USD',
  C: 'Entre $3.001 y $6.000 USD',
  D: 'Entre $6.001 y $10.000 USD',
  E: 'Entre $10.001 y $20.000 USD',
  F: 'Más de $20.000 USD',
} as const

const solvenciaMap = {
  A: 'Sí, tengo la solvencia económica',
  B: 'No, necesito aprender y mejorar',
} as const

const deudasMap = {
  A: 'No tengo deudas',
  B: 'Deudas controladas',
  C: 'Deudas no controladas',
} as const

const deudaPctMap = {
  A: 'Menos del 35%',
  B: 'Entre el 35% y el 50%',
  C: 'Más del 50%',
} as const

const ahorroMap = {
  A: 'Ahorra regularmente',
  B: 'Ahorra ocasionalmente',
  C: 'No ahorra',
} as const

const montoAhorroMap = {
  A: 'Menos de $100',
  B: 'Entre $100 y $500',
  C: 'Entre $500 y $1.000',
  D: 'Más de $1.000',
} as const

const nivelConocimientoMap = {
  A: 'Básico',
  B: 'Intermedio',
  C: 'Avanzado',
  Nulo: 'Nulo',
} as const

const perfilInversorMap = {
  A: 'Invierte con buenos rendimientos',
  B: 'Invierte con rendimientos bajos',
  C: 'Ahorra y quiere invertir',
  D: 'No ahorra, quiere ordenarse',
  E: 'Necesita ordenarse para salir de deudas',
} as const

const toleranciaMap = { A: 'Baja', B: 'Moderada', C: 'Alta' } as const

const horizonteMap = {
  A: 'Corto plazo',
  B: 'Mediano plazo',
  C: 'Largo plazo',
  D: 'Diversificación en plazos',
} as const

const administracionMap = { A: 'Activa', B: 'Pasiva', C: 'Combinación' } as const

const capitalDisponibleMap = { A: 'Sí', B: 'Empezar desde cero' } as const

const rangoCapitalMap = {
  A: 'Menos de $5.000 USD',
  B: 'Entre $5.000 y $25.000 USD',
  C: 'Entre $25.001 y $100.000 USD',
  D: 'Más de $100.000 USD',
} as const

const decisionMap = {
  A: 'Consulta con otra persona',
  B: 'Decisión propia',
} as const

// Objetivos: slugs del form → labels de GHL
const objetivosMap: Record<string, string> = {
  retiro:          'Plan de retiro',
  vehiculo:        'Compra de vehículo',
  casa:            'Compra de casa',
  capital:         'Crear mayor capital',
  herencia:        'Herencia/patrimonio',
  ingreso_pasivo:  'Ingreso pasivo',
  diversificacion: 'Diversificación de portafolio',
}

// Instrumentos: el form guarda el label visible (con espacios alrededor de "/"),
// GHL los tiene sin espacios → normalizar.
const instrumentosMap: Record<string, string> = {
  'Acciones':                  'Acciones',
  'ETFs / Fondos indexados':   'ETFs/Fondos indexados',
  'Bienes raíces':             'Bienes raíces',
  'Criptomonedas':             'Criptomonedas',
  'Fondos mutuos / Inversión': 'Fondos mutuos/Inversión',
  'Bonos':                     'Bonos',
  'Otros':                     'Otros',
}

// ── Payload builder ────────────────────────────────────────────────────────

export interface GHLCustomField {
  id: string
  field_value: string | number | string[]
}

export function mapFormToCustomFields(
  form: FormState,
  resultado: CalificationResult
): GHLCustomField[] {
  const out: GHLCustomField[] = []

  const push = (id: string, value: string | number | string[] | null | undefined) => {
    if (value === null || value === undefined) return
    if (typeof value === 'string' && value.trim() === '') return
    if (Array.isArray(value) && value.length === 0) return
    out.push({ id, field_value: value })
  }

  push(FIELD_IDS.edad,             form.edad)
  push(FIELD_IDS.profesion,        form.profesion)
  push(FIELD_IDS.ingresos,         form.ingresos        && ingresosMap[form.ingresos])
  push(FIELD_IDS.solvencia,        form.solvencia       && solvenciaMap[form.solvencia])
  push(FIELD_IDS.deudas,           form.deudas          && deudasMap[form.deudas])
  push(FIELD_IDS.deudaPct,         form.deudaPct        && deudaPctMap[form.deudaPct])
  push(FIELD_IDS.fondoEmergencia,  form.fondoEmergencia && siNo[form.fondoEmergencia])
  push(FIELD_IDS.ahorro,           form.ahorro          && ahorroMap[form.ahorro])
  push(FIELD_IDS.montoAhorro,      form.montoAhorro     && montoAhorroMap[form.montoAhorro])
  push(FIELD_IDS.experienciaInversion, form.experienciaInversion && siNo[form.experienciaInversion])
  push(FIELD_IDS.nivelConocimiento,    form.nivelConocimiento    && nivelConocimientoMap[form.nivelConocimiento])

  const instrumentos = form.instrumentos
    .map(i => instrumentosMap[i])
    .filter((v): v is string => Boolean(v))
  push(FIELD_IDS.instrumentos, instrumentos)
  push(FIELD_IDS.instrumentosOtros, form.instrumentoOtro)

  push(FIELD_IDS.perfilInversor,  form.perfilInversor  && perfilInversorMap[form.perfilInversor])
  push(FIELD_IDS.tolerancia,      form.tolerancia      && toleranciaMap[form.tolerancia])
  push(FIELD_IDS.horizonte,       form.horizonte       && horizonteMap[form.horizonte])
  push(FIELD_IDS.administracion,  form.administracion  && administracionMap[form.administracion])

  const objetivos = form.objetivos
    .map(o => objetivosMap[o])
    .filter((v): v is string => Boolean(v))
  push(FIELD_IDS.objetivos, objetivos)

  push(FIELD_IDS.capitalDisponible, form.capitalDisponible && capitalDisponibleMap[form.capitalDisponible])
  push(FIELD_IDS.rangoCapital,      form.rangoCapital      && rangoCapitalMap[form.rangoCapital])
  push(FIELD_IDS.garantias,         form.garantias         && siNo[form.garantias])
  push(FIELD_IDS.razones,           form.razones)
  push(FIELD_IDS.compromisoPago,    form.compromiso        && siNo[form.compromiso])
  push(FIELD_IDS.aporteMinimo,      form.aporteMinimo      && siNo[form.aporteMinimo])
  push(FIELD_IDS.decision,          form.decision          && decisionMap[form.decision])

  // Si la relación es "Otro" y hay texto libre, lo concatenamos al nombre
  // para no perderlo (GHL no acepta valores fuera del picklist).
  const decisorNombre =
    form.decisorRelacion === 'Otro' && form.decisorRelacionOtro
      ? `${form.decisorNombre} (${form.decisorRelacionOtro})`
      : form.decisorNombre
  push(FIELD_IDS.decisorNombre,    decisorNombre)
  push(FIELD_IDS.decisorRelacion,  form.decisorRelacion)

  push(FIELD_IDS.etiquetaLead, resultado.etiqueta)
  push(FIELD_IDS.cierre,       resultado.cierre)
  push(FIELD_IDS.motivos,      resultado.motivos.join(' · '))

  return out
}
