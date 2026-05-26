import { AnimatePresence, motion } from 'framer-motion'
import StepHeader, { Em } from '../StepHeader'
import { RadioGroup } from '../fields'
import {
  capitalDisponibleOpts,
  rangoCapitalOpts,
  garantiasOpts,
} from '@/data/calificationForm'
import type {
  FormState,
  CapitalDisponible,
  RangoCapital,
  Garantias,
} from '../types'

type Props = {
  form: FormState
  update: (patch: Partial<FormState>) => void
}

export default function Step09Capital({ form, update }: Props) {
  const showRango = form.capitalDisponible === 'A'

  return (
    <>
      <StepHeader
        eyebrow="Paso 9 — Capital"
        title={<>Su <Em>punto de partida.</Em></>}
      />

      <RadioGroup<CapitalDisponible>
        legend="¿Dispone actualmente de dinero para invertir o desea empezar desde cero?"
        name="capitalDisponible"
        options={capitalDisponibleOpts as ReadonlyArray<{ value: CapitalDisponible; label: string }>}
        value={form.capitalDisponible}
        onChange={v => {
          if (v === 'B') update({ capitalDisponible: v, rangoCapital: null })
          else update({ capitalDisponible: v })
        }}
      />

      <AnimatePresence initial={false}>
        {showRango && (
          <motion.div
            key="rango"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: 8 }}>
              <RadioGroup<RangoCapital>
                legend="¿Aproximadamente cuánto capital tiene disponible para iniciar a invertir?"
                name="rangoCapital"
                options={rangoCapitalOpts as ReadonlyArray<{ value: RangoCapital; label: string }>}
                value={form.rangoCapital}
                onChange={v => update({ rangoCapital: v })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <RadioGroup<Garantias>
        legend="¿Tiene algún respaldo o garantía para su dinero (pólizas, fondos garantizados, seguros, etc.)?"
        name="garantias"
        options={garantiasOpts as ReadonlyArray<{ value: Garantias; label: string }>}
        value={form.garantias}
        onChange={v => update({ garantias: v })}
      />
    </>
  )
}
