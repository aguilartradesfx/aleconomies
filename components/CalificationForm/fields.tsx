'use client'

import { useId } from 'react'

// ── RadioGroup ──────────────────────────────────────────────────────────────

type RadioGroupProps<V extends string> = {
  legend: string
  name: string
  options: ReadonlyArray<{ value: V; label: string; desc?: string }>
  value: V | null
  onChange: (v: V) => void
  helper?: string
  grid?: boolean
}

export function RadioGroup<V extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  helper,
  grid,
}: RadioGroupProps<V>) {
  return (
    <fieldset className="calif-fieldset">
      <legend className="calif-legend">{legend}</legend>
      {helper && <p className="calif-helper">{helper}</p>}
      <div className={grid ? 'calif-options-grid' : 'calif-options'}>
        {options.map(opt => {
          const checked = value === opt.value
          return (
            <label
              key={opt.value}
              className="calif-pill"
              data-checked={checked ? 'true' : undefined}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
              />
              <span className="calif-pill-mark" aria-hidden="true" />
              <span className="calif-pill-label">{opt.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

// ── CheckboxGroup ───────────────────────────────────────────────────────────

type CheckboxGroupProps = {
  legend: string
  name: string
  options: ReadonlyArray<{ value: string; label: string; icon?: React.ReactNode }>
  values: string[]
  onChange: (next: string[]) => void
  max?: number
  helper?: string
  grid?: boolean
}

export function CheckboxGroup({
  legend,
  name,
  options,
  values,
  onChange,
  max,
  helper,
  grid,
}: CheckboxGroupProps) {
  const limitReached = typeof max === 'number' && values.length >= max
  return (
    <fieldset className="calif-fieldset">
      <legend className="calif-legend">{legend}</legend>
      {helper && <p className="calif-helper">{helper}</p>}
      <div className={grid ? 'calif-options-grid' : 'calif-options'}>
        {options.map(opt => {
          const checked = values.includes(opt.value)
          const disabled = !checked && limitReached
          return (
            <label
              key={opt.value}
              className="calif-pill calif-pill-check"
              data-checked={checked ? 'true' : undefined}
              aria-disabled={disabled || undefined}
            >
              <input
                type="checkbox"
                name={name}
                value={opt.value}
                checked={checked}
                disabled={disabled}
                onChange={() => {
                  if (checked) onChange(values.filter(v => v !== opt.value))
                  else onChange([...values, opt.value])
                }}
              />
              <span className="calif-pill-mark" aria-hidden="true" />
              {opt.icon && <span className="calif-pill-icon">{opt.icon}</span>}
              <span className="calif-pill-label">{opt.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

// ── TextField ───────────────────────────────────────────────────────────────

type TextFieldProps = {
  label: string
  name: string
  value: string
  onChange: (v: string) => void
  type?: 'text' | 'email' | 'tel'
  placeholder?: string
  autoComplete?: string
  invalid?: boolean
  error?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  autoFocus?: boolean
}

export function TextField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  invalid,
  error,
  inputMode,
  autoFocus,
}: TextFieldProps) {
  const id = useId()
  return (
    <div className="calif-field">
      <label htmlFor={id} className="calif-label">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="calif-input"
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={invalid || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        autoFocus={autoFocus}
      />
      {error && <p id={`${id}-error`} className="calif-error">{error}</p>}
    </div>
  )
}

// ── NumberField ─────────────────────────────────────────────────────────────

type NumberFieldProps = {
  label: string
  name: string
  value: number | null
  onChange: (v: number | null) => void
  min?: number
  max?: number
  helper?: string
  invalid?: boolean
  error?: string
}

export function NumberField({
  label,
  name,
  value,
  onChange,
  min,
  max,
  helper,
  invalid,
  error,
}: NumberFieldProps) {
  const id = useId()
  return (
    <div className="calif-field">
      <label htmlFor={id} className="calif-label">{label}</label>
      <input
        id={id}
        name={name}
        type="number"
        inputMode="numeric"
        value={value ?? ''}
        onChange={e => {
          const raw = e.target.value
          if (raw === '') onChange(null)
          else onChange(Number(raw))
        }}
        min={min}
        max={max}
        className="calif-input"
        aria-invalid={invalid || undefined}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
      />
      {helper && !error && <p id={`${id}-helper`} className="calif-helper" style={{ marginTop: 6, marginBottom: 0 }}>{helper}</p>}
      {error && <p id={`${id}-error`} className="calif-error">{error}</p>}
    </div>
  )
}

// ── TextArea ────────────────────────────────────────────────────────────────

type TextAreaProps = {
  label: string
  name: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  helper?: string
  minChars?: number
  rows?: number
  large?: boolean
}

export function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  helper,
  minChars,
  rows,
  large,
}: TextAreaProps) {
  const id = useId()
  const count = value.length
  const met = minChars ? count >= minChars : true
  return (
    <div className="calif-field">
      <label htmlFor={id} className="calif-label">{label}</label>
      <div className="calif-textarea-wrap">
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={large ? 'calif-textarea calif-textarea-large' : 'calif-textarea'}
          placeholder={placeholder}
          rows={rows}
        />
        {typeof minChars === 'number' && (
          <span className="calif-count" data-met={met ? 'true' : undefined}>
            {`${count} / ${minChars} mínimo`}
          </span>
        )}
      </div>
      {helper && <p className="calif-helper" style={{ marginTop: 6, marginBottom: 0 }}>{helper}</p>}
    </div>
  )
}

// ── ConsentCheckbox ─────────────────────────────────────────────────────────

type ConsentProps = {
  checked: boolean
  onChange: (v: boolean) => void
  children: React.ReactNode
  name?: string
}

export function ConsentCheckbox({ checked, onChange, children, name }: ConsentProps) {
  return (
    <label className="calif-consent" data-checked={checked ? 'true' : undefined}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span className="calif-consent-box" aria-hidden="true" />
      <span className="calif-consent-text">{children}</span>
    </label>
  )
}
