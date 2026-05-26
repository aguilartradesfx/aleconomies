import StepHeader, { Em } from '../StepHeader'
import { RadioGroup } from '../fields'
import {
  perfilInversorOpts,
  toleranciaOpts,
  horizonteOpts,
  administracionOpts,
} from '@/data/calificationForm'
import type {
  FormState,
  PerfilInversor,
  Tolerancia,
  Horizonte,
  Administracion,
} from '../types'

type Props = {
  form: FormState
  update: (patch: Partial<FormState>) => void
}

export default function Step07PerfilInversor({ form, update }: Props) {
  return (
    <>
      <StepHeader
        eyebrow="Paso 7 — Su perfil"
        title={<>¿Dónde está usted <Em>hoy?</Em></>}
      />

      <RadioGroup<PerfilInversor>
        legend="¿Con cuál de las siguientes afirmaciones se identifica más?"
        name="perfilInversor"
        options={perfilInversorOpts as ReadonlyArray<{ value: PerfilInversor; label: string }>}
        value={form.perfilInversor}
        onChange={v => update({ perfilInversor: v })}
      />

      <RadioGroup<Tolerancia>
        legend="¿Cuál es su tolerancia al riesgo en las inversiones?"
        name="tolerancia"
        options={toleranciaOpts as ReadonlyArray<{ value: Tolerancia; label: string }>}
        value={form.tolerancia}
        onChange={v => update({ tolerancia: v })}
      />

      <RadioGroup<Horizonte>
        legend="¿Cuál es su horizonte de inversión?"
        name="horizonte"
        options={horizonteOpts as ReadonlyArray<{ value: Horizonte; label: string }>}
        value={form.horizonte}
        onChange={v => update({ horizonte: v })}
      />

      <RadioGroup<Administracion>
        legend="¿Qué prefiere: dedicar tiempo a investigar y monitorear sus inversiones, o delegarle esa responsabilidad a un profesional?"
        name="administracion"
        options={administracionOpts as ReadonlyArray<{ value: Administracion; label: string }>}
        value={form.administracion}
        onChange={v => update({ administracion: v })}
      />
    </>
  )
}
