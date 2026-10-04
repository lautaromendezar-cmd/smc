/**
 * Placeholder de marca para obras sin foto: bloque oscuro con líneas de plano.
 * No es una imagen: no pesa nada y no rompe el layout.
 */
export default function Placeholder({ label = 'Foto pendiente', className = '' }: { label?: string; className?: string }) {
  return (
    <div className={`absolute inset-0 grid-plano bg-ink-2 ${className}`} role="img" aria-label={label}>
      <svg className="absolute inset-0 h-full w-full text-warm-700" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.25" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.25" vectorEffect="non-scaling-stroke" />
        <rect x="8" y="8" width="84" height="84" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="eyebrow absolute bottom-4 left-4 text-warm-400">{label}</span>
    </div>
  )
}
