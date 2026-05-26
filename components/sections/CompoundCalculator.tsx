'use client'

import { useReducer, useMemo, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PRODUCTS,
  calcLumpSum,
  calcMonthly,
  calcPeriodicIncome,
  type ProductId,
  type Currency,
  type PaymentFrequency,
} from '@/lib/finance'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

// ── Defaults por producto ─────────────────────────────────────────

const PRODUCT_DEFAULTS: Record<ProductId, { currency: Currency; term: number; frequency: PaymentFrequency }> = {
  A: { currency: 'CRC', term: 36,  frequency: 'maturity' },
  B: { currency: 'CRC', term: 36,  frequency: 'monthly'  },
  C: { currency: 'CRC', term: 3,   frequency: 'maturity' },
  D: { currency: 'CRC', term: 15,  frequency: 'maturity' },
  E: { currency: 'USD', term: 2,   frequency: 'annual'   },
}

// ── State ─────────────────────────────────────────────────────────

type State = {
  productId: ProductId | null
  currency: Currency
  term: number | null
  frequency: PaymentFrequency
  amount: number
  rawInput: string
  selectedPresetIndex: number | null
}

type Action =
  | { type: 'SELECT_PRODUCT'; id: ProductId }
  | { type: 'SET_CURRENCY'; currency: Currency }
  | { type: 'SET_TERM'; term: number }
  | { type: 'SET_FREQUENCY'; frequency: PaymentFrequency }
  | { type: 'SET_AMOUNT'; amount: number; rawInput: string }
  | { type: 'SET_PRESET'; index: number }
  | { type: 'OPEN_OTRO_MONTO' }

function formatCurrencyInput(value: number, currency: Currency): string {
  if (value === 0) return ''
  const locale = currency === 'CRC' ? 'es-CR' : 'en-US'
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value)
}

function parseCurrencyInput(displayValue: string): number {
  const digits = displayValue.replace(/\D/g, '')
  return digits === '' ? 0 : parseInt(digits, 10)
}

function getSecondPreset(productId: ProductId, currency: Currency): number {
  const p = PRODUCTS.find(pr => pr.id === productId)
  const presets = p?.presetAmounts[currency] ?? []
  return presets[1] ?? presets[0] ?? 0
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SELECT_PRODUCT': {
      const d = PRODUCT_DEFAULTS[action.id]
      const amount = getSecondPreset(action.id, d.currency)
      return {
        ...state,
        productId: action.id,
        currency: d.currency,
        term: d.term,
        frequency: d.frequency,
        amount,
        rawInput: formatCurrencyInput(amount, d.currency),
        selectedPresetIndex: 1,
      }
    }
    case 'SET_CURRENCY': {
      if (!state.productId) return { ...state, currency: action.currency, term: null }
      const amount = getSecondPreset(state.productId, action.currency)
      return { ...state, currency: action.currency, term: null, amount, rawInput: formatCurrencyInput(amount, action.currency), selectedPresetIndex: 1 }
    }
    case 'SET_TERM':
      return { ...state, term: action.term }
    case 'SET_FREQUENCY':
      return { ...state, frequency: action.frequency }
    case 'SET_AMOUNT':
      return { ...state, amount: action.amount, rawInput: action.rawInput, selectedPresetIndex: null }
    case 'SET_PRESET': {
      if (!state.productId) return state
      const p = PRODUCTS.find(pr => pr.id === state.productId)
      const presets = p?.presetAmounts[state.currency] ?? []
      const amount = presets[action.index] ?? 0
      return { ...state, amount, rawInput: formatCurrencyInput(amount, state.currency), selectedPresetIndex: action.index }
    }
    case 'OPEN_OTRO_MONTO':
      return { ...state, selectedPresetIndex: null, rawInput: formatCurrencyInput(state.amount, state.currency) }
    default:
      return state
  }
}

