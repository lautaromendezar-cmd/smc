import { tiposDeObra } from '@/content/textos'

/** Marquee infinito solo con CSS (sin JS). Se pausa en hover; quieto con reduced-motion. */
export default function Marquee() {
  const fila = (oculta: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculta || undefined}>
      {tiposDeObra.map((tipo) => (
        <li key={tipo} className="flex items-center">
          <span className="px-6 font-display text-[clamp(2rem,5.5vw,4.5rem)] leading-none font-medium tracking-[-0.04em] whitespace-nowrap text-white md:px-10">
            {tipo}
          </span>
          <span className="block size-2.5 shrink-0 bg-brick" aria-hidden="true" />
        </li>
      ))}
    </ul>
  )
  return (
    <section aria-label="Tipos de obra" className="group overflow-hidden border-y border-white/10 bg-ink py-10 md:py-14">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {fila(false)}
        {fila(true)}
      </div>
    </section>
  )
}
