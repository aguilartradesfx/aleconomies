'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileDown, CheckCircle2 } from 'lucide-react'

const STORAGE_KEY = 'exit-modal-shown'

export default function ExitIntentModal() {
  const [visible, setVisible] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return

    let fired = false
    const show = () => {
      if (fired) return
      fired = true
      setVisible(true)
      sessionStorage.setItem(STORAGE_KEY, '1')
    }

    // Desktop: cursor exits document from the top (heading to address bar / close tab)
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show()
    }
    document.addEventListener('mouseleave', onLeave)

    // Fallback for all devices: fire after 60s if exit intent never triggered
    const timer = setTimeout(show, 60_000)

    return () => {
      document.removeEventListener('mouseleave', onLeave)
      clearTimeout(timer)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: POST { name, email } to your CRM / email endpoint (e.g. ConvertKit, Mailchimp, n8n)
    console.log('[exit-intent lead]', { name, email })
    setSubmitted(true)
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="backdrop"
            className="exit-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setVisible(false)}
          />

          <motion.div
            key="modal"
            className="exit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-modal-title"
            initial={{ opacity: 0, y: 48, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <button
              className="exit-modal-close"
              onClick={() => setVisible(false)}
              aria-label="Cerrar"
            >
              <X size={15} />
            </button>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="exit-modal-badge">
                    <span className="exit-modal-badge-dot" />
                    <FileDown size={11} strokeWidth={2} />
                    Guía gratuita
                  </div>

                  <h2 className="exit-modal-title" id="exit-modal-title">
                    Antes de irse,{' '}
                    <em className="em-muted">llévese esto.</em>
                  </h2>

                  <p className="exit-modal-sub">
                    Los 5 errores que cometen los costarricenses al ahorrar — un PDF breve,
                    sin jerga financiera, con pasos concretos. Se lo enviamos directo a su correo.
                  </p>

                  <form className="exit-modal-form" onSubmit={handleSubmit} noValidate>
                    <input
                      className="exit-modal-input"
                      type="text"
                      placeholder="Su nombre"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      autoComplete="name"
                    />
                    <input
                      className="exit-modal-input"
                      type="email"
                      placeholder="Su correo electrónico"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                    <button type="submit" className="exit-modal-submit">
                      Recibir la guía gratis →
                    </button>
                  </form>

                  <p className="exit-modal-privacy">
                    Sin spam. Sus datos no se comparten con terceros.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="success-view"
                  className="exit-modal-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="exit-modal-success-icon">
                    <CheckCircle2 size={28} color="var(--purple)" strokeWidth={1.5} />
                  </div>
                  <div className="exit-modal-success-title">¡Listo! Revise su correo.</div>
                  <p className="exit-modal-success-sub">
                    Le enviaremos la guía en los próximos minutos. Si tiene alguna duda,
                    puede agendar una llamada gratuita de 20 minutos desde esta misma página.
                  </p>
                  <button
                    className="exit-modal-submit"
                    style={{ marginTop: 8 }}
                    onClick={() => setVisible(false)}
                  >
                    Volver al sitio
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
