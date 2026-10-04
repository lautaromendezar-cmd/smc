import { ArrowUpRight } from 'lucide-react'
import Cota from '@/components/ui/Cota'

/** Estado vacío prolijo: un "plano en blanco" con cotas, texto y una salida. */
export default function EstadoVacio({
  titulo,
  texto,
  cta,
  className = '',
}: {
  titulo: string
  texto: string
  cta?: { href: string; label: string; externo?: boolean; onClick?: never }
  className?: string
}) {
  return (
    <div data-reveal className={`relative border border-white/10 bg-ink-2 px-6 py-20 grid-plano md:px-16 md:py-28 ${className}`}>
      <Cota label="Obra en carga" className="absolute top-4 right-8 left-8 text-warm-600" />
      <div className="relative mx-auto max-w-xl text-center">
        <p className="font-display text-3xl leading-tight tracking-tight text-white md:text-4xl">{titulo}</p>
        <p className="mt-4 text-warm-300">{texto}</p>
        {cta && (
          <a
            href={cta.href}
            {...(cta.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="mt-8 inline-flex h-12 items-center gap-3 border border-white/20 px-6 text-white transition-colors hover:border-brick-300"
          >
            {cta.label}
            <ArrowUpRight strokeWidth={1.5} className="size-4" />
          </a>
        )}
      </div>
    </div>
  )
}
