'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, type LucideIcon } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

interface ResourceCardProps {
  icon: LucideIcon
  eyebrow: string
  title: string
  description: string
  ctaLabel: string
  href?: string
  onClick?: () => void
  ariaLabel?: string
  index?: number
}

export default function ResourceCard({
  icon: Icon,
  eyebrow,
  title,
  description,
  ctaLabel,
  href,
  onClick,
  ariaLabel,
  index = 0,
}: ResourceCardProps) {
  const isLink = !!href && !onClick
  const label = ariaLabel ?? `Abrir ${title}`

  const inner = (
    <>
      <div className="resource-card-icon" aria-hidden="true">
        <Icon size={26} strokeWidth={1.5} />
      </div>
      <div className="resource-card-eyebrow">
        <span className="card-label-dot" />
        {eyebrow}
      </div>
      <h3 className="resource-card-title">{title}</h3>
      <p className="resource-card-desc">{description}</p>
      <div className="resource-card-footer">
        <span className="resource-card-cta">
          {ctaLabel}
          <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
        </span>
      </div>
    </>
  )

  const motionProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, delay: index * 0.08, ease },
    whileHover: { y: -4, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } },
    className: 'glass resource-card',
  }

  if (isLink) {
    return (
      <motion.a {...motionProps} href={href} aria-label={label}>
        {inner}
      </motion.a>
    )
  }

  return (
    <motion.button {...motionProps} type="button" onClick={onClick} aria-label={label}>
      {inner}
    </motion.button>
  )
}
