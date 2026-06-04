import Image from 'next/image'
import Link from 'next/link'

// Footer slim para la landing — sin menú de navegación que distraiga.
// Solo identidad, disclaimer prudente y copyright.
export default function LandingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <Link
          href="/"
          className="nav-logo"
          style={{ textDecoration: 'none', marginBottom: 16, display: 'inline-flex' }}
        >
          <Image
            src="/images/logo-full-white.png"
            alt="Aleconomies"
            width={140}
            height={36}
            style={{ objectFit: 'contain' }}
          />
        </Link>

        <div className="footer-disclaimer" style={{ maxWidth: 760 }}>
          <p>
            <strong>Asesoría financiera independiente · Costa Rica.</strong> Toda
            inversión implica riesgos, incluida la posible pérdida del capital. La
            información de esta página es de carácter educativo e informativo y no
            constituye una recomendación de inversión personalizada. Cualquier
            estrategia se define de forma individual durante la asesoría.
          </p>
        </div>

        <div className="footer-bottom" style={{ marginTop: 24 }}>
          <span style={{ fontSize: 13, color: 'var(--text-4)' }}>
            © {year} Aleconomies · Alejandro Araya. Todos los derechos reservados.
          </span>
        </div>
      </div>
    </footer>
  )
}
