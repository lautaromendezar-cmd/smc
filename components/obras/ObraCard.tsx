import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { categoriaLabel, estadoLabel } from '@/sanity/schemas/opciones'
import type { ObraCard as ObraCardT } from '@/sanity/lib/types'
import { fromSanity } from '@/lib/imagen'
import Imagen from '@/components/ui/Imagen'

/**
 * Tarjeta de obra. Hover: zoom contenido en la foto y flecha.
 * `parallax` marca la imagen para el efecto de <Parallax> (solo en la home).
 */
export default function ObraCard({
  obra,
  aspect = 4 / 5,
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92vw',
  parallax = false,
  className = '',
  titulo: Titulo = 'h3',
}: {
  obra: ObraCardT
  aspect?: number
  sizes?: string
  parallax?: boolean
  className?: string
  titulo?: 'h2' | 'h3'
}) {
  const img = fromSanity(obra.imagen, obra.titulo)
  const meta = [categoriaLabel(obra.categoria), obra.ubicacion].filter(Boolean).join(' · ')
  return (
    <article className={`group relative ${className}`}>
      <Link href={`/obras/${obra.slug}`} className="block focus-visible:outline-offset-4">
        <div className="relative overflow-hidden bg-ink-2" style={{ aspectRatio: String(aspect) }}>
          <div
            className={`absolute transition-[scale] duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.04] ${
              parallax ? 'inset-x-0 -top-[8%] -bottom-[8%]' : 'inset-0'
            }`}
            {...(parallax ? { 'data-parallax': '' } : {})}
          >
            <Imagen img={img} sizes={sizes} aspect={parallax ? aspect / 1.16 : aspect} />
          </div>
          <span
            className={`absolute top-3 left-3 inline-flex items-center gap-2 px-3 py-1.5 text-[0.7rem] font-medium tracking-[0.12em] uppercase backdrop-blur-sm ${
              obra.estado === 'ejecucion' ? 'bg-brick/90 text-white' : 'bg-ink/75 text-warm-200'
            }`}
          >
            {obra.estado === 'ejecucion' && <span className="size-1.5 animate-pulse bg-white motion-reduce:animate-none" aria-hidden="true" />}
            {estadoLabel(obra.estado)}
          </span>
        </div>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div className="min-w-0">
            {meta && <p className="eyebrow text-[0.68rem] text-warm-400">{meta}</p>}
            <Titulo className="mt-2.5 text-[1.35rem] leading-snug text-white md:text-2xl">{obra.titulo}</Titulo>
            {obra.descripcionCorta && <p className="mt-2 line-clamp-2 max-w-[44ch] text-warm-300">{obra.descripcionCorta}</p>}
          </div>
          <span
            className="mt-1 grid size-10 shrink-0 place-items-center border border-white/15 text-warm-200 transition-colors duration-300 group-hover:border-brick group-hover:bg-brick group-hover:text-white"
            aria-hidden="true"
          >
            <ArrowUpRight strokeWidth={1.5} className="size-4" />
          </span>
        </div>
      </Link>
    </article>
  )
}
