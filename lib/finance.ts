// ─────────────────────────────────────────────────────────────────
// Productos de inversión — 5 instrumentos reales
// ─────────────────────────────────────────────────────────────────

export type ContributionMode = 'lump-sum' | 'monthly'
export type PaymentFrequency = 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'maturity'
export type Currency = 'CRC' | 'USD'
export type ProductId = 'A' | 'B' | 'C' | 'D' | 'E'

export interface Product {
  id: ProductId
  name: string
  description: string
  contributionMode: ContributionMode
  allowedCurrencies: Currency[]
  minInvestment: Partial<Record<Currency, number>>
  terms: number[]
  termUnit: 'months' | 'years'
  rates: Partial<Record<Currency, Record<number, number>>>
  paymentFrequencies?: PaymentFrequency[]
  hasPeriodicIncome: boolean
  presetAmounts: Partial<Record<Currency, number[]>>
}

export const PRODUCTS: Product[] = [
  {
    id: 'A',
    name: 'Al Vencimiento',
    description: 'Invierte una suma inicial y recibe los rendimientos al final del plazo.',
    contributionMode: 'lump-sum',
    allowedCurrencies: ['CRC', 'USD'],
    minInvestment: { CRC: 500_000, USD: 1_000 },
    terms: [6, 9, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 180],
    termUnit: 'months',
    rates: {
      CRC: { 6: 4.35, 9: 5.35, 12: 7.35, 24: 7.85, 36: 8.35, 48: 8.85, 60: 9.10, 72: 9.25, 84: 9.35, 96: 9.45, 108: 9.65, 120: 9.90, 180: 10.15 },
      USD: { 6: 3.26, 9: 4.15, 12: 5.90, 24: 6.90, 36: 8.15, 48: 8.65, 60: 9.15, 72: 9.25, 84: 9.35, 96: 9.45, 108: 9.65, 120: 9.90, 180: 10.15 },
    },
    hasPeriodicIncome: false,
    presetAmounts: {
      CRC: [500_000, 1_000_000, 2_500_000, 5_000_000, 10_000_000, 20_000_000, 30_000_000, 40_000_000, 50_000_000, 100_000_000],
      USD: [1_000, 2_500, 5_000, 10_000, 25_000, 40_000, 50_000, 75_000, 100_000, 150_000, 200_000],
    },
  },
  {
    id: 'B',
    name: 'Ingresos Pasivos',
    description: 'Invierte una suma inicial y recibe los rendimientos de forma periódica: mensual, trimestral, semestral o anual.',
    contributionMode: 'lump-sum',
    allowedCurrencies: ['CRC', 'USD'],
    minInvestment: { CRC: 10_000_000, USD: 20_000 },
    terms: [12, 18, 24, 30, 36, 48, 60, 120],
    termUnit: 'months',
    rates: {
      CRC: { 12: 7.00, 18: 7.25, 24: 7.50, 30: 7.75, 36: 8.00, 48: 8.50, 60: 8.75, 120: 9.55 },
      USD: { 12: 5.65, 18: 6.15, 24: 6.65, 30: 7.40, 36: 7.90, 48: 8.40, 60: 8.90, 120: 9.65 },
    },
    paymentFrequencies: ['monthly', 'quarterly', 'semiannual', 'annual'],
    hasPeriodicIncome: true,
    presetAmounts: {
      CRC: [10_000_000, 15_000_000, 20_000_000, 30_000_000, 40_000_000, 50_000_000, 100_000_000],
      USD: [20_000, 30_000, 40_000, 50_000, 75_000, 100_000, 150_000, 200_000],
    },
  },
  {
    id: 'C',
    name: 'Aporte Mensual a Corto Plazo',
    description: 'Realiza aportes mensuales durante un plazo corto. Ideal para metas de 1 a 3 años.',
    contributionMode: 'monthly',
    allowedCurrencies: ['CRC', 'USD'],
    minInvestment: { CRC: 250_000, USD: 500 },
    terms: [1, 2, 3],
    termUnit: 'years',
    rates: {
      CRC: { 1: 7.50, 2: 9.50, 3: 10.00 },
      USD: { 1: 3.75, 2: 5.00, 3: 6.00 },
    },
    hasPeriodicIncome: false,
    presetAmounts: {
      CRC: [250_000, 500_000, 1_000_000, 2_000_000, 5_000_000],
      USD: [500, 1_000, 2_000, 4_000, 10_000],
    },
  },
  {
    id: 'D',
    name: 'Aporte Mensual a Mediano y Largo Plazo',
    description: 'Realiza aportes mensuales durante un plazo largo. Ideal para construir patrimonio a 5 años o más.',
    contributionMode: 'monthly',
    allowedCurrencies: ['CRC', 'USD'],
    minInvestment: { CRC: 25_000, USD: 50 },
    terms: [5, 10, 15, 20, 25],
    termUnit: 'years',
    rates: {
      CRC: { 5: 11.50, 10: 11.75, 15: 12.00, 20: 12.25, 25: 12.50 },
      USD: { 5: 7.00, 10: 7.50, 15: 7.75, 20: 8.00, 25: 8.25 },
    },
    hasPeriodicIncome: false,
    presetAmounts: {
      CRC: [25_000, 100_000, 250_000, 500_000, 1_000_000],
      USD: [50, 200, 500, 1_000, 2_000],
    },
  },
  {
    id: 'E',
    name: 'Inversión internacional',
    description: 'Aporte único en dólares colocado en mercados internacionales. Pagos al final del plazo o de forma periódica.',
    contributionMode: 'lump-sum',
    allowedCurrencies: ['USD'],
    minInvestment: { USD: 10_000 },
    terms: [1, 2, 3],
    termUnit: 'years',
    rates: {
      USD: { 1: 10, 2: 11, 3: 12 },
    },
    paymentFrequencies: ['quarterly', 'semiannual', 'annual', 'maturity'],
    hasPeriodicIncome: true,
    presetAmounts: {
      USD: [10_000, 25_000, 50_000, 100_000, 250_000],
    },
  },
]

