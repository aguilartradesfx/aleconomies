export interface MiembroEquipo {
  id: string
  nombre: string
  rol: string
  /** Opcional: mostrar bajo el rol si está presente. */
  bio?: string
  /** Dejar como null si aún no hay foto: el componente mostrará un placeholder glass. */
  fotoUrl: string | null
  linkedin?: string
  /** Opcional: enlace que aparece junto al rol, separado por un guion. */
  rolLink?: { label: string; url: string }
}

export const equipo: MiembroEquipo[] = [
  {
    id: 'genesis-altamirano',
    nombre: 'Génesis Altamirano',
    rol: 'Equipo comercial',
    fotoUrl:
      'https://res.cloudinary.com/dm4vljcnv/image/upload/q_auto/f_auto/v1779765966/WhatsApp_Image_2026-05-25_at_20.08.11_vpzhyl.jpg',
  },
  {
    id: 'alejandro-aguilar',
    nombre: 'Alejandro Aguilar',
    rol: 'Director de Marketing',
    rolLink: { label: 'Bralto.io', url: 'https://bralto.io' },
    fotoUrl:
      'https://res.cloudinary.com/dm4vljcnv/image/upload/q_auto/f_auto/v1779765961/Layer_0_rsigdh.jpg',
  },
  {
    id: 'yoselin-salas',
    nombre: 'Yoselin Salas',
    rol: 'Appointment Setter',
    fotoUrl:
      'https://res.cloudinary.com/dm4vljcnv/image/upload/q_auto/f_auto/v1779765961/WhatsApp_Image_2026-05-25_at_20.03.52_wjkhg4.jpg',
  },
  {
    id: 'pablo-brenes',
    nombre: 'Pablo Brenes',
    rol: 'Appointment Setter',
    fotoUrl:
      'https://res.cloudinary.com/dm4vljcnv/image/upload/q_auto/f_auto/v1779765962/WhatsApp_Image_2026-05-25_at_20.04.46_ur6v9c.jpg',
  },
  {
    id: 'moises-valverde',
    nombre: 'Moisés Valverde',
    rol: 'Asistencia administrativa',
    fotoUrl:
      'https://res.cloudinary.com/dm4vljcnv/image/upload/q_auto/f_auto/v1779765963/WhatsApp_Image_2026-05-25_at_20.05.49_jsscmi.jpg',
  },
  {
    id: 'valeria-solano',
    nombre: 'Valeria Solano',
    rol: 'Edición y asistencia marketing',
    fotoUrl:
      'https://res.cloudinary.com/dm4vljcnv/image/upload/q_auto/f_auto/v1779830010/WhatsApp_Image_2026-05-26_at_05.38.51_h3zr3g.jpg',
  },
]
