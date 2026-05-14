'use client'

import { useId } from 'react'

interface SliderInputProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  display?: string
}

export default function SliderInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: SliderInputProps) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="slider-group">
      <div className="slider-header">
        <label htmlFor={id} className="slider-label">
          {label}
        </label>
        <span className="slider-value-pill">{display ?? value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="custom-slider"
        style={{ ['--pct' as string]: pct } as React.CSSProperties}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
      />
    </div>
  )
}
