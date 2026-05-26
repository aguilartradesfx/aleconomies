'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

// TODO: confirmar consentimiento por escrito de todos los clientes citados
// (Carlos Altamirano, Milagro Carazo, Rodolfo Saborío, Jonathan Salazar,
// Luis Carlos Fallas, Luis Reyes, Melisa Gómez, Mauricio Montenegro,
// Gema Quesada, Yocer, Mónica Vargas) antes de pasar el sitio a producción.
// Ley 8968 (CR).
const testimonials = [
  {
    initials: 'GQ',
    name: 'Gema Quesada',
    context: '',
    quote:
      'El servicio que brindan es de buena calidad. Siempre están atentos, dan seguimiento constante y se toman el tiempo de aclarar dudas. Valoro que informan con anticipación sobre cambios o actualizaciones que deba conocer.',
  },
  {
    initials: 'LR',
    name: 'Luis Reyes',
    context: '',
    quote:
      'La asesoría siempre ha sido muy profesional, atenta y con increíble valor agregado. Alejandro y todo su equipo me han hecho sentir mucha confianza en el producto y las opciones que existen.',
  },
  {
    initials: 'MG',
    name: 'Melisa Gómez',
    context: '',
    quote:
      'Estoy muy contenta de los servicios brindados por Alejandro y equipo como mi Asesor financiero: es una persona conocedora del tema, transparente, íntegra y bien preparada. Cada vez que tengo alguna duda me responde con inmediatez y conocimiento, siempre respetando mis decisiones.',
  },
  {
    initials: 'Y',
    name: 'Yocer',
    context: '',
    quote:
      'Mi experiencia ha sido positiva, especialmente por la rapidez en la atención, la claridad durante el proceso de inversión y el seguimiento que he recibido. Valoro el trato personalizado y la disposición para resolver dudas. Agradezco la transparencia y el profesionalismo.',
  },
  {
    initials: 'MM',
    name: 'Mauricio Montenegro',
    context: '',
    quote:
      'Hace un año empecé con Alejandro. Nos reunimos una mañana, me explicó opciones y decidí invertir el mismo día. Estoy satisfecho con su servicio: es muy rápido en evacuar dudas y creo que es muy capaz.',
  },
  {
    initials: 'RS',
    name: 'Rodolfo Saborío',
    context: '',
    quote:
      'Muy agradecido con el seguimiento a mis inversiones y la respuesta que dan a mis consultas. La verdad, muy contento con ustedes.',
  },
  {
    initials: 'MC',
    name: 'Milagro Carazo',
    context: '',
    quote:
      'Un aspecto valioso es la credibilidad que genera Alejandro al brindar las asesorías.',
  },
  {
    initials: 'JS',
    name: 'Jonathan Salazar',
    context: '',
    quote:
      'Toda la atención y el seguimiento ha sido muy bueno desde el inicio del proceso.',
  },
  {
    initials: 'MV',
    name: 'Mónica Vargas',
    context: '',
    quote:
      'Siempre he recibido un trato amable y profesional por parte de ustedes, con buen seguimiento y claridad en la información.',
  },
  {
    initials: 'LF',
    name: 'Luis Carlos Fallas',
    context: '',
    quote:
      'Don Alejandro contesta con premura cuando le he consultado.',
  },
  {
    initials: 'CA',
    name: 'Carlos Altamirano',
    context: '',
    quote: 'Hasta el momento todo me ha parecido muy bien. Gracias.',
  },
]

type Testimonial = (typeof testimonials)[number]

function TestimonialCard({ initials, name, context, quote }: Testimonial) {
  return (
    <div className="glass testimonial-card marquee-card">
      <div className="testimonial-quote-mark" aria-hidden="true">&ldquo;</div>
      <p className="testimonial-text">{quote}</p>
      <hr className="testimonial-sep" />
      <div className="testimonial-footer">
        <div className="testimonial-avatar" aria-hidden="true">
          {initials}
          <span className="testimonial-avatar-dot" />
        </div>
        <div>
          <div className="testimonial-name">{name}</div>
          {context && <div className="testimonial-context">{context}</div>}
        </div>
      </div>
    </div>
  )
}

function MarqueeRow({
  items,
  reverse = false,
  pxPerSec,
}: {
  items: Testimonial[]
  reverse?: boolean
  pxPerSec: number
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const speedRef = useRef(1)
  const targetSpeedRef = useRef(1)
  const periodRef = useRef(0)

  useEffect(() => {
    const row = rowRef.current
    if (!row) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const measure = () => {
      // El N-ésimo hijo es la primera card del segundo set; su offsetLeft
      // es exactamente el período del loop (set + gap completo).
      const secondSetStart = row.children[items.length] as HTMLElement | undefined
      periodRef.current = secondSetStart?.offsetLeft ?? 0
      if (reverse && offsetRef.current === 0) {
        offsetRef.current = -periodRef.current
      }
    }
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(row)

    let raf = 0
    let last = performance.now()
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t

      // Lerp suave hacia la velocidad objetivo (cambia smooth en hover).
      const k = 1 - Math.exp(-dt * 3.5)
      speedRef.current += (targetSpeedRef.current - speedRef.current) * k

      const dir = reverse ? 1 : -1
      offsetRef.current += dir * pxPerSec * speedRef.current * dt

      const p = periodRef.current
      if (p > 0) {
        if (offsetRef.current <= -p) offsetRef.current += p
        else if (offsetRef.current >= 0) offsetRef.current -= p
      }
      row.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [items.length, reverse, pxPerSec])

  const setTarget = (v: number) => {
    targetSpeedRef.current = v
  }

  return (
    <div
      className="marquee-row-wrap"
      onMouseEnter={() => setTarget(0.08)}
      onMouseLeave={() => setTarget(1)}
      onFocus={() => setTarget(0.08)}
      onBlur={() => setTarget(1)}
    >
      <div className="marquee-row" ref={rowRef}>
        {[...items, ...items].map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} {...t} />
        ))}
      </div>
    </div>
  )
}

export default function Testimonials() {
  const half = Math.ceil(testimonials.length / 2)
  const rowA = testimonials.slice(0, half)
  const rowB = testimonials.slice(half)

  return (
    <section id="testimonios" className="testimonials-section">
      <div className="container">
        <motion.div
          className="widget-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionEyebrow>Lo que dicen mis clientes</SectionEyebrow>
          <h2 className="section-title">
            No tiene que <em className="em-muted">creerme a mí.</em>
          </h2>
        </motion.div>

      </div>

      <motion.div
        className="testimonials-marquee testimonials-wide"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease }}
      >
        <MarqueeRow items={rowA} pxPerSec={26} />
        <MarqueeRow items={rowB} reverse pxPerSec={22} />
      </motion.div>
    </section>
  )
}
