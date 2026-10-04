import { ArrowUpRight } from 'lucide-react'

type Props = {
  href: string
  children: React.ReactNode
  externo?: boolean
  className?: string
  variante?: 'ladrillo' | 'claro'
}

/** CTA rojo ladrillo con el botón cuadrado contiguo y la flecha ↗. Un solo link. */
export default function BotonCta({ href, children, externo, className = '', variante = 'ladrillo' }: Props) {
  const colores =
    variante === 'ladrillo'
      ? { texto: 'bg-brick text-white group-hover:bg-brick-600', flecha: 'bg-brick-600 text-white group-hover:bg-brick' }
      : { texto: 'bg-bone text-ink group-hover:bg-white', flecha: 'bg-ink text-bone' }
  return (
    <a
      href={href}
      className={`group inline-flex h-14 items-stretch text-[0.95rem] font-medium ${className}`}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className={`flex flex-1 items-center px-6 transition-colors duration-300 ${colores.texto}`}>{children}</span>
      <span
        className={`grid w-14 shrink-0 place-items-center overflow-hidden transition-colors duration-300 ${colores.flecha}`}
        aria-hidden="true"
      >
        <span className="relative block size-5">
          <ArrowUpRight
            strokeWidth={1.5}
            className="absolute inset-0 size-5 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-10 group-hover:-translate-y-10"
          />
          <ArrowUpRight
            strokeWidth={1.5}
            className="absolute inset-0 size-5 -translate-x-10 translate-y-10 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0 group-hover:translate-y-0"
          />
        </span>
      </span>
      {externo && <span className="sr-only"> (se abre en una pestaña nueva)</span>}
    </a>
  )
}
