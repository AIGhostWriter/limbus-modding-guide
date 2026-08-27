interface BadgeProps {
  variant?: 'glitch' | 'mt' | 'version' | 'neutral'
  children: React.ReactNode
}

const variants = {
  glitch: 'bg-[#2a2456] text-[var(--color-glitch)] border-[#3d3478]',
  mt: 'bg-[#1a3045] text-[var(--color-mt)] border-[#254560]',
  version: 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border-[var(--color-border)]',
  neutral: 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border-[var(--color-border)]',
}

export default function Badge({ variant = 'neutral', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border ${variants[variant]}`}>
      {children}
    </span>
  )
}
