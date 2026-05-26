import {
  Armchair,
  Car,
  Home,
  TrendingUp,
  Users,
  PiggyBank,
  PieChart,
} from 'lucide-react'
import StepHeader, { Em } from '../StepHeader'
import { CheckboxGroup } from '../fields'
import { objetivosOpts } from '@/data/calificationForm'
import type { FormState } from '../types'

type Props = {
  form: FormState
  update: (patch: Partial<FormState>) => void
}

const iconMap: Record<string, React.ReactNode> = {
  Armchair:   <Armchair size={18} />,
  Car:        <Car size={18} />,
  Home:       <Home size={18} />,
  TrendingUp: <TrendingUp size={18} />,
  Users:      <Users size={18} />,
  PiggyBank:  <PiggyBank size={18} />,
  PieChart:   <PieChart size={18} />,
}

export default function Step08Objetivos({ form, update }: Props) {
  const options = objetivosOpts.map(o => ({
    value: o.value,
    label: o.label,
    icon: iconMap[o.icon],
  }))

  return (
    <>
      <StepHeader
        eyebrow="Paso 8 — Objetivos"
        title={<>¿Para qué quiere <Em>invertir?</Em></>}
      />
      <CheckboxGroup
        legend="¿Cuál es su objetivo principal al invertir?"
        name="objetivos"
        options={options}
        values={form.objetivos}
        onChange={next => update({ objetivos: next })}
        max={3}
        helper="Seleccione hasta 3 opciones."
        grid
      />
    </>
  )
}
