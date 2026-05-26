import { AnimatePresence, motion } from 'framer-motion'
import StepHeader, { Em } from '../StepHeader'
import { RadioGroup } from '../fields'
import {
  fondoEmergenciaOpts,
  ahorroOpts,
  montoAhorroOpts,
} from '@/data/calificationForm'
import type { FormState, FondoEmergencia, Ahorro, MontoAhorro } from '../types'

type Props = {
  form: FormState
  update: (patch: Partial<FormState>) => void
}

export default function Step05Ahorro({ form, update }: Props) {
  const showMonto = form.ahorro === 'A' || form.ahorro === 'B'

  return (
    <>
      <StepHeader
        eyebrow="Paso 5 — Hábitos financieros"
        title={<>Sus <Em>cimientos</Em> financieros.</>}
      />

      <RadioGroup<FondoEmergencia>
        legend="¿Cuenta con un fondo de emergencia que cubra al menos de 3 a 6 meses de gastos?"
        name="fondoEmergencia"
        options={fondoEmergenciaOpts as ReadonlyArray<{ value: FondoEmergencia; label: string }>}
        value={form.fondoEmergencia}
        onChange={v => update({ fondoEmergencia: v })}
      />

      <RadioGroup<Ahorro>
        legend="¿Acostumbra ahorrar regularmente?"
        name="ahorro"
        options={ahorroOpts as ReadonlyArray<{ value: Ahorro; label: string }>}
        value={form.ahorro}
        onChange={v => {
          if (v === 'C') update({ ahorro: v, montoAhorro: null })
          else update({ ahorro: v })
        }}
      />

      <AnimatePresence initial={false}>
        {showMonto && (
          <motion.div
            key="monto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: 8 }}>
              <RadioGroup<MontoAhorro>
                legend="¿Cuánto dinero acostumbra ahorrar mes a mes?"
                name="montoAhorro"
                options={montoAhorroOpts as ReadonlyArray<{ value: MontoAhorro; label: string }>}
                value={form.montoAhorro}
                onChange={v => update({ montoAhorro: v })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
