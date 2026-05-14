import { cn } from '@/lib/utils'

type Variant = 'default' | 'heavy' | 'featured'

const variantClass: Record<Variant, string> = {
  default:  'glass',
  heavy:    'glass-heavy',
  featured: 'glass-featured',
}

type Props = {
  children: React.ReactNode
  variant?: Variant
  className?: string
  style?: React.CSSProperties
}

export default function GlassCard({ children, variant = 'default', className, style }: Props) {
  return (
    <div className={cn(variantClass[variant], className)} style={style}>
      {children}
    </div>
  )
}