const initialState: State = {
  productId: 'D',
  currency: 'CRC',
  term: 15,
  frequency: 'maturity',
  amount: 100_000,
  rawInput: '100.000',
  selectedPresetIndex: 1,
}

// ── Helpers ───────────────────────────────────────────────────────

function fmt(n: number, currency: Currency): string {
  if (!isFinite(n) || n === 0) return currency === 'CRC' ? '₡0' : '$0'
  const sym = currency === 'CRC' ? '₡' : '$'
  const abs = Math.abs(n)
  if (abs >= 1_000_000_000) return sym + (n / 1_000_000_000).toFixed(2) + 'B'
  if (abs >= 1_000_000)     return sym + (n / 1_000_000).toFixed(2) + 'M'
  if (abs >= 1_000)         return sym + (n / 1_000).toFixed(0) + 'K'
  return sym + Math.round(n).toLocaleString('es-CR')
}

function fmtFull(n: number, currency: Currency): string {
  if (!isFinite(n)) return currency === 'CRC' ? '₡0' : '$0'
  const sym = currency === 'CRC' ? '₡' : '$'
  return sym + Math.round(n).toLocaleString('es-CR')
}

const FREQ_LABELS: Record<PaymentFrequency, string> = {
  monthly: 'mes', quarterly: 'trimestre', semiannual: 'semestre', annual: 'año', maturity: 'vencimiento',
}

const FREQ_DISPLAY: Record<PaymentFrequency, string> = {
  monthly: 'Mensual', quarterly: 'Trimestral', semiannual: 'Semestral', annual: 'Anual', maturity: 'Al vencimiento',
}

// ── Component ─────────────────────────────────────────────────────

