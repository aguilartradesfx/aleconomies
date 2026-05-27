'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  COUNTRIES,
  DEFAULT_COUNTRY_CODE,
  buildE164,
  getCountry,
  parseE164,
} from '@/lib/phone'

interface Props {
  id?: string
  /**
   * Valor controlado: se acepta tanto un E.164 ('+50688887777') como un
   * número local sin prefijo. El componente parsea el E.164 en su primer
   * render para inicializar el país; después maneja el estado internamente.
   */
  value: string
  /** Llamado en cada cambio con el E.164 listo para enviar a la API. */
  onChange: (e164: string) => void
  placeholder?: string
  required?: boolean
  'aria-invalid'?: boolean
  className?: string
}

export default function PhoneInput({
  id,
  value,
  onChange,
  placeholder = 'Número de teléfono',
  required,
  className,
  ...aria
}: Props) {
  const initial = parseE164(value)
  const [countryCode, setCountryCode] = useState(initial.countryCode || DEFAULT_COUNTRY_CODE)
  const [local, setLocal] = useState(initial.localValue)

  const country = getCountry(countryCode)

  function emit(nextLocal: string, nextCc: string) {
    onChange(buildE164(nextLocal, nextCc))
  }

  return (
    <div className={`phone-input ${className ?? ''}`} aria-invalid={aria['aria-invalid']}>
      <label className="phone-input-country" aria-label="Código de país">
        <span className="phone-input-flag" aria-hidden="true">{country.flag}</span>
        <span className="phone-input-prefix">{country.prefix}</span>
        <ChevronDown size={12} className="phone-input-caret" aria-hidden="true" />
        <select
          className="phone-input-select"
          value={countryCode}
          onChange={e => {
            const cc = e.target.value
            setCountryCode(cc)
            emit(local, cc)
          }}
        >
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>
              {c.flag}  {c.name} ({c.prefix})
            </option>
          ))}
        </select>
      </label>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={local}
        onChange={e => {
          const next = e.target.value.replace(/[^\d\s-]/g, '')
          setLocal(next)
          emit(next, countryCode)
        }}
        placeholder={placeholder}
        required={required}
        className="phone-input-number"
      />
    </div>
  )
}
