import StepHeader, { Em } from '../StepHeader'
import { RadioGroup } from '../fields'
import { solvenciaOpts } from '@/data/calificationForm'
import type { FormState, Solvencia } from '../types'

type Props = {
  form: FormState
  update: (patch: Partial<FormState>) => void
}

export default function Step03Solvencia({ form, update }: Props) {
  return (
    <>
      <StepHeader
        eyebrow="Paso 3 — Situación financiera"
        title={<>La base de toda inversión es tener <Em>solvencia.</Em></>}
      />
      <RadioGroup<Solvencia>
        legend="Para iniciar a invertir es importante tener solvencia (gastar menos de lo que se gana al mes). ¿Considera que tiene esa solvencia hoy?"
        name="solvencia"
        options={solvenciaOpts as ReadonlyArray<{ value: Solvencia; label: string }>}
        value={form.solvencia}
        onChange={v => update({ solvencia: v })}
      />
    </>
  )
}
