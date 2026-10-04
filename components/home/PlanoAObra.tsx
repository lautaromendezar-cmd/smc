'use client'

import { useRef } from 'react'
import { proceso as t } from '@/content/textos'
import type { Img } from '@/lib/imagen'
import { gsap, useGSAP } from '@/lib/gsap'
import Imagen from '@/components/ui/Imagen'
import PlanoSVG from './PlanoSVG'

type Props = { estructura: Img | null; ejecucion: Img | null; terminada: Img | null }

const SIZES = '(min-width: 1024px) 640px, 92vw'
const ASPECT = 4 / 5
// progreso en el que cambia la etapa visible: la mitad de cada barrido de foto
// (estructura 1–1,7 · ejecución 2–2,75 · terminada 3–3,6, sobre una timeline de 4)
const CORTES = [0.34, 0.59, 0.83]

function Regla() {
  return (
    <div className="relative h-full w-8 shrink-0" aria-hidden="true">
      <span className="absolute inset-y-0 left-0 w-px bg-white/15" />
      {Array.from({ length: 41 }, (_, i) => (
        <span
          key={i}
          className={`absolute left-0 h-px ${i % 10 === 0 ? 'w-4 bg-white/45' : i % 5 === 0 ? 'w-2.5 bg-white/30' : 'w-1.5 bg-white/20'}`}
          style={{ top: `${(i / 40) * 100}%` }}
        />
      ))}
      <span className="proceso-fill absolute inset-y-0 left-0 w-0.5 origin-top -translate-x-[0.5px] scale-y-0 bg-brick-300" />
    </div>
  )
}