export default function CompoundCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [hoveredYear, setHoveredYear] = useState<number | null>(null)

  const product = useMemo(
    () => PRODUCTS.find(p => p.id === state.productId) ?? null,
    [state.productId],
  )

  const rate = useMemo(() => {
    if (!product || state.term === null) return null
    return product.rates[state.currency]?.[state.term] ?? null
  }, [product, state.currency, state.term])

  const minAmount = product?.minInvestment[state.currency] ?? 0
  const belowMin = state.amount > 0 && state.amount < minAmount
  const isReady = product !== null && state.term !== null && state.amount >= minAmount && state.amount > 0 && rate !== null

  const results = useMemo(() => {
    if (!isReady || !product || rate === null || state.term === null) return null
    if (product.contributionMode === 'lump-sum') {
      return calcLumpSum(state.amount, rate, state.term, product.termUnit)
    }
    const years = state.term
    return calcMonthly(state.amount, rate, years)
  }, [isReady, product, rate, state.amount, state.term])

  const periodicIncome = useMemo(() => {
    if (!isReady || !product?.hasPeriodicIncome || rate === null) return null
    return calcPeriodicIncome(state.amount, rate, state.frequency)
  }, [isReady, product, rate, state.amount, state.frequency])

  const maxBalance = results ? Math.max(...results.yearlyData.map(d => d.balance)) : 1
  const stepLabel = results ? Math.max(1, Math.ceil(results.yearlyData.length / 8)) : 1

  const amountInputRef = useRef<HTMLInputElement>(null)

  const handleAmountInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const oldVal = input.value
    const cursorPos = input.selectionStart ?? oldVal.length
    const digitsBeforeCursor = oldVal.slice(0, cursorPos).replace(/\D/g, '').length

    const numericValue = parseCurrencyInput(oldVal)
    const displayVal = formatCurrencyInput(numericValue, state.currency)

    dispatch({ type: 'SET_AMOUNT', amount: numericValue, rawInput: displayVal })

    requestAnimationFrame(() => {
      const el = amountInputRef.current
      if (!el) return
      let digitCount = 0
      let newCursorPos = displayVal.length
      for (let i = 0; i < displayVal.length; i++) {
        if (/\d/.test(displayVal[i])) {
          digitCount++
          if (digitCount === digitsBeforeCursor) {
            newCursorPos = i + 1
            break
          }
        }
      }
      el.setSelectionRange(newCursorPos, newCursorPos)
    })
  }, [state.currency])

  return (
    <section id="calculadora" className="widget-section">
      <div className="container">

        {/* ── Header ── */}
        <motion.div
          className="widget-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionEyebrow>Productos disponibles</SectionEyebrow>
          <h2 className="section-title">
            Vea qué puede lograr con{' '}
            <em className="em-gradient">productos reales.</em>
          </h2>
          <p className="section-sub">
            Estos son los instrumentos con los que trabajo. Elija el producto, el plazo y la moneda — y vea exactamente cuánto puede crecer su dinero con tasas reales del mercado.
          </p>
        </motion.div>

        {/* ── Product selector (full width above card) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease }}
          style={{ marginBottom: 24 }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 10,
          }}
            className="product-grid"
          >
            {PRODUCTS.map((p, i) => {
              const isActive = state.productId === p.id
              return (
                <motion.button
                  key={p.id}
                  onClick={() => dispatch({ type: 'SELECT_PRODUCT', id: p.id })}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 14,
                    border: isActive
                      ? '1px solid rgba(139,92,246,0.5)'
                      : '1px solid var(--border-soft)',
                    background: isActive
                      ? 'var(--purple-faint)'
                      : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    opacity: state.productId && !isActive ? 0.5 : 1,
                  }}
                >
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: isActive ? 'var(--text)' : 'var(--text-2)',
                    lineHeight: 1.3,
                    marginBottom: 4,
                  }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.4 }}>
                    {p.description}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* ── Main card ── */}
        <motion.div
          className="calculator-card"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          {/* ── Left: form ── */}
          <div className="calc-sliders" style={{ gap: 24 }}>

            {/* Currency toggle */}
            <AnimatePresence mode="wait">
              {product && (
                <motion.div
                  key="currency"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>
                    Moneda
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {(['CRC', 'USD'] as Currency[]).map(cur => {
                      const allowed = product.allowedCurrencies.includes(cur)
                      const isActive = state.currency === cur
                      return (
                        <button
                          key={cur}
                          disabled={!allowed}
                          onClick={() => dispatch({ type: 'SET_CURRENCY', currency: cur })}
                          style={{
                            padding: '8px 20px',
                            borderRadius: 8,
                            border: isActive ? '1px solid rgba(139,92,246,0.5)' : '1px solid var(--border-soft)',
                            background: isActive ? 'var(--purple-faint)' : 'rgba(255,255,255,0.02)',
                            color: isActive ? 'var(--purple-light)' : allowed ? 'var(--text-2)' : 'var(--text-4)',
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: allowed ? 'pointer' : 'not-allowed',
                            transition: 'all 0.15s',
                          }}
                        >
                          {cur === 'CRC' ? '₡ Colones' : '$ Dólares'}
                        </button>
                      )
                    })}
                    {!product.allowedCurrencies.includes('CRC') && (
                      <span style={{ fontSize: 11, color: 'var(--text-4)', alignSelf: 'center' }}>Solo dólares</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Term pills */}
            <AnimatePresence mode="wait">
              {product && (
                <motion.div
                  key="terms"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>
                    {product.termUnit === 'months' ? 'Plazo en meses' : 'Plazo en años'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {product.terms.map(t => {
                      const isActive = state.term === t
                      return (
                        <button
                          key={t}
                          onClick={() => dispatch({ type: 'SET_TERM', term: t })}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 8,
                            border: isActive ? '1px solid rgba(139,92,246,0.5)' : '1px solid var(--border-soft)',
                            background: isActive ? 'var(--purple-faint)' : 'rgba(255,255,255,0.02)',
                            color: isActive ? 'var(--purple-light)' : 'var(--text-2)',
                            fontSize: 12,
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          {t}
                        </button>
                      )
                    })}
                  </div>

                  {/* Min helper — always visible */}
                  <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 8 }}>
                    Mínimo:{' '}
                    {product.allowedCurrencies.includes('CRC') && product.minInvestment.CRC
                      ? `₡${product.minInvestment.CRC.toLocaleString('es-CR')}`
                      : ''}
                    {product.allowedCurrencies.includes('CRC') && product.minInvestment.CRC && product.minInvestment.USD ? ' / ' : ''}
                    {product.minInvestment.USD ? `$${product.minInvestment.USD.toLocaleString('en-US')}` : ''}
                    {product.contributionMode === 'monthly' ? ' mensual' : ''}
                  </p>

                  {/* Rate badge */}
                  <AnimatePresence>
                    {rate !== null && (
                      <motion.div
                        key="rate-badge"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        aria-live="polite"
                        style={{
                          marginTop: 10,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '5px 12px',
                          borderRadius: 20,
                          border: '1px solid rgba(139,92,246,0.3)',
                          background: 'var(--purple-faint)',
                          fontSize: 12,
                          color: 'var(--text-3)',
                        }}
                      >
                        <span>Tasa anual:</span>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          color: 'var(--purple-light)',
                        }}>
                          {rate.toFixed(2)}%
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Frequency (B and E only) */}
            <AnimatePresence mode="wait">
              {product?.hasPeriodicIncome && (
                <motion.div
                  key="frequency"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label
                    htmlFor="frequency-select"
                    style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-3)', display: 'block', marginBottom: 10 }}
                  >
                    Frecuencia de pago
                  </label>
                  <select
                    id="frequency-select"
                    aria-label="Frecuencia de pago de rendimientos"
                    value={state.frequency}
                    onChange={e => dispatch({ type: 'SET_FREQUENCY', frequency: e.target.value as PaymentFrequency })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border-medium)',
                      background: 'rgba(255,255,255,0.04)',
                      color: 'var(--text)',
                      fontSize: 13,
                      cursor: 'pointer',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238E8E9C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                    }}
                  >
                    {(product.paymentFrequencies ?? []).map(f => (
                      <option key={f} value={f} style={{ background: 'var(--bg-mid)' }}>
                        {FREQ_DISPLAY[f]}
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Amount pills */}
            <AnimatePresence mode="wait">
              {product && (
                <motion.div
                  key="amount"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>
                    {product.contributionMode === 'monthly' ? 'Aporte mensual' : 'Monto a invertir'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(product.presetAmounts[state.currency] ?? []).map((amt, i) => {
                      const isActive = state.selectedPresetIndex === i
                      return (
                        <button
                          key={i}
                          onClick={() => dispatch({ type: 'SET_PRESET', index: i })}
                          style={{
                            padding: '7px 12px',
                            borderRadius: 8,
                            border: isActive ? '1px solid rgba(139,92,246,0.5)' : '1px solid var(--border-soft)',
                            background: isActive ? 'var(--purple-faint)' : 'rgba(255,255,255,0.02)',
                            color: isActive ? 'var(--purple-light)' : 'var(--text-2)',
                            fontSize: 12,
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            boxShadow: isActive ? '0 0 8px rgba(139,92,246,0.2)' : 'none',
                          }}
                        >
                          {fmtFull(amt, state.currency)}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => dispatch({ type: 'OPEN_OTRO_MONTO' })}
                      style={{
                        padding: '7px 12px',
                        borderRadius: 8,
                        border: state.selectedPresetIndex === null ? '1px solid rgba(139,92,246,0.5)' : '1px solid var(--border-soft)',
                        background: state.selectedPresetIndex === null ? 'var(--purple-faint)' : 'rgba(255,255,255,0.02)',
                        color: state.selectedPresetIndex === null ? 'var(--purple-light)' : 'var(--text-3)',
                        fontSize: 12,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      Otro monto
                    </button>
                  </div>
                  {/* Amount min helper — always visible */}
                  <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 8 }}>
                    Mínimo:{' '}
                    {product.allowedCurrencies.includes('CRC') && product.minInvestment.CRC
                      ? `₡${product.minInvestment.CRC.toLocaleString('es-CR')}`
                      : ''}
                    {product.allowedCurrencies.includes('CRC') && product.minInvestment.CRC && product.minInvestment.USD ? ' / ' : ''}
                    {product.minInvestment.USD ? `$${product.minInvestment.USD.toLocaleString('en-US')}` : ''}
                    {product.contributionMode === 'monthly' ? ' mensual' : ''}
                  </p>

                  <AnimatePresence>
                    {state.selectedPresetIndex === null && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden', marginTop: 10 }}
                      >
                        <div style={{ position: 'relative' }}>
                          <span style={{
                            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                            fontSize: 14, color: 'var(--text-3)', pointerEvents: 'none',
                          }}>
                            {state.currency === 'CRC' ? '₡' : '$'}
                          </span>
                          <input
                            id="amount-input"
                            ref={amountInputRef}
                            type="text"
                            inputMode="numeric"
                            value={state.rawInput}
                            onChange={handleAmountInput}
                            placeholder={formatCurrencyInput(minAmount, state.currency)}
                            aria-label={product.contributionMode === 'monthly' ? 'Aporte mensual' : 'Monto a invertir'}
                            autoFocus
                            style={{
                              width: '100%',
                              padding: '10px 14px 10px 28px',
                              borderRadius: 10,
                              border: belowMin ? '1px solid rgba(239,68,68,0.5)' : '1px solid var(--border-medium)',
                              background: 'rgba(255,255,255,0.04)',
                              color: 'var(--text)',
                              fontSize: 14,
                              fontFamily: 'var(--font-mono)',
                              outline: 'none',
                              transition: 'border-color 0.15s',
                            }}
                          />
                        </div>
                        <AnimatePresence>
                          {belowMin && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              style={{ fontSize: 11, color: 'rgb(239,68,68)', marginTop: 6 }}
                            >
                              Mínimo: {fmtFull(minAmount, state.currency)}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state when no product selected */}
            {!product && (
              <div style={{ padding: '32px 0', color: 'var(--text-4)', fontSize: 14 }}>
                Elija un producto arriba para comenzar.
              </div>
            )}

          </div>

          {/* ── Right: results ── */}
          <div>
            <AnimatePresence mode="wait">
              {isReady && results ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Stats */}
                  <div className="stat-grid">
                    <div className="stat-card">
                      <div className="stat-label">Total invertido</div>
                      <div className="stat-value">{fmt(results.totalContributed, state.currency)}</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Rendimiento</div>
                      <div className="stat-value">{fmt(results.interest, state.currency)}</div>
                    </div>
                    <div className="stat-card stat-card-highlight">
                      <div className="stat-label">Total final</div>
                      <div className="stat-value stat-value-highlight">
                        {fmt(results.finalAmount, state.currency)}
                      </div>
                    </div>
                  </div>

                  {/* Periodic income badge */}
                  <AnimatePresence>
                    {periodicIncome !== null && periodicIncome > 0 && (
                      <motion.div
                        key="periodic"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                          marginBottom: 16,
                          padding: '12px 16px',
                          borderRadius: 12,
                          border: '1px solid rgba(139,92,246,0.25)',
                          background: 'var(--purple-faint)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                          Recibe cada {FREQ_LABELS[state.frequency]}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 16,
                          fontWeight: 600,
                          color: 'var(--purple-light)',
                        }}>
                          {fmtFull(periodicIncome, state.currency)}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bar chart */}
                  <div className="chart-card">
                    <div className="chart-bars">
                      {results.yearlyData.map(d => {
                        const totalPct = (d.balance / maxBalance) * 100
                        const interestPct = d.balance > 0 ? (d.interest / d.balance) * 100 : 0
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
                                  <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 4 }}>
                                    Año {d.year}
                                  </div>
                                  <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>
                                    {fmtFull(d.balance, state.currency)}
                                  </div>
                                  <div style={{ fontSize: 11, color: 'var(--purple-light)' }}>
                                    +{fmtFull(d.interest, state.currency)}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <motion.div
                              style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                overflow: 'hidden', borderRadius: '3px 3px 0 0',
                              }}
                              animate={{ height: `${totalPct}%` }}
                              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                            >
                              <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0,
                                height: `${interestPct}%`,
                                background: 'linear-gradient(180deg, var(--purple-light) 0%, var(--purple) 100%)',
                                boxShadow: isHovered ? '0 0 10px var(--purple-glow)' : '0 0 4px rgba(139,92,246,0.25)',
                              }} />
                              <div style={{
                                position: 'absolute', top: `${interestPct}%`, left: 0, right: 0, bottom: 0,
                                background: 'var(--ink-700)',
                              }} />
                            </motion.div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="chart-x-labels">
                      {results.yearlyData.map(d => {
                        const show = d.year === 1 || d.year === results.yearlyData.length || d.year % stepLabel === 0
                        return (
                          <div key={d.year} className="chart-x-label" style={{ visibility: show ? 'visible' : 'hidden' }}>
                            {d.year}
                          </div>
                        )
                      })}
                    </div>

                    <div className="chart-legend">
                      <div className="legend-item">
                        <div className="legend-dot" style={{ background: 'var(--ink-700)' }} />
                        {product?.contributionMode === 'monthly' ? 'Aportado' : 'Capital'}
                      </div>
                      <div className="legend-item">
                        <div className="legend-dot" style={{ background: 'var(--purple)' }} />
                        Rendimiento
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    height: '100%',
                    minHeight: 280,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 8,
                    color: 'var(--text-4)',
                    textAlign: 'center',
                    border: '1px dashed var(--border-soft)',
                    borderRadius: 16,
                    padding: 32,
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                    <path d="M3 3v18h18M7 16l4-4 4 4 4-6" />
                  </svg>
                  <p style={{ fontSize: 14 }}>Complete los campos para ver el resultado</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Variable income note ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            marginTop: 20,
            padding: '18px 24px',
            borderRadius: 16,
            border: '1px solid rgba(139,92,246,0.2)',
            background: 'rgba(139,92,246,0.04)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
          }}
        >
          <div style={{
            flexShrink: 0,
            width: 34,
            height: 34,
            borderRadius: 8,
            background: 'var(--purple-faint)',
            border: '1px solid rgba(139,92,246,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--purple-light)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
              ¿Busca rendimientos más altos?
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.7, margin: 0 }}>
              Estos son productos de renta fija — predecibles y de bajo riesgo. Para inversionistas con horizonte más largo y mayor tolerancia al riesgo, trabajo con instrumentos de renta variable que históricamente han alcanzado rendimientos del{' '}
              <span style={{ fontWeight: 500, color: 'var(--purple-light)' }}>5% al 40% anual</span>
              . Conversemos para evaluar si encajan con su perfil.{' '}
              <a
                href="/agendar"
                style={{ color: 'var(--purple-light)', textDecoration: 'none', fontWeight: 500 }}
              >
                → Agendar asesoría
              </a>
            </p>
          </div>
        </motion.div>

        {/* ── Disclaimer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            marginTop: 12,
            padding: '10px 20px',
            borderRadius: 20,
            border: '1px solid var(--border-soft)',
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 11, color: 'var(--text-3)', fontStyle: 'italic' }}>
            Las tasas mostradas corresponden a productos específicos de renta fija que Alejandro maneja al momento de esta publicación. Pueden variar. Verifique las tasas vigentes en su asesoría antes de invertir.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
