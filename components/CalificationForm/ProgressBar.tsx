type Props = {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: Props) {
  const pct = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0
  return (
    <div className="calif-progress-wrap" aria-hidden="true">
      <div className="calif-progress-meta">
        <span>{`Paso ${current} de ${total}`}</span>
        <span>{`${Math.round(pct)}%`}</span>
      </div>
      <div className="calif-progress-track">
        <div className="calif-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
