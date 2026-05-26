import Link from 'next/link'
import StepHeader, { Em } from '../StepHeader'

export default function CierreEducativo() {
  return (
    <>
      <StepHeader
        eyebrow="Hablemos con honestidad"
        title={<>Hoy <Em>no es</Em> el momento ideal — y eso está bien.</>}
      />

      <div className="calif-cierre-body">
        <p>
          Gracias por su honestidad al responder. Con la información que me
          compartió, hoy no puedo ofrecerle mi asesoría de inversión con la
          responsabilidad que usted merece.
        </p>
        <p>
          Invertir antes de tener una base financiera sólida —solvencia, control
          de deudas, hábitos de ahorro— suele empeorar la situación en lugar de
          mejorarla. Mi compromiso con usted es decirle la verdad, no venderle
          un producto que no le conviene en este momento.
        </p>
        <p>
          Lo que sí puedo hacer es acompañarlo en el camino con recursos
          gratuitos para que, cuando esté listo, llegue mejor preparado.
        </p>
      </div>

      <div className="calif-cierre-ctas">
        <Link href="/#recursos" className="btn-glass" style={{ justifyContent: 'center' }}>
          Descargar guía gratuita →
        </Link>
        <Link href="/#recursos" className="btn-glass" style={{ justifyContent: 'center' }}>
          Ver los audiolibros recomendados →
        </Link>
        <Link href="/#recursos" className="btn-glass" style={{ justifyContent: 'center' }}>
          Suscribirme al newsletter →
        </Link>
      </div>

      <p className="calif-cierre-signature">
        Cuando esté listo, aquí estaré.
        <br />— Alejandro Araya
      </p>
    </>
  )
}
