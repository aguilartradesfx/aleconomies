// ─────────────────────────────────────────────────────────────────
// Calculadora de interés compuesto
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
// stocks + bonds + cash siempre suman 100
// ─────────────────────────────────────────────────────────────────

export interface RiskProfile {
  name: string
  return: string
  stocks: number
  bonds: number
  cash: number
  desc: string
}

export const RISK_PROFILES: Record<number, RiskProfile> = {
  1:  { name: 'ultra conservador',    return: '3-5%',   stocks: 10, bonds: 50, cash: 40, desc: 'Preservación absoluta del capital. Aceptación mínima de volatilidad.' },
  2:  { name: 'conservador',          return: '4-6%',   stocks: 20, bonds: 60, cash: 20, desc: 'Estabilidad sobre crecimiento. Para horizontes cortos o aversión clara al riesgo.' },
  3:  { name: 'conservador moderado', return: '5-7%',   stocks: 30, bonds: 55, cash: 15, desc: 'Algo de crecimiento manteniendo bajo nivel de fluctuación.' },
  4:  { name: 'moderado',             return: '6-8%',   stocks: 45, bonds: 45, cash: 10, desc: 'Crecimiento con protección. Para horizontes de 3-5 años.' },
  5:  { name: 'balanceado',           return: '7-10%',  stocks: 60, bonds: 30, cash: 10, desc: 'Equilibrio entre crecimiento y estabilidad. Apropiado para horizontes de 5+ años con tolerancia moderada a fluctuaciones.' },
  6:  { name: 'balanceado activo',    return: '8-11%',  stocks: 70, bonds: 25, cash: 5,  desc: 'Crecimiento prioritario con red de seguridad en bonos.' },
  7:  { name: 'crecimiento',          return: '9-12%',  stocks: 80, bonds: 17, cash: 3,  desc: 'Construcción agresiva de patrimonio. Horizontes de 7+ años.' },
  8:  { name: 'crecimiento alto',     return: '10-13%', stocks: 85, bonds: 13, cash: 2,  desc: 'Mayor exposición al mercado. Tolerancia alta a fluctuaciones de corto plazo.' },
  9:  { name: 'agresivo',             return: '11-14%', stocks: 92, bonds: 6,  cash: 2,  desc: 'Máximo crecimiento potencial. Solo recomendado con horizontes largos.' },
  10: { name: 'ultra agresivo',       return: '12-16%', stocks: 97, bonds: 2,  cash: 1,  desc: 'Exposición casi total a renta variable. Requiere disciplina emocional alta.' },
}
