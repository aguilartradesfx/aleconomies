// Lista de países (LATAM + España + USA) para el selector de teléfono.
// Default Costa Rica. El orden es relevancia para el target del sitio.
// Cuidado: USA y Rep. Dominicana comparten prefijo +1, pero ISO-2 es distinto.

export interface Country {
  /** ISO-3166-1 alpha-2 */
  code: string
  name: string
  /** Con + y solo dígitos. Ej: '+506'. */
  prefix: string
  /** Emoji bandera. */
  flag: string
}

export const COUNTRIES: Country[] = [
  { code: 'CR', name: 'Costa Rica',       prefix: '+506', flag: '🇨🇷' },
  { code: 'US', name: 'Estados Unidos',   prefix: '+1',   flag: '🇺🇸' },
  { code: 'MX', name: 'México',           prefix: '+52',  flag: '🇲🇽' },
  { code: 'CO', name: 'Colombia',         prefix: '+57',  flag: '🇨🇴' },
  { code: 'AR', name: 'Argentina',        prefix: '+54',  flag: '🇦🇷' },
  { code: 'CL', name: 'Chile',            prefix: '+56',  flag: '🇨🇱' },
  { code: 'PE', name: 'Perú',             prefix: '+51',  flag: '🇵🇪' },
  { code: 'EC', name: 'Ecuador',          prefix: '+593', flag: '🇪🇨' },
  { code: 'UY', name: 'Uruguay',          prefix: '+598', flag: '🇺🇾' },
  { code: 'PY', name: 'Paraguay',         prefix: '+595', flag: '🇵🇾' },
  { code: 'BO', name: 'Bolivia',          prefix: '+591', flag: '🇧🇴' },
  { code: 'VE', name: 'Venezuela',        prefix: '+58',  flag: '🇻🇪' },
  { code: 'PA', name: 'Panamá',           prefix: '+507', flag: '🇵🇦' },
  { code: 'GT', name: 'Guatemala',        prefix: '+502', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras',         prefix: '+504', flag: '🇭🇳' },
  { code: 'SV', name: 'El Salvador',      prefix: '+503', flag: '🇸🇻' },
  { code: 'NI', name: 'Nicaragua',        prefix: '+505', flag: '🇳🇮' },
  { code: 'DO', name: 'Rep. Dominicana',  prefix: '+1',   flag: '🇩🇴' },
  { code: 'PR', name: 'Puerto Rico',      prefix: '+1',   flag: '🇵🇷' },
  { code: 'ES', name: 'España',           prefix: '+34',  flag: '🇪🇸' },
  { code: 'CA', name: 'Canadá',           prefix: '+1',   flag: '🇨🇦' },
]

export const DEFAULT_COUNTRY_CODE = 'CR'

export function getCountry(code: string): Country {
  return COUNTRIES.find(c => c.code === code) ?? COUNTRIES[0]
}

/**
 * Construye un número en formato E.164 a partir del número local (solo dígitos
 * o con espacios/guiones) y el código de país ISO-2. Retorna '' si no hay dígitos.
 */
export function buildE164(localValue: string, countryCode: string): string {
  const digits = localValue.replace(/\D/g, '')
  if (!digits) return ''
  return `${getCountry(countryCode).prefix}${digits}`
}

/**
 * Intenta parsear un E.164 (ej: '+50688887777') a { countryCode, localValue }.
 * Hace match por prefijo más largo primero (para no confundir +506 con +50, etc).
 * Si no hay match, retorna countryCode = '' y localValue con dígitos.
 */
export function parseE164(e164: string): { countryCode: string; localValue: string } {
  const clean = (e164 || '').trim()
  if (!clean.startsWith('+')) {
    return { countryCode: '', localValue: clean.replace(/\D/g, '') }
  }
  // Ordenamos por largo descendente para que '+506' gane sobre '+5'.
  const byLen = [...COUNTRIES].sort((a, b) => b.prefix.length - a.prefix.length)
  for (const c of byLen) {
    if (clean.startsWith(c.prefix)) {
      return { countryCode: c.code, localValue: clean.slice(c.prefix.length) }
    }
  }
  return { countryCode: '', localValue: clean.replace(/\D/g, '') }
}
