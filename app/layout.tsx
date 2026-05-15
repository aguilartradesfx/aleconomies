import type { Metadata } from 'next'
import { Geist, Geist_Mono, Fraunces } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import BackgroundBlobs from '@/components/ui/BackgroundBlobs'
import { JsonLd, personSchema, professionalServiceSchema, websiteSchema } from '@/components/JsonLd'

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

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-XXXXXXX'

export const metadata: Metadata = {
  metadataBase: new URL('https://aleconomies.com'),
  title: {
    default: 'Alejandro Araya — Asesor Financiero Independiente en Costa Rica',
    template: '%s · Alejandro Araya',
  },
  description: 'Asesoría financiera 1 a 1 en Costa Rica. Estrategia personalizada según sus objetivos y perfil de riesgo, con acompañamiento continuo. Diagnóstico inicial sin costo.',
  applicationName: 'Aleconomies',
  authors: [{ name: 'Alejandro Araya', url: 'https://www.linkedin.com/in/linked-alejandro-araya-inversiones/' }],
  generator: 'Next.js',
  keywords: [
    'asesor financiero Costa Rica',
    'asesor de inversiones Costa Rica',
    'planificación financiera Costa Rica',
    'asesoría financiera personalizada',
    'cómo invertir en Costa Rica',
    'inversiones renta fija Costa Rica',
    'asesor de inversiones independiente',
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'Alejandro Araya',
  publisher: 'Alejandro Araya',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'es-CR': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CR',
    url: 'https://aleconomies.com',
    siteName: 'Alejandro Araya — Aleconomies',
    title: 'Alejandro Araya — Asesor Financiero Independiente en Costa Rica',
    description: 'Asesoría 1 a 1 donde la estrategia se construye con usted. Definimos objetivos, ajustamos el riesgo a su perfil real, y lo acompaño cada paso del camino.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Alejandro Araya — Asesor Financiero Independiente en Costa Rica',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alejandro Araya — Asesor Financiero Independiente',
    description: 'Asesoría financiera 1 a 1 en Costa Rica. Estrategia personalizada, sin productos preempaquetados.',
    images: ['/opengraph-image'],
    creator: '@alejaraes',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    apple: '/apple-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CR">
      <head>
        {/* rel="me" — E-E-A-T: vincula identidad verificable */}
        <link rel="me" href="https://www.linkedin.com/in/linked-alejandro-araya-inversiones/" />
        <link rel="me" href="https://www.instagram.com/alejaraes/" />

        {/* GTM — carga después de interacción para no bloquear LCP */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />

        {/* JSON-LD schemas */}
        <JsonLd data={personSchema} />
        <JsonLd data={professionalServiceSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <BackgroundBlobs />
        {children}
      </body>
    </html>
  )
}
