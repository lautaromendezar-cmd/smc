/**
 * Encabezado de sección: numeración 01, 02… + etiqueta + línea de 1px
 * (la misma línea fina del logo). Va dentro de un <Reveal> para animarse.
 */
export default function SectionHeader({
  numero,
  eyebrow,
  claro = false,
  className = '',
}: {
  numero: string
  eyebrow: string
  claro?: boolean
  className?: string
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className={`eyebrow tabular ${claro ? 'text-brick' : 'text-brick-300'}`}>{numero}</span>
      <span className={`eyebrow ${claro ? 'text-warm-600' : 'text-warm-300'}`}>{eyebrow}</span>
      <span data-rule className={`h-px flex-1 ${claro ? 'bg-ink/15' : 'bg-white/15'}`} aria-hidden="true" />
    </div>
  )
}
