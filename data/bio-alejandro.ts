/**
 * Fuente única de verdad para la bio de Alejandro.
 * Consumida por <About /> (landing) y por /sobre-nosotros para
 * mantener el texto sincronizado en un solo lugar.
 */

export const bioAlejandro = {
  fotoUrl:
    'https://res.cloudinary.com/dm4vljcnv/image/upload/q_auto/f_auto/v1778741064/_A735535_uk3ait.jpg',
  fotoAlt: 'Alejandro Aguilar',

  parrafos: [
    'Nací en una familia donde la educación financiera no estuvo presente. A pesar de estudiar en una buena universidad y cursar una carrera en finanzas, no sabía administrarme personalmente. Esto me llevó a vivir más allá de mis capacidades y, en cuestión de unos cuantos años, caer en punto de quiebra con una deuda superior a los $50.000 a los 21 años.',
    'Después de 3 años de trabajar mucho en mi persona y priorizar el desarrollo personal para levantarme de ese abismo, logré salir de la situación. Sin dejar de lado la ayuda de Dios.',
    'Hoy enseño con el ejemplo cómo usted puede recuperarse de una situación similar y cómo, por medio de las distintas opciones de inversión, puede llegar a multiplicar su dinero con el debido tiempo y paciencia.',
    'No soy un asesor que solo le quiere colocar un producto por colocarlo. Creo fielmente en el poder del acompañamiento personalizado. A partir del conocimiento de sus objetivos y plazos, construyo un plan estratégico que impulsa a las personas hacia rendimientos competitivos, superiores a los que el sistema bancario nacional ofrece.',
  ],

  credenciales: [
    'Especialidad en Finanzas — TEC',
    'Profesor — TEC',
    'Ejecutivo senior',
    '6 años de experiencia',
    '+1.250 clientes asesorados',
  ],

  stats: [
    { valor: '157',    etiqueta: 'Clientes activos' },
    { valor: '+1.250', etiqueta: 'Clientes asesorados' },
    { valor: '6',      etiqueta: 'Años de experiencia' },
    { valor: '$2M',    etiqueta: 'Activos bajo gestión' },
  ],
} as const
