'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Inicio',       href: '#inicio'     },
  { label: 'Para quién',   href: '#para-quien' },
  { label: 'Cómo trabajo', href: '#proceso'    },
  { label: 'Sobre mí',     href: '#sobre'      },
  { label: 'Recursos',     href: '#recursos'   },
]

function LogoMark() {
  return <div className="logo-mark" aria-hidden="true" />
}

export default function Nav() {
  const [active, setActive] = useState(links[0].label)
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav
        className="glass-nav"
        style={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 8px 8px 24px',
        }}
      >
        <a
          href="#inicio"
          className="nav-logo"
          onClick={() => setActive('Inicio')}
        >
          <LogoMark />
          <span>alejandro</span>
        </a>

        {/* Desktop links — cada ítem tiene posición relativa para el indicador */}
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
              <a
                href={link.href}
                className="nav-link"
                data-active={active === link.label ? 'true' : undefined}
                onClick={() => setActive(link.label)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a href="#cta" className="nav-cta nav-cta-desktop">
          Agendar →
        </a>

        {/* Mobile hamburger */}
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
      </nav>

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
              <motion.a
                key={link.label}
                href={link.href}
                className="nav-mobile-link"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.18 }}
                onClick={() => {
                  setActive(link.label)
                  setOpen(false)
                }}
              >
                {link.label}
              </motion.a>
            ))}
            <div className="nav-mobile-divider" />
            <a
              href="#cta"
              className="nav-cta"
              style={{ display: 'block', textAlign: 'center', marginTop: 4 }}
              onClick={() => setOpen(false)}
            >
              Agendar →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
