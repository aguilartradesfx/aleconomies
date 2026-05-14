type Props = { children: React.ReactNode }

export default function SectionEyebrow({ children }: Props) {
  return (
    <div className="section-eyebrow">
      <span className="eyebrow-dot" aria-hidden="true" />
      {children}
    </div>
  )
}
