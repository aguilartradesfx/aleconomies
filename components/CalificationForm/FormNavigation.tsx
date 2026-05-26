import { ArrowLeft, ArrowRight } from 'lucide-react'

type Props = {
  onBack?: () => void
  onNext: () => void
  canGoBack: boolean
  canGoNext: boolean
  nextLabel?: string
}

export default function FormNavigation({
  onBack,
  onNext,
  canGoBack,
  canGoNext,
  nextLabel = 'Siguiente',
}: Props) {
  return (
    <div className="calif-nav">
      <button
        type="button"
        className="calif-back"
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Volver al paso anterior"
      >
        <ArrowLeft size={16} />
        Atrás
      </button>
      <button
        type="button"
        className="calif-next"
        onClick={onNext}
        disabled={!canGoNext}
        aria-disabled={!canGoNext}
      >
        {nextLabel}
        <ArrowRight size={16} />
      </button>
    </div>
  )
}
