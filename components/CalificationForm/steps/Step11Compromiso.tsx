import { AnimatePresence, motion } from 'framer-motion'
import StepHeader, { Em } from '../StepHeader'
import { RadioGroup } from '../fields'
import { compromisoOpts, aporteMinimoOpts } from '@/data/calificationForm'
import type { FormState, Compromiso } from '../types'

type Props = {
  form: FormState
  update: (patch: Partial<FormState>) => void
}

export default function Step11Compromiso({ form, update }: Props) {
  const showAporte = form.compromiso === 'A'

  return (
    <>
      <StepHeader
        eyebrow="Paso 11 — Compromiso"
        title={<>Dos <Em>compromisos</Em> importantes.</>}
      />

      <div className="calif-helper-block">
        Mi asesoría tiene un costo único de <strong>$97 USD</strong> (~₡50.000) e
        incluye el plan personalizado y acompañamiento vitalicio. No hay
        mensualidades ni renovaciones.
      </div>

      <RadioGroup<Compromiso>
        legend="¿Puede cubrir ese monto?"
        name="compromiso"
        options={compromisoOpts as ReadonlyArray<{ value: Compromiso; label: string }>}
        value={form.compromiso}
        onChange={v => {
          // Si cambia a B, colapsamos y reseteamos aporteMinimo.
          if (v === 'B') update({ compromiso: v, aporteMinimo: null })
          else update({ compromiso: v })
        }}
      />

      <AnimatePresence initial={false}>
        {showAporte && (
          <motion.div
            key="aporte"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: 16 }}>
              <div className="calif-helper-block">
                Además del costo de la asesoría, para que el plan funcione necesita
                poder destinar al menos <strong>₡25.000 mensuales</strong> (~$50 USD)
                a inversión.
                <br /><br />
                Si puede aportar ese mínimo, encaja con cualquiera de mis productos.
                Si no, hoy ningún producto es viable y prefiero ser honesto antes
                que arrancarlo a la fuerza.
              </div>

              <RadioGroup<Compromiso>
                legend="¿Puede comprometerse con el aporte mínimo?"
                name="aporteMinimo"
                options={aporteMinimoOpts as ReadonlyArray<{ value: Compromiso; label: string }>}
                value={form.aporteMinimo}
                onChange={v => update({ aporteMinimo: v })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
