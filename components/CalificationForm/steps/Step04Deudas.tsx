import { AnimatePresence, motion } from 'framer-motion'
import StepHeader, { Em } from '../StepHeader'
import { RadioGroup } from '../fields'
import { deudasOpts, deudaPctOpts } from '@/data/calificationForm'
import type { FormState, Deudas, DeudaPct } from '../types'

type Props = {
  form: FormState
  update: (patch: Partial<FormState>) => void
}

export default function Step04Deudas({ form, update }: Props) {
  const showPct = form.deudas === 'C'

  return (
    <>
      <StepHeader
        eyebrow="Paso 4 — Situación financiera"
        title={<>Hablemos de <Em>deudas.</Em></>}
      />
      <RadioGroup<Deudas>
        legend="¿Tiene usted alguna deuda?"
        name="deudas"
        options={deudasOpts as ReadonlyArray<{ value: Deudas; label: string }>}
        value={form.deudas}
        onChange={v => {
          update(v === 'C' ? { deudas: v } : { deudas: v, deudaPct: null })
        }}
      />

      <AnimatePresence initial={false}>
        {showPct && (
          <motion.div
            key="pct"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: 8 }}>
              <RadioGroup<DeudaPct>
                legend="¿Aproximadamente qué porcentaje de su salario mensual está comprometido en deudas?"
                name="deudaPct"
                options={deudaPctOpts as ReadonlyArray<{ value: DeudaPct; label: string }>}
                value={form.deudaPct}
                onChange={v => update({ deudaPct: v })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
