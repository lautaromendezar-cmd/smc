import { empresa, nosotros as t } from '@/content/textos'
import Reveal from '@/components/motion/Reveal'
import Contador from '@/components/motion/Contador'
import SectionHeader from '@/components/ui/SectionHeader'
import Cota from '@/components/ui/Cota'

/** 01 · Quiénes somos. Sección clara: el "+30" medido con cotas como en un plano. */
export default function Nosotros({ texto, anios }: { texto: string; anios: number }) {
  const parrafos = texto.split(/\n\s*\n/).filter(Boolean)
  return (
    <section id="nosotros" className="tema-claro relative scroll-mt-20 bg-bone text-ink grid-plano-claro" aria-labelledby="nosotros-titulo">
      <Reveal className="container-x py-24 md:py-36">
        <SectionHeader numero={t.numero} eyebrow={t.eyebrow} claro />

        <div className="mt-14 grid gap-16 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 id="nosotros-titulo" data-split className="max-w-[18ch] text-[clamp(2.1rem,5vw,4.25rem)] leading-[1.02]">
              {t.titulo}
            </h2>
            <div className="mt-10 max-w-[38rem] space-y-5 text-[1.05rem] leading-relaxed text-warm-700 md:text-lg">
              {parrafos.map((p, i) => (
                <p key={i} data-reveal>
                  {p}
                </p>
              ))}
            </div>
            <p data-reveal className="mt-10 border-l-2 border-brick pl-5 font-display text-xl leading-snug tracking-tight md:text-2xl">
              {t.prioridad}
            </p>
          </div>

          {/* contador acotado como en un plano */}
          <div className="lg:col-span-5 lg:pl-6">
            <div data-reveal className="relative pt-8 pl-16 text-warm-600">
              <Cota label="Trayectoria" className="absolute top-0 right-0 left-16" />
              <Cota label={`${anios} años`} vertical className="absolute top-8 bottom-12 left-0" />
              <p className="font-display leading-[0.8] font-medium tracking-[-0.06em] text-ink">
                <span className="align-top text-[clamp(3rem,7vw,5.5rem)] text-brick">+</span>
                <Contador valor={anios} className="tabular text-[clamp(8rem,22vw,15rem)]" />
              </p>
              <p className="eyebrow mt-6 text-warm-600">{t.contadorEtiqueta}</p>
              {/* Métricas adicionales: NO inventar. Si el cliente pasa datos reales, van acá.
                  <p>+XX obras terminadas</p> */}
            </div>

            <div className="mt-16">
              <p data-reveal className="eyebrow mb-6 text-warm-600">
                {t.valoresTitulo}
              </p>
              <ul className="border-t border-ink/15">
                {t.valores.map((v) => (
                  <li key={v.titulo} data-reveal className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-ink/15 py-5">
                    <span className="font-display text-lg font-medium tracking-tight">{v.titulo}</span>
                    <span className="text-warm-700">{v.texto}</span>
                  </li>
                ))}
              </ul>
              <p data-reveal className="mt-6 text-sm text-warm-600">
                {empresa.profesional.rol}: {empresa.profesional.nombre} · {empresa.profesional.matriculas[0]}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
