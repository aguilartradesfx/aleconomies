'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

// ── Ejemplo ILUSTRATIVO de interés compuesto a 10 años ────────────────────
// Aporte mensual fijo + rendimiento de ejemplo. NO es promesa de retorno;
// muestra el mecanismo: cómo el dinero crece al reinvertir mes a mes.
const APORTE = 50_000 // ₡ por mes
const RATE_ANUAL = 0.1 // 10% anual (ejemplo)
const YEARS = 10
const MESES = YEARS * 12 // 120
const mr = RATE_ANUAL / 12

function buildSeries() {
  const out: { mes: number; saldo: number; aportado: number }[] = []
  let saldo = 0
  for (let m = 1; m <= MESES; m++) {
    saldo = saldo * (1 + mr) + APORTE
    out.push({ mes: m, saldo: Math.round(saldo), aportado: APORTE * m })
  }
  return out
}

const colones = (n: number) => '₡' + new Intl.NumberFormat('es-CR').format(Math.round(n))

const HOLD_TICKS = 64 // pausa al final antes de reiniciar el loop

export default function CompoundMockB() {
  const series = useMemo(buildSeries, [])
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-100px' })
  const reduced = useReducedMotion()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (reduced) {
      setStep(MESES - 1)
      return
    }
    if (!inView) return
    let counter = 0
    const id = setInterval(() => {
      counter++
      if (counter <= MESES) setStep(counter - 1)
      else if (counter >= MESES + HOLD_TICKS) counter = 0
    }, 24)
    return () => clearInterval(id)
  }, [inView, reduced])

  const cur = series[Math.min(step, MESES - 1)]
  const interes = cur.saldo - cur.aportado
  const maxSaldo = series[MESES - 1].saldo
  const aniosTranscurridos = ((cur.mes) / 12).toFixed(1)

  return (
    <div
      ref={ref}
      className="glass-heavy"
      style={{ padding: 36, borderRadius: 28, maxWidth: 820, margin: '0 auto' }}
    >
      {/* Header con totales (cuentan hacia arriba) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <div className="card-label" style={{ marginBottom: 8 }}>
            <span className="card-label-dot" />
            Año {aniosTranscurridos} de {YEARS}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(32px, 5.5vw, 50px)',
              fontWeight: 600,
              letterSpacing: '-2px',
              color: 'var(--text)',
              lineHeight: 1,
            }}
          >
            {colones(cur.saldo)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
          <div>
            <div className="stat-label">Usted aportó</div>
            <div className="stat-value">{colones(cur.aportado)}</div>
          </div>
          <div>
            <div className="stat-label">El interés sumó</div>
            <div className="stat-value stat-value-highlight">{colones(interes)}</div>
          </div>
        </div>
      </div>

      {/* Barras apiladas: aporte (gris) + interés compuesto (morado) */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 210 }} aria-hidden="true">
        {series.map((s, i) => {
          const visible = i <= step
          const aporteH = (s.aportado / maxSaldo) * 100
          const interesH = ((s.saldo - s.aportado) / maxSaldo) * 100
          const isHead = i === step
          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                height: '100%',
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.18s ease',
              }}
            >
              <div
                style={{
                  height: visible ? `${interesH}%` : '0%',
                  background: 'linear-gradient(180deg, #A78BFA, #8B5CF6)',
                  borderRadius: '2px 2px 0 0',
                  boxShadow: isHead ? '0 0 12px rgba(139,92,246,0.7)' : undefined,
                  transition: 'height 0.18s ease',
                }}
              />
              <div
                style={{
                  height: visible ? `${aporteH}%` : '0%',
                  background: 'linear-gradient(180deg, #4A4A55, #2D2D38)',
                  transition: 'height 0.18s ease',
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Eje */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)' }}>Hoy</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)' }}>{YEARS} años</span>
      </div>

      {/* Leyenda */}
      <div className="chart-legend" style={{ marginTop: 18, flexWrap: 'wrap' }}>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#3A3A44' }} /> Lo que usted pone
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#8B5CF6' }} /> Lo que el interés compuesto suma
        </span>
      </div>

      <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 16, lineHeight: 1.4 }}>
        Ejemplo ilustrativo · aporte de {colones(APORTE)}/mes durante {YEARS} años a {Math.round(RATE_ANUAL * 100)}% anual.
        No constituye una promesa de rendimiento.
      </p>
    </div>
  )
}
