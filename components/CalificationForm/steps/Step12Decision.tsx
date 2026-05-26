import { AnimatePresence, motion } from 'framer-motion'
import StepHeader, { Em } from '../StepHeader'
import { RadioGroup, TextField, ConsentCheckbox } from '../fields'
import { decisionOpts, decisorRelacionOpts } from '@/data/calificationForm'
import type { FormState, Decision, RelacionDecisor } from '../types'

type Props = {
  form: FormState
  update: (patch: Partial<FormState>) => void
}

export default function Step12Decision({ form, update }: Props) {
  const showDecisor = form.decision === 'A'
  const showOtro = showDecisor && form.decisorRelacion === 'Otro'

  return (
    <>
      <StepHeader
        eyebrow="Paso 12 — Toma de decisiones"
        title={<>Algunas decisiones se toman <Em>en conjunto.</Em></>}
      />

      <RadioGroup<Decision>
        legend="Sabemos y respetamos que algunas decisiones se toman en conjunto. Sobre la decisión de invertir en su educación financiera:"
        name="decision"
        options={decisionOpts as ReadonlyArray<{ value: Decision; label: string }>}
        value={form.decision}
        onChange={v => {
          if (v === 'B') {
            update({
              decision: v,
              decisorNombre: '',
              decisorRelacion: null,
              decisorRelacionOtro: '',
              decisorConfirmado: false,
            })
          } else {
            update({ decision: v })
          }
        }}
      />

      <AnimatePresence initial={false}>
        {showDecisor && (
          <motion.div
            key="decisor"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: 8 }}>
              <TextField
                label="Nombre completo de la persona con quien decide"
                name="decisorNombre"
                value={form.decisorNombre}
                onChange={v => update({ decisorNombre: v })}
                placeholder="Nombre y apellidos"
              />

              <RadioGroup<RelacionDecisor>
                legend="Relación con esa persona"
                name="decisorRelacion"
                options={decisorRelacionOpts as ReadonlyArray<{ value: RelacionDecisor; label: string }>}
                value={form.decisorRelacion}
                onChange={v => {
                  if (v !== 'Otro') update({ decisorRelacion: v, decisorRelacionOtro: '' })
                  else update({ decisorRelacion: v })
                }}
                grid
              />

              <AnimatePresence initial={false}>
                {showOtro && (
                  <motion.div
                    key="otro-relacion"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <TextField
                      label="Especifique la relación"
                      name="decisorRelacionOtro"
                      value={form.decisorRelacionOtro}
                      onChange={v => update({ decisorRelacionOtro: v })}
                      placeholder="Ej. Hermano, amigo, mentor…"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ marginTop: 12 }}>
                <ConsentCheckbox
                  checked={form.decisorConfirmado}
                  onChange={v => update({ decisorConfirmado: v })}
                  name="decisorConfirmado"
                >
                  Entiendo que esa persona debe estar presente en la llamada, de
                  lo contrario la sesión se reprogramará.
                </ConsentCheckbox>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
