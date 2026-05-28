import StepHeader, { Em } from '../StepHeader'
import { ConsentCheckbox } from '../fields'
import type { FormState } from '../types'

type Props = {
  form: FormState
  update: (patch: Partial<FormState>) => void
}

export default function StepConsentimiento({ form, update }: Props) {
  return (
    <>
      <StepHeader
        eyebrow="Paso final — Consentimiento"
        title={<>Antes de <Em>enviar.</Em></>}
      />
      <div className="calif-helper-block" style={{ marginBottom: 18 }}>
        <strong>Consentimiento de tratamiento de datos personales (Ley 8968 de Costa Rica)</strong>
        <br /><br />
        Autorizo a Alejandro Araya y a Aleconomies a tratar los datos personales
        proporcionados en este formulario con el fin de evaluar mi perfil,
        contactarme y, en su caso, brindarme servicios de asesoría financiera.
        Entiendo que puedo solicitar acceso, rectificación o eliminación de mis
        datos en cualquier momento escribiendo a info@aleconomies.com.
      </div>

      <ConsentCheckbox
        checked={form.consentimientoDatos}
        onChange={v => update({ consentimientoDatos: v })}
        name="consentimientoDatos"
      >
        <strong>Acepto el tratamiento de mis datos personales.</strong>
      </ConsentCheckbox>
    </>
  )
}
