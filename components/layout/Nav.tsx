'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { label: 'Inicio',         href: '/#inicio'         },
  { label: 'Para quién',     href: '/#para-quien'     },
  { label: 'Cómo trabajo',   href: '/#proceso'        },
  { label: 'Sobre nosotros', href: '/sobre-nosotros'  },
]

function defaultActiveFor(pathname: string): string {
  if (pathname === '/sobre-nosotros') return 'Sobre nosotros'
  return 'Inicio'
}

export default function Nav() {
  const pathname = usePathname()
  const [active, setActive] = useState(() => defaultActiveFor(pathname ?? '/'))
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Wrapper fijo que ocupa el ancho del viewport. La nav adentro vive en
          un .container (max-width 1280, padding 32) para alinearse al ancho
          del resto de las secciones. pointer-events: none deja que el resto
          del sitio reciba clicks fuera del área visible de la nav. */}
      <div className="nav-wrapper">
        <div className="container">
          <nav className="glass-nav nav-bar">
            <Link
              href="/"
              className="nav-logo"
              onClick={() => setActive('Inicio')}
            >
              <Image
                src="/images/logo-icon-white.png"
                alt="Aleconomies"
                width={34}
                height={34}
                priority
                style={{ objectFit: 'contain' }}
              />
            </Link>

            {/* Desktop links — columna central del grid */}
            <ul className="nav-links-desktop" role="list">
              {links.map(link => (
                <li key={link.label} style={{ position: 'relative' }}>
                  {active === link.label && (
                    <motion.div
                      layoutId="nav-pill"
                      className="nav-active-bg"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Link
                    href={link.href}
                    className="nav-link"
                    data-active={active === link.label ? 'true' : undefined}
                    onClick={() => setActive(link.label)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Lado derecho: CTA en desktop, hamburger en mobile */}
            <div className="nav-right">
              <Link href="/agendar" className="nav-cta nav-cta-desktop">
                Agendar →
              </Link>

              <button
                className="nav-hamburger"
                onClick={() => setOpen(prev => !prev)}
                aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={open}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={open ? 'close' : 'open'}
                    initial={{ opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.15 }}
                    style={{ display: 'flex' }}
                  >
                    {open ? <X size={20} /> : <Menu size={20} />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="nav-mobile-menu"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.18 }}
              >
                <Link
                  href={link.href}
                  className="nav-mobile-link"
                  onClick={() => {
                    setActive(link.label)
                    setOpen(false)
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <div className="nav-mobile-divider" />
            <Link
              href="/agendar"
              className="nav-cta"
              style={{ display: 'block', textAlign: 'center', marginTop: 4 }}
              onClick={() => setOpen(false)}
            >
              Agendar →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
