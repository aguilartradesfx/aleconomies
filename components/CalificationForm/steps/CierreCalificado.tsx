import StepHeader, { Em } from '../StepHeader'

type Props = {
  // El CRM/dataLayer ya fueron disparados por el contenedor antes de montar este cierre.
  // Este componente es puramente presentacional.
  decisorRequerido: boolean
}

export default function CierreCalificado({ decisorRequerido }: Props) {
  return (
    <>
      <StepHeader
        eyebrow="Paso final"
        title={<>Listo. Vamos a <Em>conversar.</Em></>}
      />
      <p className="calif-cierre-body" style={{ marginBottom: 8 }}>
        Su perfil encaja con el tipo de personas a las que puedo ayudar.
        Agendemos una llamada de 5 a 20 minutos para entender mejor sus necesidades.
      </p>

      <div className="calif-calendar-placeholder" role="region" aria-label="Calendario de agendamiento">
        <strong>[Embed de calendario pendiente]</strong>
        Alejandro debe proveer el link de Calendly o Cal.com para embeber aquí.
      </div>

      <p className="calif-data-notice" style={{ marginTop: 0 }}>
        La llamada es <strong style={{ color: 'var(--text-2)' }}>gratuita</strong>{' '}
        y sin compromiso.
        {decisorRequerido && (
          <>
            {' '}Si la decisión requiere consultar con otra persona, asegúrese de
            que esté presente — de lo contrario reprogramaremos.
          </>
        )}
      </p>
    </>
  )
}
