import Image from 'next/image'
import Link from 'next/link'

const navLinks = [
  { label: 'Inicio',         href: '/#inicio'         },
  { label: 'Para quién',     href: '/#para-quien'     },
  { label: 'Cómo trabajo',   href: '/#proceso'        },
  { label: 'Sobre mí',       href: '/#sobre'          },
  { label: 'Sobre nosotros', href: '/sobre-nosotros'  },
  { label: 'Recursos',       href: '/#recursos'       },
  { label: 'FAQ',            href: '/#faq'            },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1 — Logo + tagline */}
          <div>
            <Link href="/" className="nav-logo" style={{ textDecoration: 'none', marginBottom: 12, display: 'inline-flex' }}>
              <Image
                src="/images/logo-full-white.png"
                alt="Aleconomies"
                width={140}
                height={36}
                style={{ objectFit: 'contain' }}
              />
            </Link>
            <p className="footer-tagline">
              Asesoría financiera independiente 1 a 1 en Costa Rica. Construyendo claridad
              financiera, una conversación a la vez.
            </p>
          </div>

          {/* Col 2 — Contacto */}
          <div>
            <div className="footer-col-title">Contacto</div>
            <div className="footer-links">
              <a href="mailto:aleconomies@gmail.com" className="footer-link">Email</a>
              <a href="https://wa.me/[numero]" className="footer-link" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a href="https://www.linkedin.com/in/linked-alejandro-araya-inversiones/" className="footer-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://www.instagram.com/alejaraes/" className="footer-link" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>

          {/* Col 3 — Navegación */}
          <div>
            <div className="footer-col-title">Navegación</div>
            <div className="footer-links">
              {navLinks.map(link => (
                <Link key={link.label} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <hr className="footer-sep" />

        <div className="footer-disclaimer">
          <p>
            <strong>Aviso importante:</strong> Alejandro Araya presta servicios de asesoría
            financiera y de inversión de forma independiente. Esta asesoría es personalizada y
            se adapta a los objetivos, plazos, perfil de riesgo y necesidades de cada
            inversionista.
          </p>
          <p>
            Las inversiones se canalizan a través de puestos de bolsa de comercio inscritos
            ante BOLCOMER, Bolsa de Comercio de Costa Rica —entidad sujeta a la vigilancia del
            Banco Central de Costa Rica conforme al Código de Comercio—, así como a través de
            firmas de inversión internacionales reguladas en sus respectivas jurisdicciones. El
            inversionista es responsable de verificar el estatus regulatorio y de supervisión
            de cada entidad y producto antes de invertir.
          </p>
          <p>
            Toda inversión nacional está sujeta a la Ley 8204 sobre legitimación de capitales.
            Por ello, cualquier monto a invertir debe acompañarse de la documentación que
            acredite el origen lícito de los fondos (constancia salarial, comprobante de venta,
            liquidación, u otro ingreso debidamente respaldado).
          </p>
          <p>
            El contenido publicado en este sitio tiene fines exclusivamente informativos y
            educativos. No constituye oferta pública de valores, recomendación de inversión
            personalizada, ni garantía de rendimiento. Toda inversión conlleva riesgos,
            incluida la posible pérdida parcial o total del capital invertido. Los rendimientos
            pasados no garantizan rendimientos futuros. Antes de tomar cualquier decisión de
            inversión, asegúrese de comprender el producto, sus costos, su régimen de
            supervisión y los riesgos asociados.
          </p>
        </div>

        <div className="footer-bottom">
          <span>© {year} Alejandro Araya. Todos los derechos reservados.</span>
          <span>
            Diseñado y desarrollado por{' '}
            <a
              href="https://bralto.io"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              style={{ textDecoration: 'underline', textUnderlineOffset: 4 }}
            >
              Bralto
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
