import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CalificationForm from '@/components/CalificationForm/CalificationForm'

export const metadata: Metadata = {
  title: 'Agendar una llamada',
  description:
    'Formulario de calificación previo a la asesoría financiera con Alejandro Araya. Tomará entre 5 y 8 minutos.',
  alternates: {
    canonical: '/agendar',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function AgendarPage() {
  return (
    <>
      <Nav />
      <main className="calif-page">
        <CalificationForm />
      </main>
      <Footer />
    </>
  )
}