export interface YearData {
  year: number
  balance: number
  contributed: number
  interest: number
}

export interface LumpSumResult {
  finalAmount: number
  totalContributed: number
  interest: number
  yearlyData: YearData[]
}

export function calcLumpSum(
  principal: number,
  annualRatePct: number,
  term: number,
  termUnit: 'months' | 'years',
): LumpSumResult {
  const years = termUnit === 'months' ? term / 12 : term
  const r = annualRatePct / 100
  const finalAmount = principal * Math.pow(1 + r, years)
  const interest = finalAmount - principal
  const wholeYears = Math.max(1, Math.floor(years))
  const yearlyData: YearData[] = Array.from({ length: wholeYears }, (_, i) => {
    const y = i + 1
    const bal = principal * Math.pow(1 + r, Math.min(y, years))
    return { year: y, balance: bal, contributed: principal, interest: bal - principal }
  })
  return { finalAmount, totalContributed: principal, interest, yearlyData }
}

export interface MonthlyResult {
  finalAmount: number
  totalContributed: number
  interest: number
  yearlyData: YearData[]
}

export function calcMonthly(
  monthlyContribution: number,
  annualRatePct: number,
  years: number,
): MonthlyResult {
  const monthlyRate = annualRatePct / 100 / 12
  let balance = 0
  let totalContributed = 0
  const yearlyData: YearData[] = []
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution
      totalContributed += monthlyContribution
    }
    yearlyData.push({ year: y, balance, contributed: totalContributed, interest: balance - totalContributed })
  }
  return { finalAmount: balance, totalContributed, interest: balance - totalContributed, yearlyData }
}

export function calcPeriodicIncome(
  principal: number,
  annualRatePct: number,
  frequency: PaymentFrequency,
): number {
  if (frequency === 'maturity') return 0
  const annual = principal * (annualRatePct / 100)
  const divisors: Record<Exclude<PaymentFrequency, 'maturity'>, number> = {
    monthly: 12, quarterly: 4, semiannual: 2, annual: 1,
  }
  return annual / divisors[frequency as Exclude<PaymentFrequency, 'maturity'>]
}

// ─────────────────────────────────────────────────────────────────
// Calculadora de interés compuesto (legacy — usada por tests)
// ─────────────────────────────────────────────────────────────────

export interface YearData {
  year: number
  balance: number
  contributed: number
  interest: number
}

export function calculateCompoundGrowth(
  initial: number,
  monthlyContribution: number,
  years: number,
  annualRatePct: number,
): YearData[] {
  const monthlyRate = annualRatePct / 100 / 12
  const data: YearData[] = []
  let balance = initial
  let totalContributed = initial

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution
      totalContributed += monthlyContribution
    }
    data.push({
      year: y,
      balance,
      contributed: totalContributed,
      interest: balance - totalContributed,
    })
  }
  return data
}

