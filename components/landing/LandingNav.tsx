import Image from 'next/image'
import Link from 'next/link'

// Nav slim para la landing de campaña: solo logo + un CTA.
// Sin links de sección — la landing tiene un único objetivo: agendar.
export default function LandingNav() {
  return (
    <div className="nav-wrapper">
      <div className="container">
        <nav className="glass-nav nav-bar" aria-label="Principal">
          <Link href="/" className="nav-logo" aria-label="Aleconomies — inicio">
            <Image
              src="/images/logo-icon-white.png"
              alt="Aleconomies"
              width={34}
              height={34}
              priority
              style={{ objectFit: 'contain' }}
            />
          </Link>

          <div className="nav-right">
            <Link href="/agendar" className="nav-cta">
              Agendar →
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
