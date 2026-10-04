import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { obrasHome as t } from '@/content/textos'
import type { ObraCard as ObraCardT } from '@/sanity/lib/types'
import Reveal from '@/components/motion/Reveal'
import Parallax from '@/components/motion/Parallax'
import SectionHeader from '@/components/ui/SectionHeader'
import ObraCard from '@/components/obras/ObraCard'
import EstadoVacio from '@/components/obras/EstadoVacio'

/**
 * 04 · Obras destacadas. Composición editorial asimétrica (no grilla pareja):
 * columnas desfasadas y proporciones que alternan.
 */
const LAYOUT = [
  { col: 'lg:col-span-7', aspect: 4 / 5, sizes: '(min-width: 1024px) 56vw, 92vw' },
  { col: 'lg:col-span-4 lg:col-start-9 lg:mt-48', aspect: 3 / 4, sizes: '(min-width: 1024px) 32vw, 92vw' },
  { col: 'lg:col-span-5 lg:col-start-2 lg:-mt-10', aspect: 4 / 5, sizes: '(min-width: 1024px) 40vw, 92vw' },
  { col: 'lg:col-span-5 lg:col-start-8 lg:mt-36', aspect: 4 / 5, sizes: '(min-width: 1024px) 40vw, 92vw' },
  { col: 'lg:col-span-6', aspect: 1, sizes: '(min-width: 1024px) 48vw, 92vw' },
  { col: 'lg:col-span-5 lg:col-start-8 lg:mt-28', aspect: 3 / 4, sizes: '(min-width: 1024px) 40vw, 92vw' },
]

export default function Destacadas({ obras, instagram }: { obras: ObraCardT[]; instagram: string }) {
  return (
    <section id="obras" className="relative scroll-mt-20 bg-ink" aria-labelledby="obras-titulo">
      <Reveal className="container-x py-24 md:py-36">
        <SectionHeader numero={t.numero} eyebrow={t.eyebrow} />
        <div className="mt-14 flex flex-col gap-8 md:mt-20 md:flex-row md:items-end md:justify-between">
          <h2 id="obras-titulo" data-split className="max-w-[16ch] text-[clamp(2.1rem,5vw,4.25rem)] leading-[1.02] text-white">
            {t.titulo}
          </h2>
          {obras.length > 0 && (
            <Link href="/obras" data-reveal className="group inline-flex items-center gap-3 self-start text-white md:self-auto">
              <span className="relative">
                {t.verTodas}
                <span className="absolute inset-x-0 -bottom-1 h-px origin-left bg-brick-300 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-x-0" />
              </span>
              <ArrowUpRight strokeWidth={1.5} className="size-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          )}
        </div>

        {obras.length === 0 ? (
          <EstadoVacio className="mt-16" titulo={t.vacio.titulo} texto={t.vacio.texto} cta={{ href: instagram, label: t.vacio.cta, externo: true }} />
        ) : (
          <Parallax className="mt-16 grid gap-x-10 gap-y-16 md:mt-24 md:grid-cols-2 lg:grid-cols-12 lg:gap-y-24">
            {obras.map((obra, i) => {
              const l = LAYOUT[i % LAYOUT.length]
              return (
                <div key={obra._id} data-reveal className={l.col}>
                  <ObraCard obra={obra} aspect={l.aspect} sizes={l.sizes} parallax />
                </div>
              )
            })}
          </Parallax>
        )}
      </Reveal>
    </section>
  )
}
