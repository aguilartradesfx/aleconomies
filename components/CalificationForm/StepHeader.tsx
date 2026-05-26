type Props = {
  eyebrow: string
  title: React.ReactNode
}

export default function StepHeader({ eyebrow, title }: Props) {
  return (
    <>
      <div className="calif-eyebrow">{eyebrow}</div>
      <h2 className="calif-title">{title}</h2>
    </>
  )
}

// Helper para envolver una palabra clave con el énfasis morado del sitio.
export function Em({ children }: { children: React.ReactNode }) {
  return <em className="em-gradient">{children}</em>
}
