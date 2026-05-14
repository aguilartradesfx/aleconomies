'use client'

import { motion } from 'framer-motion'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

const problems = [
  {
    num: '01',
    quote: '"Tengo plata en el banco pero los rendimientos son ridículos."',
    desc: 'Cuentas de ahorro, CDPs y certificados que dan 3-5% mientras la inflación se come ese rendimiento. La plata está "segura" pero pierde poder de compra cada año.',
  },
  {
    num: '02',
    quote: '"No sé en qué invertir y los del banco solo me ofrecen sus productos."',
    desc: 'El asesor del banco vende lo que su banco maneja — no necesariamente lo que mejor le sirve a usted. Hace falta una visión independiente que compare opciones reales del mercado.',
  },
  {
    num: '03',
    quote: '"Tuve una entrada extra y no sé qué hacer con ella."',
    desc: 'Una bonificación, la venta de un carro, una propiedad, una herencia. Plata que llega y se queda dormida en la cuenta corriente porque no hay un plan claro.',
  },
  {
    num: '04',
    quote: '"Ya estoy invirtiendo, pero sin estructura ni claridad."',
    desc: 'Algo en cripto, algo en un fondo, algo que le recomendó un amigo. Movimientos sueltos sin un objetivo definido ni manera de medir si va bien o mal.',
  },
]

export default function ProblemSection() {
  return (
    <section id="problema" className="problem-section">
      <div className="container">
        <motion.div
          className="widget-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionEyebrow>El patrón</SectionEyebrow>
          <h2 className="section-title">
            Lo que escucho <em className="em-muted">todas las semanas.</em>
          </h2>
          <p className="section-sub">
            Si alguno de estos puntos le suena familiar, probablemente ya sabe por qué está acá.
          </p>
        </motion.div>

        <div className="problem-grid">
          {problems.map((p, i) => (
            <motion.div
              key={p.num}
              className="glass problem-card"
              style={{ borderRadius: 20 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.07, ease }}
            >
              <div className="problem-number">
                <span className="problem-number-line" aria-hidden="true" />
                {p.num}
              </div>
              <p className="problem-quote">{p.quote}</p>
              <p className="problem-desc">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="problem-close"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          El patrón es el mismo: no falta plata,{' '}
          <em className="em-gradient" style={{ fontSize: 'inherit' }}>
            falta estructura.
          </em>
        </motion.p>
      </div>
    </section>
  )
}
