import StepHeader from '../StepHeader'
import { NumberField, TextArea, RadioGroup } from '../fields'
import { ingresosOpts } from '@/data/calificationForm'
import type { FormState, IngresosRango } from '../types'

type Props = {
  form: FormState
  update: (patch: Partial<FormState>) => void
}

export default function Step02PerfilPersonal({ form, update }: Props) {
  const edadError =
    form.edad !== null && (form.edad < 18 || form.edad > 90)
      ? 'Debe ser mayor de edad (entre 18 y 90 años).'
      : undefined

  return (
    <>
      <StepHeader
        eyebrow="Paso 2 — Perfil personal"
        title={<>Cuénteme un poco sobre usted.</>}
      />

      <NumberField
        label="¿Cuál es su edad?"
        name="edad"
        value={form.edad}
        onChange={v => update({ edad: v })}
        min={18}
        max={90}
        helper="Debe ser mayor de edad para invertir."
        invalid={Boolean(edadError)}
        error={edadError}
      />

      <TextArea
        label="¿A qué se dedica actualmente?"
        name="profesion"
        value={form.profesion}
        onChange={v => update({ profesion: v })}
        helper="Profesión, ocupación o actividad principal."
        rows={3}
      />

      <RadioGroup<IngresosRango>
        legend="¿En cuál grupo de ingresos mensuales se encuentra actualmente?"
        name="ingresos"
        options={ingresosOpts as ReadonlyArray<{ value: IngresosRango; label: string }>}
        value={form.ingresos}
        onChange={v => update({ ingresos: v })}
      />
    </>
  )
}
