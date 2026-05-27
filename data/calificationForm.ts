// Copy y opciones del formulario de calificación.
// Centralizar aquí permite ajustes editoriales sin tocar componentes.

export type RadioOption<V extends string = string> = {
  value: V
  label: string
  desc?: string
}

export const ingresosOpts: RadioOption[] = [
  { value: 'A', label: 'Menos de $1.500 USD' },
  { value: 'B', label: 'Entre $1.500 y $3.000 USD' },
  { value: 'C', label: 'Entre $3.001 y $6.000 USD' },
  { value: 'D', label: 'Entre $6.001 y $10.000 USD' },
  { value: 'E', label: 'Entre $10.001 y $20.000 USD' },
  { value: 'F', label: 'Más de $20.000 USD' },
]

export const solvenciaOpts: RadioOption[] = [
  { value: 'A', label: 'Sí, tengo la solvencia económica' },
  { value: 'B', label: 'No, necesito aprender y mejorar mi situación financiera' },
]

export const deudasOpts: RadioOption[] = [
  { value: 'A', label: 'No tengo deudas' },
  { value: 'B', label: 'Tengo deudas controladas' },
  { value: 'C', label: 'Tengo deudas no tan controladas y esto podría afectarme para invertir' },
]

export const deudaPctOpts: RadioOption[] = [
  { value: 'A', label: 'Menos del 35%' },
  { value: 'B', label: 'Entre el 35% y el 50%' },
  { value: 'C', label: 'Más del 50%' },
]

export const fondoEmergenciaOpts: RadioOption[] = [
  { value: 'A', label: 'Sí' },
  { value: 'B', label: 'No' },
]

export const ahorroOpts: RadioOption[] = [
  { value: 'A', label: 'Sí, tengo el hábito de ahorrar regularmente' },
  { value: 'B', label: 'Ahorro ocasionalmente' },
  { value: 'C', label: 'No, no acostumbro a ahorrar' },
]

export const montoAhorroOpts: RadioOption[] = [
  { value: 'A', label: 'Menos de $100' },
  { value: 'B', label: 'Entre $100 y $500' },
  { value: 'C', label: 'Entre $500 y $1.000' },
  { value: 'D', label: 'Más de $1.000' },
]

export const experienciaInversionOpts: RadioOption[] = [
  { value: 'A', label: 'Sí' },
  { value: 'B', label: 'No' },
]

export const nivelConocimientoOpts: RadioOption[] = [
  { value: 'A', label: 'Básico' },
  { value: 'B', label: 'Intermedio' },
  { value: 'C', label: 'Avanzado' },
]

export const instrumentosOpts: string[] = [
  'Todos',
  'Acciones',
  'ETFs / Fondos indexados',
  'Bienes raíces',
  'Criptomonedas',
  'Fondos mutuos / Inversión',
  'Bonos',
  'Otros',
]

export const perfilInversorOpts: RadioOption[] = [
  { value: 'A', label: 'Ya estoy invirtiendo con buenos rendimientos, pero quiero conocer más opciones para diversificar mi portafolio' },
  { value: 'B', label: 'Ya estoy invirtiendo, pero los rendimientos son bajos' },
  { value: 'C', label: 'Estoy ahorrando, pero quiero empezar a invertir' },
  { value: 'D', label: 'Actualmente no estoy ahorrando, pero quiero ordenarme financieramente y aprender a invertir' },
  { value: 'E', label: 'Necesito ordenarme financieramente para salir de deudas' },
]

export const toleranciaOpts: RadioOption[] = [
  { value: 'A', label: 'Baja — prefiero inversiones seguras aunque los rendimientos sean conservadores' },
  { value: 'B', label: 'Moderada — dispuesto/a a asumir ciertos riesgos para obtener rendimientos moderados' },
  { value: 'C', label: 'Alta — dispuesto/a a asumir riesgos significativos para obtener altos rendimientos' },
]

export const horizonteOpts: RadioOption[] = [
  { value: 'A', label: 'Corto plazo (1 a 12 meses)' },
  { value: 'B', label: 'Mediano plazo (1 a 5 años)' },
  { value: 'C', label: 'Largo plazo (más de 5 años)' },
  { value: 'D', label: 'Busco diversificación en plazos' },
]

export const administracionOpts: RadioOption[] = [
  { value: 'A', label: 'Administración activa (yo dedico tiempo)' },
  { value: 'B', label: 'Administración pasiva (delego al profesional)' },
  { value: 'C', label: 'Una combinación de ambas' },
]

export type ObjetivoOption = { value: string; label: string; icon: string }
export const objetivosOpts: ObjetivoOption[] = [
  { value: 'retiro',          label: 'Plan de retiro',                       icon: 'Armchair' },
  { value: 'vehiculo',        label: 'Compra de vehículo',                   icon: 'Car' },
  { value: 'casa',            label: 'Compra de casa',                       icon: 'Home' },
  { value: 'capital',         label: 'Crear mayor capital',                  icon: 'TrendingUp' },
  { value: 'herencia',        label: 'Herencia / patrimonio para la familia', icon: 'Users' },
  { value: 'ingreso_pasivo',  label: 'Tener un ingreso pasivo',              icon: 'PiggyBank' },
  { value: 'diversificacion', label: 'Diversificación de portafolio',        icon: 'PieChart' },
]

export const capitalDisponibleOpts: RadioOption[] = [
  { value: 'A', label: 'Sí, tengo dinero disponible para invertir' },
  { value: 'B', label: 'No, deseo empezar desde cero' },
]

export const rangoCapitalOpts: RadioOption[] = [
  { value: 'A', label: 'Menos de $5.000 USD' },
  { value: 'B', label: 'Entre $5.000 y $25.000 USD' },
  { value: 'C', label: 'Entre $25.001 y $100.000 USD' },
  { value: 'D', label: 'Más de $100.000 USD' },
]

export const garantiasOpts: RadioOption[] = [
  { value: 'A', label: 'Sí, tengo algún tipo de respaldo' },
  { value: 'B', label: 'No, no cuento con garantías o seguros' },
]

export const compromisoOpts: RadioOption[] = [
  { value: 'A', label: 'Sí, puedo cubrir ese monto' },
  { value: 'B', label: 'No puedo cubrirlo en este momento' },
]

export const aporteMinimoOpts: RadioOption[] = [
  { value: 'A', label: 'Sí, puedo comprometerme con al menos ₡25.000 mensuales' },
  { value: 'B', label: 'No, todavía no estoy en esa posición' },
]

export const decisionOpts: RadioOption[] = [
  { value: 'A', label: 'Cualquier decisión debo consultarla con pareja / familiar / socio' },
  { value: 'B', label: 'La decisión depende 100% de mí y no debo consultarlo con nadie más' },
]

export const decisorRelacionOpts: RadioOption[] = [
  { value: 'Pareja',    label: 'Pareja' },
  { value: 'Socio',     label: 'Socio' },
  { value: 'Familiar',  label: 'Familiar' },
  { value: 'Otro',      label: 'Otro' },
]
