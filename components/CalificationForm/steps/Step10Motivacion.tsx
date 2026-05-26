import StepHeader, { Em } from '../StepHeader'
import { TextArea } from '../fields'
import type { FormState } from '../types'

type Props = {
  form: FormState
  update: (patch: Partial<FormState>) => void
}

export default function Step10Motivacion({ form, update }: Props) {
  return (
    <>
      <StepHeader
        eyebrow="Paso 10 — Motivación"
        title={<>Cuénteme su <Em>porqué.</Em></>}
      />
      <TextArea
        label="¿Cuáles son las razones por las cuales le interesa aprovechar esta oportunidad?"
        name="razones"
        value={form.razones}
        onChange={v => update({ razones: v })}
        helper="Esto me ayuda a entender su motivación. Sea lo más específico posible."
        minChars={50}
        large
      />
    </>
  )
}
