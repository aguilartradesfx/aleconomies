const navLinks = [
  { label: 'Inicio',       href: '#inicio'     },
  { label: 'Para quién',   href: '#para-quien' },
  { label: 'Cómo trabajo', href: '#proceso'    },
  { label: 'Sobre mí',     href: '#sobre'      },
  { label: 'Recursos',     href: '#recursos'   },
  { label: 'FAQ',          href: '#faq'        },
]

function LogoMark() {
  return <div className="logo-mark" aria-hidden="true" />
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1 — Logo + tagline */}
          <div>
            <div className="nav-logo" style={{ textDecoration: 'none' }}>
              <LogoMark />
              <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.3px', color: 'var(--text)' }}>
                alejandro
              </span>
            </div>
            <p className="footer-tagline">
              Asesoría financiera independiente 1 a 1 en Costa Rica. Construyendo claridad
              financiera, una conversación a la vez.
            </p>
          </div>

          {/* Col 2 — Contacto */}
          <div>
            <div className="footer-col-title">Contacto</div>
            <div className="footer-links">
              <a href="mailto:[email]" className="footer-link">[email]</a>
              <a href="https://wa.me/[numero]" className="footer-link">WhatsApp</a>
              <a href="[linkedin]" className="footer-link">LinkedIn</a>
              <a href="[instagram]" className="footer-link">Instagram</a>
            </div>
          </div>

          {/* Col 3 — Navegación */}
          <div>
            <div className="footer-col-title">Navegación</div>
            <div className="footer-links">
              {navLinks.map(link => (
                <a key={link.label} href={link.href} className="footer-link">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <hr className="footer-sep" />

        <p className="footer-disclaimer">
          <strong>Aviso importante:</strong> La información presentada en este sitio tiene fines
          informativos y educativos. No constituye una recomendación personalizada de inversión,
          oferta pública de valores ni asesoría legal o tributaria. Toda decisión de inversión
          implica riesgos y la rentabilidad pasada no garantiza resultados futuros. [Nombre
          completo del asesor] opera bajo [marco regulatorio aplicable — confirmar con Alejandro].
        </p>

        <div className="footer-bottom">
          <span>© {year} Alejandro [Apellido]. Todos los derechos reservados.</span>
          <span>Diseñado y desarrollado por Bralto</span>
        </div>
      </div>
    </footer>
  )
}
