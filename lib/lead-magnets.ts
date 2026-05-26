// Catálogo de los 11 lead magnets de ALECONOMIES.
// Los archivos viven en /public/lead-magnets/ y son entregables del cliente
// (HTML viewer standalone + PDF descargable). No tocar el contenido.

export type LeadMagnetStage = 'despertar' | 'educar' | 'convertir'
export type LeadMagnetBadge = 'anchor' | 'confidence' | 'seasonal'

export interface LeadMagnet {
  slug: string
  title: string
  description: string
  stage: LeadMagnetStage
  pages: number
  htmlPath: string
  pdfPath: string
  badges?: LeadMagnetBadge[]
}

export const leadMagnets: LeadMagnet[] = [
  {
    slug: 'dinero-dormido',
    title: 'El dinero dormido',
    description:
      'Tu plata está cómoda en el banco. Demasiado cómoda. Con números reales de Costa Rica, cuánto te cuesta dejarla dormir.',
    stage: 'despertar',
    pages: 8,
    htmlPath: '/lead-magnets/pieza-1-dinero-dormido.html',
    pdfPath:  '/lead-magnets/pieza-1-dinero-dormido.pdf',
  },
  {
    slug: 'siete-mentiras',
    title: '7 mentiras que te contaron sobre el dinero',
    description:
      'Lo que aprendiste sobre la plata —en casa, en el colegio, con los amigos— probablemente te está costando. Desmontamos siete mitos culturales ticos.',
    stage: 'despertar',
    pages: 10,
    htmlPath: '/lead-magnets/pieza-2-siete-mentiras.html',
    pdfPath:  '/lead-magnets/pieza-2-siete-mentiras.pdf',
  },
  {
    slug: 'test-90-dias',
    title: '¿Tu plata trabaja o duerme?',
    description:
      'Test de los 90 días. Respondé 5 preguntas y en 2 minutos sabés si tu dinero está creciendo o perdiendo terreno.',
    stage: 'despertar',
    pages: 5,
    htmlPath: '/lead-magnets/pieza-3-test-90-dias.html',
    pdfPath:  '/lead-magnets/pieza-3-test-90-dias.pdf',
  },
  {
    slug: 'entende-el-mercado',
    title: 'Entendé el mercado de inversiones',
    description:
      'Un mapa claro de qué existe para invertir tu plata, en lenguaje tico. Siete instrumentos explicados con honestidad, sin recomendaciones disfrazadas.',
    stage: 'educar',
    pages: 14,
    htmlPath: '/lead-magnets/pieza-4-mercado-inversiones.html',
    pdfPath:  '/lead-magnets/pieza-4-mercado-inversiones.pdf',
    badges: ['anchor'],
  },
  {
    slug: 'colones-o-dolares',
    title: '¿Colones o dólares?',
    description:
      'La decisión de moneda que casi nadie analiza bien en Costa Rica. Por qué la respuesta correcta no es ni "comprá dólares" ni "quedate en colones".',
    stage: 'educar',
    pages: 7,
    htmlPath: '/lead-magnets/pieza-5-colones-dolares.html',
    pdfPath:  '/lead-magnets/pieza-5-colones-dolares.pdf',
  },
  {
    slug: 'mapa-del-riesgo',
    title: 'El mapa del riesgo',
    description:
      '¿Sos conservador, moderado o arriesgado con tu dinero? Descubrilo en 8 preguntas y entendé qué significa para la forma en que deberías invertir.',
    stage: 'educar',
    pages: 7,
    htmlPath: '/lead-magnets/pieza-6-mapa-riesgo.html',
    pdfPath:  '/lead-magnets/pieza-6-mapa-riesgo.pdf',
  },
  {
    slug: 'detectar-estafas',
    title: 'Cómo detectar (y huir de) una estafa de inversión',
    description:
      'Las 8 señales claras de que alguien quiere robarte con una falsa inversión, más 4 preguntas que te protegen. Aprendé a verlas antes de perder un colón.',
    stage: 'educar',
    pages: 6,
    htmlPath: '/lead-magnets/pieza-7-detectar-estafas.html',
    pdfPath:  '/lead-magnets/pieza-7-detectar-estafas.pdf',
    badges: ['confidence'],
  },
  {
    slug: 'plan-6-meses',
    title: 'De ahorrador a inversionista en 6 meses',
    description:
      'Un plan realista, mes a mes, para empezar a invertir sin poner tu vida en pausa ni necesitar ser un experto.',
    stage: 'convertir',
    pages: 9,
    htmlPath: '/lead-magnets/pieza-9-plan-6-meses.html',
    pdfPath:  '/lead-magnets/pieza-9-plan-6-meses.pdf',
  },
  {
    slug: 'aguinaldo',
    title: 'Aguinaldo inteligente',
    description:
      'No dejés que tu aguinaldo desaparezca en enero. Cómo convertir ese dinero en el arranque de tu patrimonio.',
    stage: 'convertir',
    pages: 6,
    htmlPath: '/lead-magnets/pieza-10-aguinaldo.html',
    pdfPath:  '/lead-magnets/pieza-10-aguinaldo.pdf',
    badges: ['seasonal'],
  },
  {
    slug: 'doce-preguntas',
    title: '12 preguntas que le tenés que hacer a tu asesor',
    description:
      'Antes de confiarle tu dinero a alguien, hacele estas 12 preguntas. Si no las responde con claridad, ya tenés tu respuesta.',
    stage: 'convertir',
    pages: 5,
    htmlPath: '/lead-magnets/pieza-11-12-preguntas.html',
    pdfPath:  '/lead-magnets/pieza-11-12-preguntas.pdf',
    badges: ['confidence'],
  },
  {
    slug: 'historias-de-plata',
    title: 'Historias de plata',
    description:
      'Tres ticos, tres puntos de partida distintos, tres decisiones que les cambiaron las finanzas. ¿En cuál te ves?',
    stage: 'convertir',
    pages: 8,
    htmlPath: '/lead-magnets/pieza-12-historias-plata.html',
    pdfPath:  '/lead-magnets/pieza-12-historias-plata.pdf',
  },
]

export function getLeadMagnetBySlug(slug: string): LeadMagnet | undefined {
  return leadMagnets.find(m => m.slug === slug)
}

export const STAGE_LABEL: Record<LeadMagnetStage, string> = {
  despertar: 'Despertar',
  educar:    'Educar',
  convertir: 'Convertir',
}

export const BADGE_LABEL: Record<LeadMagnetBadge, string> = {
  anchor:     'Guía ancla',
  confidence: 'Máxima confianza',
  seasonal:   'Estacional',
}
