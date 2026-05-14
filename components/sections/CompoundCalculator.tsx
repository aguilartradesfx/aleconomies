'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { calculateCompoundGrowth } from '@/lib/finance'
import { formatColones, formatInput } from '@/lib/utils'
import SliderInput from '@/components/ui/SliderInput'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

export default function CompoundCalculator() {
  const [initial, setInitial] = useState(1_000_000)
  const [monthly, setMonthly] = useState(50_000)
  const [years, setYears] = useState(15)
  const [rate, setRate] = useState(9)
  const [hoveredYear, setHoveredYear] = useState<number | null>(null)

  const data = useMemo(
    () => calculateCompoundGrowth(initial, monthly, years, rate),
    [initial, monthly, years, rate],
  )

  const last = data[data.length - 1]
  const maxBalance = last?.balance ?? 1
  const stepLabel = Math.max(1, Math.ceil(years / 8))

  return (
    <section id="calculadora" className="widget-section">
      <div className="container">
        <motion.div
          className="widget-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionEyebrow>Calculadora interactiva</SectionEyebrow>
          <h2 className="section-title">
            Vea qué pasa cuando su plata{' '}
            <em className="em-gradient">trabaja para usted.</em>
          </h2>
          <p className="section-sub">
            Mueva los controles y observe el efecto del interés compuesto en su patrimonio a
            largo plazo. Esto es lo que pasa cuando deja de guardar y empieza a invertir.
          </p>
        </motion.div>

        <motion.div
          className="calculator-card"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          {/* ── Left: sliders ── */}
          <div className="calc-sliders">
            <SliderInput
              label="Monto inicial"
              value={initial}
              min={0}
              max={50_000_000}
              step={100_000}
              onChange={setInitial}
              display={formatInput(initial)}
            />
            <SliderInput
              label="Aporte mensual"
              value={monthly}
              min={25_000}
              max={500_000}
              step={5_000}
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
            <SliderInput
              label="Rendimiento anual"
              value={rate}
              min={2}
              max={15}
              step={0.5}
              onChange={setRate}
              display={`${rate}%`}
            />
          </div>

          {/* ── Right: output ── */}
          <div>
            {/* Stat cards */}
            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-label">Aportado</div>
                <div className="stat-value">{formatColones(last?.contributed ?? 0)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Generado</div>
                <div className="stat-value">{formatColones(last?.interest ?? 0)}</div>
              </div>
              <div className="stat-card stat-card-highlight">
                <div className="stat-label">Total final</div>
                <div className="stat-value stat-value-highlight">
                  {formatColones(last?.balance ?? 0)}
                </div>
              </div>
            </div>

            {/* Bar chart */}
            <div className="chart-card">
              <div className="chart-bars">
                {data.map(d => {
                  const totalPct = (d.balance / maxBalance) * 100
                  const interestPct =
                    d.balance > 0 ? (d.interest / d.balance) * 100 : 0
                  const isHovered = hoveredYear === d.year

                  return (
                    <div
                      key={d.year}
                      className="bar-col"
                      onMouseEnter={() => setHoveredYear(d.year)}
                      onMouseLeave={() => setHoveredYear(null)}
                    >
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            className="bar-tooltip"
                            style={{ bottom: `calc(${totalPct}% + 10px)` }}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.12 }}
                          >
                            <div
                              style={{
                                fontSize: 10,
                                color: 'var(--text-3)',
                                marginBottom: 4,
                              }}
                            >
                              Año {d.year}
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: 'var(--text)',
                                marginBottom: 2,
                              }}
                            >
                              {formatColones(d.balance)}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--purple-light)' }}>
                              +{formatColones(d.interest)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Animated bar */}
                      <motion.div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          overflow: 'hidden',
                          borderRadius: '3px 3px 0 0',
                        }}
                        animate={{ height: `${totalPct}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                      >
                        {/* Purple — interest (top) */}
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: `${interestPct}%`,
                            background:
                              'linear-gradient(180deg, var(--purple-light) 0%, var(--purple) 100%)',
                            boxShadow: isHovered
                              ? '0 0 10px var(--purple-glow)'
                              : '0 0 4px rgba(139,92,246,0.25)',
                          }}
                        />
                        {/* Gray — contributed (bottom) */}
                        <div
                          style={{
                            position: 'absolute',
                            top: `${interestPct}%`,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'var(--ink-700)',
                          }}
                        />
                      </motion.div>
                    </div>
                  )
                })}
              </div>

              {/* X-axis labels */}
              <div className="chart-x-labels">
                {data.map(d => {
                  const showLabel =
                    d.year === 1 ||
                    d.year === years ||
                    (d.year % stepLabel === 0 && d.year !== years)
                  return (
                    <div
                      key={d.year}
                      className="chart-x-label"
                      style={{ visibility: showLabel ? 'visible' : 'hidden' }}
                    >
                      {d.year}
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: 'var(--ink-700)' }} />
                  Aportado
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: 'var(--purple)' }} />
                  Interés compuesto
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
