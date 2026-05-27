'use client'

import { useState } from 'react'
import { Calendar, CheckCircle2 } from 'lucide-react'
import StepHeader, { Em } from '../StepHeader'

const GHL_CALENDAR_ID = 'GXK5DdKpcpi3rSKBFdNB'
const GHL_CALENDAR_URL = `https://api.leadconnectorhq.com/widget/booking/${GHL_CALENDAR_ID}`

type Props = {
  // El CRM/dataLayer ya fueron disparados por el contenedor antes de montar este cierre.
  // Este componente es puramente presentacional.
  decisorRequerido: boolean
}

export default function CierreCalificado({ decisorRequerido }: Props) {
  const [showCalendar, setShowCalendar] = useState(false)

  return (
    <>
      <StepHeader
        eyebrow="Paso final"
        title={<>Listo. <Em>Recibimos tu información.</Em></>}
      />

      <div className="calif-cierre-confirm">
        <CheckCircle2 size={22} strokeWidth={1.8} className="calif-cierre-confirm-icon" />
        <div>
          <h3 className="calif-cierre-confirm-title">Te vamos a llamar pronto.</h3>
          <p className="calif-cierre-confirm-body">
            Ya tenemos toda tu información. En las próximas horas hábiles te
            contactamos por WhatsApp o llamada para una conversación inicial sin costo.
            {decisorRequerido && (
              <>
                {' '}Si la decisión requiere consultar con otra persona,
                asegurate de que esté disponible — de lo contrario reprogramamos.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="calif-cierre-divider">
        <span>o si lo preferís</span>
      </div>

      <div className="calif-cierre-acelerar">
        <div className="calif-cierre-acelerar-head">
          <span className="calif-cierre-acelerar-tag">Asesoría · USD 97</span>
          <h3 className="calif-cierre-acelerar-title">
            Agendá tu asesoría de inversión <Em>ahora mismo.</Em>
          </h3>
          <p className="calif-cierre-acelerar-body">
            Si ya estás listo/a, elegí fecha y hora directamente en el calendario.
            Al agendar estás confirmando tu compromiso con la asesoría de inversión
            de USD 97.
          </p>
        </div>

        {!showCalendar ? (
          <button
            type="button"
            onClick={() => setShowCalendar(true)}
            className="btn-primary calif-cierre-acelerar-cta"
          >
            <Calendar size={16} strokeWidth={2} />
            Elegir fecha y hora
          </button>
        ) : (
          <div className="calif-calendar-frame" role="region" aria-label="Calendario de agendamiento">
            <iframe
              src={GHL_CALENDAR_URL}
              title="Calendario Aleconomies"
              loading="lazy"
              allow="payment"
            />
          </div>
        )}
      </div>
    </>
  )
}
