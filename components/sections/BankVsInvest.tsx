'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  ResponsiveContainer,
} from 'recharts'
import { calculateCompoundGrowth } from '@/lib/finance'
import { formatColones, formatInput } from '@/lib/utils'
import SliderInput from '@/components/ui/SliderInput'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

export default function BankVsInvest() {
  const [monthly, setMonthly] = useState(50_000)
  const [years, setYears] = useState(20)

  const bankData = useMemo(
    () =>
      calculateCompoundGrowth(0, monthly, years, 4).map(d => ({
        year: d.year,
        value: d.balance,
      })),
    [monthly, years],
  )

  const investData = useMemo(
    () =>
      calculateCompoundGrowth(0, monthly, years, 12).map(d => ({
        year: d.year,
        value: d.balance,
      })),
    [monthly, years],
  )

  const bankFinal = bankData[bankData.length - 1]?.value ?? 0
  const investFinal = investData[investData.length - 1]?.value ?? 0

  return (
    <section id="comparacion" className="comparison-section">
      <div className="container">
        <motion.div
          className="widget-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionEyebrow>La diferencia</SectionEyebrow>
          <h2 className="section-title">
            Banco vs.{' '}
            <em className="em-gradient">estrategia diversificada.</em>
          </h2>
          <p className="section-sub">
            Mismo monto, mismo plazo. Una de las dos formas le hace perder años de su vida.
            Vea cuál.
          </p>
        </motion.div>

        {/* Sliders */}
        <motion.div
          className="comparison-sliders"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
        >
          <SliderInput
            label="Aporte mensual"
            value={monthly}
            min={25_000}
            max={1_500_000}
            step={10_000}
            onChange={setMonthly}
            display={formatInput(monthly)}
          />
          <SliderInput
            label="Plazo"
            value={years}
            min={1}
            max={40}
            step={1}
            onChange={setYears}
            display={`${years} año${years === 1 ? '' : 's'}`}
          />
        </motion.div>

        {/* Cards */}
        <div className="comparison-grid">
          {/* Bank card */}
          <motion.div
            className="comparison-panel"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="comparison-tag">Cuenta de ahorro</div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: 'var(--text-2)',
                marginBottom: 12,
              }}
            >
              Lo que da el banco
            </h3>
            <div className="comparison-rate">
              Rendimiento típico:{' '}
              <strong style={{ color: 'var(--text)' }}>4% anual</strong>
            </div>
            <div className="comparison-result">{formatColones(bankFinal)}</div>
            <div className="comparison-desc">
              Después de {years} año{years === 1 ? '' : 's'} aportando{' '}
              {formatInput(monthly)}/mes
            </div>

            <ResponsiveContainer width="100%" height={110}>
              <AreaChart data={bankData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="bvi-bank-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4A4A55" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#4A4A55" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" hide />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6B6B78"
                  strokeWidth={2}
                  fill="url(#bvi-bank-grad)"
                  dot={false}
                  isAnimationActive
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Investment card */}
          <motion.div
            className="comparison-panel glass-featured"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            <div
              className="comparison-tag"
              style={{ color: 'var(--purple-light)' }}
            >
              <span className="card-label-dot" />
              Portafolio diversificado
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: 'var(--text)',
                marginBottom: 12,
              }}
            >
              Lo que puede lograr
            </h3>
            <div className="comparison-rate">
              Rendimiento promedio:{' '}
              <strong
                style={{
                  color: 'var(--purple-light)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                12% anual
              </strong>
            </div>
            <div className="comparison-result comparison-result-highlight">
              {formatColones(investFinal)}
            </div>
            <div className="comparison-desc">
              Mismo aporte, mismo plazo — distinta estrategia
            </div>

            <ResponsiveContainer width="100%" height={110}>
              <AreaChart
                data={investData}
                margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="bvi-invest-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" hide />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#A78BFA"
                  strokeWidth={2}
                  fill="url(#bvi-invest-grad)"
                  dot={false}
                  isAnimationActive
                  animationDuration={800}
                  animationEasing="ease-out"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.4))' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', marginTop: 20, fontStyle: 'italic', lineHeight: 1.6 }}>
          Tasas referenciales para fines comparativos. El rendimiento del banco corresponde a depósitos a plazo en colones de banca nacional. El portafolio diversificado representa una estrategia balanceada de mediano plazo y los rendimientos pasados no garantizan rendimientos futuros.
        </p>
      </div>
    </section>
  )
}
