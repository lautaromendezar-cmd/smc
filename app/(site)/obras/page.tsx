import type { Metadata } from 'next'
import { Suspense } from 'react'
import { obrasHome, obrasPagina as t } from '@/content/textos'
import { getObras, getSitio } from '@/lib/datos'
import Reveal from '@/components/motion/Reveal'
import EstadoVacio from '@/components/obras/EstadoVacio'
import { ObrasExplorer, ObrasGrillaEstatica } from '@/components/obras/ObrasExplorer'

export const metadata: Metadata = {
  title: 'Obras',
  description:
    'Obras terminadas, en ejecución y renders de SMC Arquitectura + Construcción: viviendas, naves industriales, locales comerciales, obra pública y remodelaciones.',
  alternates: { canonical: '/obras' },
}

export default async function ObrasPage() {
  const [obras, sitio] = await Promise.all([getObras(), getSitio()])
  return (
    <section className="bg-ink pt-32 pb-24 md:pt-44 md:pb-36" aria-labelledby="obras-titulo">
      <div className="container-x">
        <Reveal className="grid gap-8 pb-12 lg:grid-cols-12 lg:pb-16">
          <h1 id="obras-titulo" data-split className="text-[clamp(2.1rem,5vw,4.25rem)] leading-[1.02] tracking-[-0.04em] text-white lg:col-span-7">
            {t.titulo}
          </h1>
          <p data-reveal className="max-w-md self-end text-lg leading-relaxed text-warm-300 lg:col-span-4 lg:col-start-9">
            {t.bajada}
          </p>
        </Reveal>

        {obras.length === 0 ? (
          <EstadoVacio
            titulo={obrasHome.vacio.titulo}
            texto={obrasHome.vacio.texto}
            cta={{ href: sitio.instagram, label: obrasHome.vacio.cta, externo: true }}
          />
        ) : (
          // useSearchParams en una página estática: la grilla completa se prerenderiza
          // como fallback y los filtros se aplican al hidratar
          <Suspense fallback={<ObrasGrillaEstatica obras={obras} />}>
            <ObrasExplorer obras={obras} />
          </Suspense>
        )}
      </div>
    </section>
  )
}
