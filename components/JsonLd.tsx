export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://aleconomies.com/#person',
  name: 'Alejandro Araya',
  url: 'https://aleconomies.com',
  image: 'https://aleconomies.com/images/alejandro-foto.jpg',
  jobTitle: 'Asesor Financiero Independiente',
  description: 'Asesor financiero independiente en Costa Rica. Asesoría 1 a 1 enfocada en estrategia personalizada de inversión y planificación financiera.',
  knowsAbout: [
    'Asesoría financiera',
    'Planificación de inversiones',
    'Renta fija',
    'Renta variable',
    'Planificación de retiro',
    'Diversificación de portafolio',
    'Gestión patrimonial',
  ],
  sameAs: [
    'https://www.linkedin.com/in/linked-alejandro-araya-inversiones/',
    'https://www.instagram.com/alejaraes/',
    'https://www.facebook.com/share/1DBQ7LK86U/',
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CR',
    addressLocality: 'Costa Rica',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Costa Rica',
  },
}

export const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://aleconomies.com/#service',
  name: 'Aleconomies — Asesoría Financiera Independiente',
  url: 'https://aleconomies.com',
  image: 'https://aleconomies.com/opengraph-image',
  description: 'Asesoría financiera 1 a 1 en Costa Rica. Estrategia personalizada según sus objetivos y perfil de riesgo, con acompañamiento continuo.',
  founder: { '@id': 'https://aleconomies.com/#person' },
  provider: { '@id': 'https://aleconomies.com/#person' },
  serviceType: 'Asesoría financiera y de inversiones',
  areaServed: [{ '@type': 'Country', name: 'Costa Rica' }],
  availableLanguage: ['es', 'es-CR'],
  priceRange: '$$',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios de asesoría financiera',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Llamada de aclaración de servicio',
          description: 'Conversación inicial de 15 minutos sin costo para entender su situación y evaluar si encajamos.',
        },
      },
      {
        '@type': 'Service',
        name: 'Asesoría de inversión personalizada',
        description: 'Diseño de estrategia financiera 1 a 1 según objetivos, plazos y perfil de riesgo.',
      },
    ],
  },
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://aleconomies.com/#website',
  url: 'https://aleconomies.com',
  name: 'Aleconomies',
  description: 'Asesoría financiera independiente 1 a 1 en Costa Rica.',
  publisher: { '@id': 'https://aleconomies.com/#person' },
  inLanguage: 'es-CR',
}

export const aboutPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://aleconomies.com/sobre-nosotros#aboutpage',
  url: 'https://aleconomies.com/sobre-nosotros',
  name: 'Sobre nosotros — Aleconomies',
  description:
    'Conozca a Alejandro Araya y al equipo detrás de Aleconomies. Asesoría financiera independiente en Costa Rica con más de 1.250 clientes asesorados.',
  inLanguage: 'es-CR',
  isPartOf: { '@id': 'https://aleconomies.com/#website' },
  about: { '@id': 'https://aleconomies.com/#person' },
  mainEntity: { '@id': 'https://aleconomies.com/#service' },
}
