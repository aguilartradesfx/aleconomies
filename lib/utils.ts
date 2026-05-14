export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatColones(n: number): string {
  if (!isFinite(n)) return '₡0'
  const abs = Math.abs(n)
  if (abs >= 1_000_000_000) return '₡' + (n / 1_000_000_000).toFixed(1) + 'B'
  if (abs >= 1_000_000)     return '₡' + (n / 1_000_000).toFixed(1) + 'M'
  if (abs >= 1_000)         return '₡' + Math.round(n / 1_000) + 'K'
  return '₡' + Math.round(n)
}

export function formatInput(n: number): string {
  if (!isFinite(n)) return '₡0'
  return '₡' + n.toLocaleString('es-CR')
}