// ─────────────────────────────────────────────────────────────────
// Perfiles de riesgo — 10 niveles
// 7 clases de activos, porcentajes suman 100 por fila
// ─────────────────────────────────────────────────────────────────

export interface AssetAllocation {
  stocks: number      // Acciones
  bonds: number       // Bonos
  indexed: number     // Fondos Indexados
  realEstate: number  // Inmobiliario
  crypto: number      // Cripto
  cash: number        // Efectivo
  options: number     // Opciones
  litigation: number  // Litigios
  insurers: number    // Aseguradoras
  offshore: number    // Offshore
}

export interface RiskProfile {
  name: string
  return: string
  allocation: AssetAllocation
  desc: string
}

export const RISK_PROFILES: Record<number, RiskProfile> = {
  1:  { name: 'ultra conservador',    return: '7-9%',   allocation: { stocks: 0,  bonds: 30, indexed: 0,  realEstate: 0,  crypto: 0,  cash: 70, options: 0,  litigation: 0, insurers: 0, offshore: 0 }, desc: 'Preservación absoluta del capital. Aceptación mínima de volatilidad.' },
  2:  { name: 'conservador',          return: '8-11%',  allocation: { stocks: 0,  bonds: 50, indexed: 10, realEstate: 5,  crypto: 0,  cash: 35, options: 0,  litigation: 0, insurers: 0, offshore: 0 }, desc: 'Estabilidad sobre crecimiento. Para horizontes cortos o aversión clara al riesgo.' },
  3:  { name: 'conservador moderado', return: '9-13%',  allocation: { stocks: 5,  bonds: 45, indexed: 20, realEstate: 10, crypto: 0,  cash: 20, options: 0,  litigation: 0, insurers: 0, offshore: 0 }, desc: 'Algo de crecimiento manteniendo bajo nivel de fluctuación.' },
  4:  { name: 'moderado',             return: '11-16%', allocation: { stocks: 10, bonds: 35, indexed: 25, realEstate: 15, crypto: 2,  cash: 10, options: 3,  litigation: 0, insurers: 0, offshore: 0 }, desc: 'Crecimiento con protección. Para horizontes de 3-5 años.' },
  5:  { name: 'balanceado',           return: '13-19%', allocation: { stocks: 15, bonds: 25, indexed: 30, realEstate: 15, crypto: 5,  cash: 5,  options: 5,  litigation: 0, insurers: 0, offshore: 0 }, desc: 'Equilibrio entre crecimiento y estabilidad. Apropiado para horizontes de 5+ años con tolerancia moderada a fluctuaciones.' },
  6:  { name: 'balanceado activo',    return: '15-22%', allocation: { stocks: 20, bonds: 20, indexed: 30, realEstate: 15, crypto: 8,  cash: 2,  options: 5,  litigation: 0, insurers: 0, offshore: 0 }, desc: 'Crecimiento prioritario con red de seguridad en bonos.' },
  7:  { name: 'crecimiento',          return: '17-25%', allocation: { stocks: 25, bonds: 12, indexed: 30, realEstate: 15, crypto: 10, cash: 0,  options: 8,  litigation: 0, insurers: 0, offshore: 0 }, desc: 'Construcción agresiva de patrimonio. Horizontes de 7+ años.' },
  8:  { name: 'crecimiento alto',     return: '20-30%', allocation: { stocks: 28, bonds: 7,  indexed: 26, realEstate: 14, crypto: 12, cash: 0,  options: 7,  litigation: 1, insurers: 2, offshore: 3 }, desc: 'Mayor exposición al mercado. Tolerancia alta a fluctuaciones de corto plazo.' },
  9:  { name: 'agresivo',             return: '25-35%', allocation: { stocks: 33, bonds: 2,  indexed: 23, realEstate: 11, crypto: 15, cash: 0,  options: 6,  litigation: 2, insurers: 3, offshore: 5 }, desc: 'Máximo crecimiento potencial. Solo recomendado con horizontes largos.' },
  10: { name: 'ultra agresivo',       return: '30-40%', allocation: { stocks: 35, bonds: 0,  indexed: 18, realEstate: 8,  crypto: 17, cash: 0,  options: 7,  litigation: 3, insurers: 5, offshore: 7 }, desc: 'Exposición casi total a renta variable. Requiere disciplina emocional alta.' },
}
