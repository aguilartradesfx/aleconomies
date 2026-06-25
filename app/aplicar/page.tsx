import type { Metadata } from 'next'
import Link from 'next/link'
import ShortForm from '@/components/ShortForm/ShortForm'

export const metadata: Metadata = {
  title: 'Agende su diagnóstico financiero sin costo',
  description:
    'Déjenos sus datos y agende un diagnóstico financiero inicial sin costo con Alejandro Araya.',
  alternates: {
    canonical: '/aplicar',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function AplicarPage() {
  return (
    <main className="calif-page">
      <div className="calif-shell">
        <Link href="/" className="aplicar-wordmark">Alejandro Araya</Link>
        <ShortForm />
      </div>
    </main>
  )
}
