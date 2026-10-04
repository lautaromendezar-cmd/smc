import Link from 'next/link'
import { noEncontrada as t } from '@/content/textos'
import Cota from './Cota'

/** 404 con estilo de plano técnico: el número acotado como una pieza en lámina. */
export default function Plano404() {
  return (
    <section className="relative flex min-h-[100svh] items-center bg-ink grid-plano py-32" aria-labelledby="titulo-404">
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          <div className="relative pt-10 pl-10 text-warm-500">
            <Cota label="Error" className="absolute top-0 right-0 left-10" />
            <Cota label="404" vertical className="absolute top-10 bottom-0 left-0" />
            <p className="font-display text-[clamp(7rem,28vw,17rem)] leading-[0.8] font-medium tracking-[-0.07em] text-white" aria-hidden="true">
              4<span className="text-brick-300">0</span>4
            </p>
          </div>
          <div className="mt-12 grid gap-6 border-t border-white/15 pt-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h1 id="titulo-404" className="text-3xl leading-tight text-white md:text-4xl">
                {t.titulo}
              </h1>
              <p className="mt-3 text-warm-300">{t.texto}</p>
            </div>
            <Link href="/" className="inline-flex h-12 items-center justify-center bg-brick px-6 font-medium text-white transition-colors hover:bg-brick-600">
              {t.cta}
            </Link>
          </div>
          <p className="eyebrow mt-10 text-[0.65rem] text-warm-500">Lámina 404 · Escala 1:1 · Hoja sin dibujar</p>
        </div>
      </div>
    </section>
  )
}