export default function PlanoAObra({ estructura, ejecucion, terminada }: Props) {
  const pin = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(
        { desktop: '(min-width: 1024px)', mobile: '(max-width: 1023px)', reduce: '(prefers-reduced-motion: reduce)' },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean }
          if (reduce) return
          const q = gsap.utils.selector(pin)
          const draws = q('[data-draw]')
          const txts = q('.plano-txt')
          const textos = q('.etapa-texto')
          const labels = q('.etapa-label')
          let step = -1

          const goTo = (s: number) => {
            if (s === step) return
            step = s
            gsap.to(q('.etapa-num'), { yPercent: -25 * s, duration: 0.8, ease: 'expo.out', overwrite: true })
            textos.forEach((el, i) =>
              gsap.to(el, { autoAlpha: i === s ? 1 : 0, y: i === s ? 0 : i < s ? -16 : 16, duration: 0.6, ease: 'expo.out', overwrite: true }),
            )
            labels.forEach((el, i) => gsap.to(el, { autoAlpha: i === s ? 1 : 0, duration: 0.4, overwrite: true }))
          }
          gsap.set(textos, { autoAlpha: 0, y: 16 })
          gsap.set(labels, { autoAlpha: 0 })
          goTo(0)

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: pin.current,
              start: 'top top',
              end: desktop ? '+=320%' : '+=230%',
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => goTo(CORTES.filter((c) => self.progress >= c).length),
            },
          })

          // 01 · PLANO: las líneas se dibujan, después aparecen textos y cotas
          tl.fromTo(draws, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.35, stagger: { amount: 0.45 } }, 0)
            .fromTo(txts, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, stagger: { amount: 0.2 } }, 0.45)
            // 02 · ESTRUCTURA: wipe de abajo hacia arriba; el plano queda encima unos instantes
            .fromTo(q('.capa-estructura'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power2.inOut' }, 1)
            .to(q('.capa-plano'), { opacity: 0.4, duration: 0.35 }, 1.2)
            .to(q('.capa-plano'), { opacity: 0, duration: 0.35 }, 1.65)
            // 03 · EN EJECUCIÓN: wipe en diagonal
            .fromTo(
              q('.capa-ejecucion'),
              { clipPath: 'polygon(0% 100%, 0% 100%, 0% 100%)' },
              { clipPath: 'polygon(0% 100%, 0% -110%, 210% 100%)', duration: 0.75, ease: 'power2.inOut' },
              2,
            )
            // 04 · TERMINADA: entra desde la derecha y se "encienden" las luces
            .fromTo(q('.capa-terminada'), { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power2.inOut' }, 3)
            .fromTo(q('.capa-terminada-img'), { scale: 1.08 }, { scale: 1, duration: 1 }, 3)
            .fromTo(q('.capa-noche'), { opacity: 0.72 }, { opacity: 0, duration: 0.55 }, 3.35)
            .fromTo(q('.capa-luz'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 3.6)
            .to(q('.capa-luz'), { opacity: 0.45, duration: 0.1 }, 3.9)
            // regla de progreso
            .fromTo(q('.proceso-fill'), { scaleY: 0 }, { scaleY: 1, duration: 4 }, 0)

          return () => {
            step = -1
          }
        },
      )
      return () => mm.revert()
    },
    { scope: pin },
  )

  const capas = [
    { cls: 'capa-estructura', img: estructura, label: t.etapas[1].titulo },
    { cls: 'capa-ejecucion', img: ejecucion, label: t.etapas[2].titulo },
  ]

  return (
    <>
      {/* versión animada (oculta con prefers-reduced-motion) */}
      <div ref={pin} className="relative h-[100svh] min-h-[560px] overflow-hidden motion-reduce:hidden">
        <div className="container-x grid h-full grid-rows-[auto_1fr] items-center gap-6 py-20 lg:grid-cols-12 lg:grid-rows-1 lg:gap-10 lg:py-16">
          {/* escenario */}
          <div className="row-start-1 flex justify-center lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <div className="relative aspect-[4/5] h-[min(52svh,128vw)] overflow-hidden bg-ink-2 grid-plano lg:h-[min(78svh,800px)]">
              <div className="absolute inset-0 text-warm-200">
                <PlanoSVG className="h-full w-full p-[3%]" />
              </div>
              {capas.map((c) => (
                <div key={c.cls} className={`${c.cls} absolute inset-0 [clip-path:inset(100%_0%_0%_0%)]`}>
                  <Imagen img={c.img} sizes={SIZES} aspect={ASPECT} placeholderLabel={`Foto de ${c.label.toLowerCase()} pendiente`} />
                </div>
              ))}
              <div className="capa-terminada absolute inset-0 overflow-hidden [clip-path:inset(0%_0%_0%_100%)]">
                <div className="capa-terminada-img absolute inset-0">
                  <Imagen img={terminada} sizes={SIZES} aspect={ASPECT} placeholderLabel="Foto de obra terminada pendiente" />
                </div>
                <div className="capa-noche absolute inset-0 bg-ink" aria-hidden="true" />
                <div
                  className="capa-luz absolute inset-0 opacity-0 mix-blend-screen bg-[radial-gradient(60%_45%_at_50%_70%,rgba(255,196,140,0.35),transparent_70%)]"
                  aria-hidden="true"
                />
              </div>
              {/* el plano queda superpuesto mientras entra la estructura */}
              <div className="capa-plano pointer-events-none absolute inset-0 text-white mix-blend-screen opacity-0" aria-hidden="true">
                <PlanoSVG decorativo className="h-full w-full p-[3%]" />
              </div>
              {/* rótulo de etapa sobre la imagen */}
              <div className="absolute top-3 left-3 bg-ink/75 px-3 py-2 backdrop-blur-sm" aria-hidden="true">
                <div className="grid">
                  {t.etapas.map((e, i) => (
                    <span key={e.titulo} className="etapa-label eyebrow tabular [grid-area:1/1] text-[0.65rem] text-warm-200">
                      Etapa {String(i + 1).padStart(2, '0')} · {e.titulo}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* info: número, regla y texto */}
          <div className="row-start-2 flex h-full max-h-[34svh] gap-5 self-start lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:h-[min(60svh,520px)] lg:max-h-none lg:self-center">
            <Regla />
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <p className="flex font-display text-[clamp(4.5rem,12vw,10rem)] leading-none font-medium tracking-[-0.06em] text-white tabular" aria-hidden="true">
                <span>0</span>
                <span className="relative block h-[1em] overflow-hidden">
                  <span className="etapa-num block">
                    {[1, 2, 3, 4].map((n) => (
                      <span key={n} className="block h-[1em]">
                        {n}
                      </span>
                    ))}
                  </span>
                </span>
              </p>
              <ol className="grid">
                {t.etapas.map((e, i) => (
                  <li key={e.titulo} className="etapa-texto [grid-area:1/1]">
                    <h3 className="text-[clamp(1.6rem,3.2vw,2.6rem)] leading-tight text-white">
                      <span className="sr-only">Etapa {i + 1}: </span>
                      {e.titulo}
                    </h3>
                    <p className="mt-3 max-w-[30ch] leading-relaxed text-warm-300 lg:text-lg">{e.texto}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* reduced-motion: las 4 etapas en una grilla estática */}
      <ol className="container-x hidden gap-6 pb-24 motion-reduce:grid sm:grid-cols-2 lg:grid-cols-4">
        {t.etapas.map((e, i) => {
          const img = [null, estructura, ejecucion, terminada][i]
          return (
            <li key={e.titulo}>
              <div className="relative aspect-[4/5] overflow-hidden bg-ink-2 grid-plano">
                {i === 0 ? (
                  <div className="absolute inset-0 text-warm-200">
                    <PlanoSVG decorativo className="h-full w-full p-[3%]" />
                  </div>
                ) : (
                  <Imagen img={img} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 92vw" aspect={ASPECT} />
                )}
              </div>
              <p className="eyebrow tabular mt-4 text-brick-300">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-2 text-2xl text-white">{e.titulo}</h3>
              <p className="mt-2 text-warm-300">{e.texto}</p>
            </li>
          )
        })}
      </ol>
    </>
  )
}
