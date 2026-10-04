import { Hammer, House, KeyRound, Landmark, PencilRuler, Warehouse, type LucideIcon } from 'lucide-react'
import { servicios as t } from '@/content/textos'
import Reveal from '@/components/motion/Reveal'
import DibujarIconos from '@/components/motion/DibujarIconos'
import SectionHeader from '@/components/ui/SectionHeader'

const ICONOS: Record<(typeof t.items)[number]['icono'], LucideIcon> = {
  diseno: PencilRuler,
  llave: KeyRound,
  remodelacion: Hammer,
  vivienda: House,
  industrial: Warehouse,
  publica: Landmark,
}

/** 02 · Servicios. Iconos que se dibujan al entrar y línea roja que se extiende en hover. */
export default function Servicios() {
  return (
    <section id="servicios" className="relative scroll-mt-20 bg-ink" aria-labelledby="servicios-titulo">
      <Reveal className="container-x py-24 md:py-36">
        <SectionHeader numero={t.numero} eyebrow={t.eyebrow} />
        <div className="mt-14 grid gap-8 md:mt-20 lg:grid-cols-12">
          <h2 id="servicios-titulo" data-split className="text-[clamp(2.1rem,5vw,4.25rem)] leading-[1.02] text-white lg:col-span-7">
            {t.titulo}
          </h2>
          <p data-reveal className="max-w-md self-end text-lg leading-relaxed text-warm-300 lg:col-span-4 lg:col-start-9">
            {t.bajada}
          </p>
        </div>

        <DibujarIconos as="ul" className="mt-16 grid gap-x-10 sm:grid-cols-2 md:mt-24 lg:grid-cols-3 lg:gap-x-14">
          {t.items.map((s, i) => {
            const Icono = ICONOS[s.icono]
            return (
              <li key={s.titulo} data-reveal className="group relative border-t border-white/12 pt-8 pb-14">
                <div className="flex items-start justify-between">
                  <Icono strokeWidth={1} className="size-11 text-warm-200 transition-colors duration-500 group-hover:text-brick-300" aria-hidden="true" />
                  <span className="eyebrow tabular text-warm-500">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-10 max-w-[22ch] text-[1.45rem] leading-tight text-white">{s.titulo}</h3>
                <p className="mt-4 max-w-[34ch] leading-relaxed text-warm-300">{s.texto}</p>
                {/* línea roja que se extiende en hover */}
                <span
                  className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-brick-300 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100"
                  aria-hidden="true"
                />
              </li>
            )
          })}
        </DibujarIconos>
      </Reveal>
    </section>
  )
}
