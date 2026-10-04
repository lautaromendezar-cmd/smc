/**
 * Cota decorativa tipo plano: línea de 1px con trazos oblicuos en los extremos,
 * líneas de referencia y un texto centrado. Horizontal o vertical.
 * Se posiciona desde afuera (className con absolute + insets).
 */
export default function Cota({
  label,
  vertical = false,
  className = '',
}: {
  label: string
  vertical?: boolean
  className?: string
}) {
  if (vertical) {
    return (
      <div className={`flex w-6 flex-col items-center ${className}`} aria-hidden="true">
        <span className="absolute top-0 left-1/2 h-px w-3 -translate-x-1/2 bg-current" />
        <span className="absolute bottom-0 left-1/2 h-px w-3 -translate-x-1/2 bg-current" />
        <span className="absolute top-0 left-1/2 h-2 w-px -translate-x-1/2 rotate-45 bg-current" />
        <span className="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 translate-y-px rotate-45 bg-current" />
        <span className="h-full w-px bg-current" />
        <span className="eyebrow tabular absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 bg-inherit px-2 text-[0.62rem] whitespace-nowrap">
          {label}
        </span>
      </div>
    )
  }
  return (
    <div className={`flex h-6 items-center ${className}`} aria-hidden="true">
      <span className="absolute top-1/2 left-0 h-3 w-px -translate-y-1/2 bg-current" />
      <span className="absolute top-1/2 right-0 h-3 w-px -translate-y-1/2 bg-current" />
      <span className="absolute top-1/2 left-0 h-2 w-px -translate-y-1/2 rotate-45 bg-current" />
      <span className="absolute top-1/2 right-0 h-2 w-px -translate-y-1/2 rotate-45 bg-current" />
      <span className="h-px w-full bg-current" />
      <span className="eyebrow tabular absolute left-1/2 -translate-x-1/2 -translate-y-[0.85rem] px-2 text-[0.62rem] whitespace-nowrap">
        {label}
      </span>
    </div>
  )
}
