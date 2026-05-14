import { cn } from '@/lib/utils'

type Props = {
  href?: string
  variant?: 'primary' | 'glass'
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function Button({ href, variant = 'primary', children, className, onClick }: Props) {
  const cls = cn(variant === 'primary' ? 'btn-primary' : 'btn-glass', className)
  if (href) return <a href={href} className={cls}>{children}</a>
  return <button className={cls} onClick={onClick}>{children}</button>
}
