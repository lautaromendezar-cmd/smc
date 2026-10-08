import { tiposDeObra } from '@/content/textos'

/** Marquee infinito solo con CSS (sin JS). Se pausa en hover; quieto con reduced-motion. */
export default function Marquee() {
  const fila = (oculta: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculta || undefined}>
      {tiposDeObra.map((tipo) => (
        <li key={tipo} className="flex items-center">
          <span className="px-5 font-display text-[clamp(1.25rem,2.8vw,2.25rem)] leading-none font-medium tracking-[-0.03em] whitespace-nowrap text-white md:px-8">
            {tipo}
          </span>
          <span className="block size-2 shrink-0 bg-brick" aria-hidden="true" />
        </li>
      ))}
    </ul>
  )
  return (
    <section aria-label="Tipos de obra" className="group overflow-hidden border-y border-white/10 bg-ink py-7 md:py-9">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {fila(false)}
        {fila(true)}
      </div>
    </section>
  )
}
