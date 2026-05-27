import { useId } from 'react'
import StepHeader, { Em } from '../StepHeader'
import { TextField } from '../fields'
import PhoneInput from '@/components/ui/PhoneInput'
import type { FormState } from '../types'

type Props = {
  form: FormState
  update: (patch: Partial<FormState>) => void
}

export default function Step01Contacto({ form, update }: Props) {
  const phoneId = useId()
  return (
    <>
      <StepHeader
        eyebrow="Paso 1 — Antes de empezar"
        title={<>Hola, soy <Em>Alejandro.</Em> Antes de iniciar me gustaría que nos conociéramos un poco.</>}
      />
      <TextField
        label="Nombre"
        name="nombre"
        value={form.nombre}
        onChange={v => update({ nombre: v })}
        placeholder="Su nombre"
        autoComplete="given-name"
        autoFocus
      />
      <TextField
        label="Apellidos"
        name="apellidos"
        value={form.apellidos}
        onChange={v => update({ apellidos: v })}
        placeholder="Sus apellidos"
        autoComplete="family-name"
      />
      <div className="calif-field">
        <label htmlFor={phoneId} className="calif-label">Número de teléfono</label>
        <PhoneInput
          id={phoneId}
          value={form.telefono}
          onChange={v => update({ telefono: v })}
          placeholder="8888 8888"
        />
      </div>
      <TextField
        label="Correo electrónico"
        name="correo"
        type="email"
        inputMode="email"
        value={form.correo}
        onChange={v => update({ correo: v })}
        placeholder="usted@ejemplo.com"
        autoComplete="email"
      />
      <p className="calif-data-notice">
        Sus datos se tratan conforme a la Ley 8968 de Protección de Datos Personales
        de Costa Rica. No los compartimos con terceros.
      </p>
    </>
  )
}
