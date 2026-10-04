import { proceso as t } from '@/content/textos'
import type { Sitio } from '@/lib/datos'
import Reveal from '@/components/motion/Reveal'
import SectionHeader from '@/components/ui/SectionHeader'
import PlanoAObra from './PlanoAObra'

/** 03 · Del plano a la obra terminada. */
export default function Proceso({ secuencia }: { secuencia: Sitio['secuencia'] }) {
  return (
    <section id="proceso" className="relative scroll-mt-20 border-t border-white/10 bg-ink" aria-labelledby="proceso-titulo">
      <Reveal className="container-x pt-24 md:pt-36">
        <SectionHeader numero={t.numero} eyebrow={t.eyebrow} />
        <div className="mt-14 grid gap-8 md:mt-20 lg:grid-cols-12">
          <h2 id="proceso-titulo" data-split className="text-[clamp(2.1rem,5vw,4.25rem)] leading-[1.02] text-white lg:col-span-6">
            {t.titulo}
          </h2>
          <p data-reveal className="max-w-md self-end text-lg leading-relaxed text-warm-300 lg:col-span-4 lg:col-start-9">
            {t.bajada}
          </p>
        </div>
      </Reveal>
      <PlanoAObra {...secuencia} />
    </section>
  )
}
