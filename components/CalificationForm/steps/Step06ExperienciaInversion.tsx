import { AnimatePresence, motion } from 'framer-motion'
import StepHeader, { Em } from '../StepHeader'
import { RadioGroup, CheckboxGroup, TextField } from '../fields'
import {
  experienciaInversionOpts,
  nivelConocimientoOpts,
  instrumentosOpts,
} from '@/data/calificationForm'
import type { FormState, ExperienciaInversion, NivelConocimiento } from '../types'

type Props = {
  form: FormState
  update: (patch: Partial<FormState>) => void
}

export default function Step06ExperienciaInversion({ form, update }: Props) {
  const showNivel = form.experienciaInversion === 'A'
  const showInstrumentos = form.experienciaInversion === 'A' && form.nivelConocimiento === 'C'
  const showOtros = showInstrumentos && form.instrumentos.includes('Otros')

  const instrumentoOptions = instrumentosOpts.map(value => ({ value, label: value }))

  return (
    <>
      <StepHeader
        eyebrow="Paso 6 — Conocimiento"
        title={<>Su experiencia en <Em>inversiones.</Em></>}
      />

      <RadioGroup<ExperienciaInversion>
        legend="¿Tiene conocimiento o experiencia previa en el área de inversiones?"
        name="experienciaInversion"
        options={experienciaInversionOpts as ReadonlyArray<{ value: ExperienciaInversion; label: string }>}
        value={form.experienciaInversion}
        onChange={v => {
          if (v === 'B') {
            update({
              experienciaInversion: v,
              nivelConocimiento: 'Nulo',
              instrumentos: [],
              instrumentoOtro: '',
            })
          } else {
            update({
              experienciaInversion: v,
              nivelConocimiento: form.nivelConocimiento === 'Nulo' ? null : form.nivelConocimiento,
            })
          }
        }}
      />

      <AnimatePresence initial={false}>
        {showNivel && (
          <motion.div
            key="nivel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: 8 }}>
              <RadioGroup<Exclude<NivelConocimiento, 'Nulo'>>
                legend="¿Qué tan avanzado considera su conocimiento actual sobre inversiones?"
                name="nivelConocimiento"
                options={nivelConocimientoOpts as ReadonlyArray<{ value: Exclude<NivelConocimiento, 'Nulo'>; label: string }>}
                value={(form.nivelConocimiento === 'Nulo' ? null : form.nivelConocimiento) as Exclude<NivelConocimiento, 'Nulo'> | null}
                onChange={v => {
                  if (v !== 'C') update({ nivelConocimiento: v, instrumentos: [], instrumentoOtro: '' })
                  else update({ nivelConocimiento: v })
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {showInstrumentos && (
          <motion.div
            key="instrumentos"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: 8 }}>
              <CheckboxGroup
                legend="¿En qué instrumentos invierte actualmente?"
                name="instrumentos"
                options={instrumentoOptions}
                values={form.instrumentos}
                onChange={next => {
                  const wasTodos = form.instrumentos.includes('Todos')
                  const isTodos = next.includes('Todos')

                  let final: string[]
                  if (isTodos && !wasTodos) {
                    // Acaba de marcar "Todos" → marcamos todo.
                    final = [...instrumentosOpts]
                  } else if (!isTodos && wasTodos) {
                    // Acaba de desmarcar "Todos" → limpiamos todo.
                    final = []
                  } else {
                    // Toggle individual: sincronizamos "Todos" según haya todos los reales.
                    final = next.filter(v => v !== 'Todos')
                    const reales = instrumentosOpts.filter(v => v !== 'Todos')
                    if (reales.every(v => final.includes(v))) final = ['Todos', ...final]
                  }

                  if (!final.includes('Otros')) update({ instrumentos: final, instrumentoOtro: '' })
                  else update({ instrumentos: final })
                }}
                helper="Selección múltiple."
              />

              <AnimatePresence initial={false}>
                {showOtros && (
                  <motion.div
                    key="otros-input"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ marginTop: 8 }}>
                      <TextField
                        label="¿Cuáles otros instrumentos?"
                        name="instrumentoOtro"
                        value={form.instrumentoOtro}
                        onChange={v => update({ instrumentoOtro: v })}
                        placeholder="Descríbalos brevemente"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
