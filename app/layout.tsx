import type { Metadata } from 'next'
import { Geist, Geist_Mono, Fraunces } from 'next/font/google'
import './globals.css'
import BackgroundBlobs from '@/components/ui/BackgroundBlobs'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
  style: ['italic', 'normal'],
  axes: ['opsz'],
})

export const metadata: Metadata = {
  title: 'Alejandro [Apellido] — Asesor Financiero Independiente · Costa Rica',
  description:
    'Asesoría financiera 1 a 1 en Costa Rica. Estrategia de inversión personalizada, planificación de retiro y manejo de patrimonio construidos alrededor de sus objetivos.',
  openGraph: {
    title: 'Alejandro [Apellido] — Asesor Financiero Independiente · Costa Rica',
    description:
      'Asesoría financiera 1 a 1 en Costa Rica. Estrategia construida con usted, no copiada de un manual.',
    locale: 'es_CR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}
      >
        <BackgroundBlobs />
        {children}
      </body>
    </html>
  )
}
