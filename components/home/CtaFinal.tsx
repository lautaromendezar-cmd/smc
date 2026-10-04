import { ctaFinal as t } from '@/content/textos'
import type { Img } from '@/lib/imagen'
import Reveal from '@/components/motion/Reveal'
import Parallax from '@/components/motion/Parallax'
import BotonCta from '@/components/ui/BotonCta'
import Imagen from '@/components/ui/Imagen'

export default function CtaFinal({ img, whatsappHref }: { img: Img | null; whatsappHref: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink" aria-labelledby="cta-titulo">
      <Parallax className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 -top-[8%] -bottom-[8%]" data-parallax>
          <Imagen img={img} sizes="100vw" quality={60} />
        </div>
      </Parallax>
      <div className="absolute inset-0 -z-10 bg-ink/70" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#0b0b0b_0%,transparent_30%,transparent_70%,#0b0b0b_100%)]" aria-hidden="true" />
      <Reveal className="container-x py-32 text-center md:py-48">
        <h2 id="cta-titulo" data-split className="mx-auto max-w-[16ch] text-[clamp(2.4rem,7vw,6rem)] leading-[0.98] text-white">
          {t.titulo}
        </h2>
        <p data-reveal className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-warm-200">
          {t.texto}
        </p>
        <div data-reveal className="mt-10 flex justify-center">
          <BotonCta href={whatsappHref} externo>
            {t.cta}
          </BotonCta>
        </div>
      </Reveal>
    </section>
  )
}
