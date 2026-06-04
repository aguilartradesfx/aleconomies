'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

// ── Ejemplo ILUSTRATIVO de interés compuesto a 10 años ────────────────────
// Aporte mensual fijo + rendimiento de ejemplo. NO es promesa de retorno;
// muestra el mecanismo: cómo el dinero crece al reinvertir mes a mes.
const APORTE = 50_000 // ₡ por mes
const RATE_ANUAL = 0.1 // 10% anual (ejemplo)
const YEARS = 10
const mr = RATE_ANUAL / 12

// Saldo acumulado al final de cada año (1..10).
function buildYears() {
  const out: { anio: number; saldo: number; aportado: number }[] = []
  let saldo = 0
  for (let m = 1; m <= YEARS * 12; m++) {
    saldo = saldo * (1 + mr) + APORTE
    if (m % 12 === 0) {
      out.push({ anio: m / 12, saldo: Math.round(saldo), aportado: APORTE * m })
    }
  }
  return out
}

const colones = (n: number) => '₡' + new Intl.NumberFormat('es-CR').format(Math.round(n))

export default function CompoundMockB() {
  const years = useMemo(buildYears, [])
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-120px' })
  const reduced = useReducedMotion()
  const [step, setStep] = useState(0) // 0..YEARS

  useEffect(() => {
    if (reduced) {
      setStep(YEARS)
      return
    }
    if (!inView) {
      setStep(0) // reinicia para que la animación se repita al volver a la sección
      return
    }
    let s = 0
    const id = setInterval(() => {
      s++
      setStep(s)
      if (s >= YEARS) clearInterval(id)
    }, 200) // 10 años × 200ms ≈ 2s, una sola pasada
    return () => clearInterval(id)
  }, [inView, reduced])

  const cur = step === 0
    ? { saldo: 0, aportado: 0 }
    : years[Math.min(step, YEARS) - 1]
  const interes = cur.saldo - cur.aportado
  const maxSaldo = years[YEARS - 1].saldo

  return (
    <div
      ref={ref}
      className="glass-heavy lp-compound-grid"
      style={{ padding: 40, borderRadius: 28, display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 44, alignItems: 'center' }}
    >
      {/* ── Columna izquierda: supuesto + resultado ── */}
      <div>
        <div className="stat-label" style={{ marginBottom: 10 }}>Usted invierte</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(30px, 4vw, 40px)', fontWeight: 600, letterSpacing: '-1.5px', color: 'var(--text)' }}>
            {colones(APORTE)}
          </span>
          <span style={{ fontSize: 16, color: 'var(--text-3)' }}>/ mes</span>
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-3)' }}>
          durante {YEARS} años · {Math.round(RATE_ANUAL * 100)}% anual (ejemplo)
        </div>

        <hr className="risk-divider" style={{ margin: '24px 0' }} />

        <div className="stat-label" style={{ marginBottom: 10 }}>En {YEARS} años tendría</div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(34px, 5vw, 48px)',
            fontWeight: 600,
            letterSpacing: '-2px',
            lineHeight: 1,
            marginBottom: 18,
            background: 'linear-gradient(135deg, var(--purple-light), var(--purple-bright))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {colones(cur.saldo)}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div className="stat-card" style={{ flex: 1 }}>
            <div className="stat-label">Usted aportó</div>
            <div className="stat-value">{colones(cur.aportado)}</div>
          </div>
          <div className="stat-card stat-card-highlight" style={{ flex: 1 }}>
            <div className="stat-label">El interés sumó</div>
            <div className="stat-value stat-value-highlight">{colones(interes)}</div>
          </div>
        </div>
      </div>

      {/* ── Columna derecha: gráfico de 10 barras (una por año) ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 230 }} aria-hidden="true">
          {years.map((y, i) => {
            const visible = i < step
            const aporteH = (y.aportado / maxSaldo) * 100
            const interesH = ((y.saldo - y.aportado) / maxSaldo) * 100
            const isHead = i === step - 1
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                <div
                  style={{
                    height: visible ? `${interesH}%` : '0%',
                    background: 'linear-gradient(180deg, #A78BFA, #8B5CF6)',
                    borderRadius: '4px 4px 0 0',
                    boxShadow: isHead ? '0 0 16px rgba(139,92,246,0.6)' : undefined,
                    transition: 'height 0.4s cubic-bezier(0.16,1,0.3,1)',
                  }}
                />
                <div
                  style={{
                    height: visible ? `${aporteH}%` : '0%',
                    background: 'linear-gradient(180deg, #4A4A55, #2D2D38)',
                    transition: 'height 0.4s cubic-bezier(0.16,1,0.3,1)',
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* Etiquetas de año */}
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          {years.map((y, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: i < step ? 'var(--text-3)' : 'var(--text-4)',
                transition: 'color 0.3s',
              }}
            >
              {y.anio}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>Años</div>

        {/* Leyenda */}
        <div className="chart-legend" style={{ marginTop: 18, flexWrap: 'wrap' }}>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#3A3A44' }} /> Lo que usted pone
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#8B5CF6' }} /> Lo que el interés compuesto suma
          </span>
        </div>
      </div>

      {/* Footnote full-width */}
      <p style={{ gridColumn: '1 / -1', fontSize: 11, color: 'var(--text-4)', margin: 0, lineHeight: 1.4 }}>
        Ejemplo ilustrativo · aporte de {colones(APORTE)}/mes durante {YEARS} años a {Math.round(RATE_ANUAL * 100)}% anual.
        No constituye una promesa de rendimiento.
      </p>
    </div>
  )
}
