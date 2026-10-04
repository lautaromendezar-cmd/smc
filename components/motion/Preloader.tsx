'use client'

import { useRef, useState } from 'react'
import geo from '@/content/logo-geometria.json'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { intro } from '@/lib/intro'

/**
 * Preloader de apertura (2,5 s). Solo en la primera visita de la sesión.
 *
 * El logo es raster: no se redibuja. scripts/cortar-logo.py lo recorta en
 * "SM", "C" y el subtítulo, y mide la línea y cada letra (columnas vacías
 * entre glifos). La línea se dibuja en CSS porque cruza toda la pantalla.
 *
 * La escena está duplicada en dos paneles fijos recortados con clip-path
 * (mitad superior / inferior). La línea del logo cae exactamente en el 50 %
 * de la pantalla, así que el corte pasa por la línea al píxel.
 */

const pct = (n: number) => `${(n * 100).toFixed(4)}%`
// centro de la línea medido desde arriba de la caja del logo
const lineCenter = geo.line.y + geo.line.h / 2
const STAGE_W = 'min(80vw, 640px)'

function Stage() {
  const sub = geo.sub
  return (
    <div
      className="pl-stage"
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: STAGE_W,
        aspectRatio: String(geo.aspect),
        transform: `translate(-50%, -${pct(lineCenter)})`,
      }}
    >
      {/* SM y C: cada uno en su máscara, entra desde abajo */}
      {(['sm', 'c'] as const).map((k) => (
        <div
          key={k}
          style={{ position: 'absolute', left: pct(geo[k].x), top: pct(geo[k].y), width: pct(geo[k].w), height: pct(geo[k].h), overflow: 'hidden' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={geo[k].src} alt="" className={`pl-in pl-${k}`} style={{ display: 'block', width: '100%', height: '100%' }} />
        </div>
      ))}
      {/* subtítulo: una máscara por letra, todas leen la misma imagen */}
      {sub.letters.map(([a, b], i) => {
        const w = b - a
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: pct(sub.x + a * sub.w),
              top: pct(sub.y),
              width: pct(w * sub.w),
              height: pct(sub.h),
              overflow: 'hidden',
            }}
          >
            <div className="pl-in pl-letter" style={{ position: 'absolute', inset: 0, animationDelay: `${(0.95 + i * 0.011).toFixed(3)}s` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sub.src}
                alt=""
                style={{ position: 'absolute', top: 0, height: '100%', width: pct(1 / w), left: pct(-a / w), maxWidth: 'none' }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Line() {
  // mismo grosor relativo que en el logo, de borde a borde de la pantalla
  const thickness = `calc(${STAGE_W} / ${geo.aspect} * ${geo.line.h})`
  return (
    <div
      style={{ position: 'absolute', left: 0, right: 0, top: `calc(50% - ${thickness} / 2)`, height: thickness, overflow: 'hidden' }}
    >
      <div className="pl-line" style={{ position: 'absolute', inset: 0, background: '#fff', transformOrigin: '0 50%' }} />
      <div
        className="pl-shine"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '22vw',
          background: 'linear-gradient(90deg, transparent, rgba(208,112,93,0.0) 15%, rgba(255,236,220,0.95) 50%, transparent 85%)',
          filter: 'blur(1px)',
        }}
      />
    </div>
  )
}

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(true)

  useGSAP(
    () => {
      // si el script del <head> decidió saltear el preloader, se saca del DOM
      if (!intro.isRunning()) {
        const id = requestAnimationFrame(() => setMounted(false))
        return () => cancelAnimationFrame(id)
      }
      try {
        sessionStorage.setItem('smc-intro', '1')
      } catch {}

      const q = gsap.utils.selector(root)
      let tl: gsap.core.Timeline | undefined
      // se espera un frame para que el hero (montado después) registre sus cues
      const id = requestAnimationFrame(() => {
        const hero = intro.getHero()
        tl = gsap.timeline({
          defaults: { ease: 'expo.out' },
          onComplete: () => {
            intro.finish()
            ScrollTrigger.refresh()
            setMounted(false)
          },
        })
        // la entrada del logo corre en CSS desde el primer pintado: se mide cuánto
        // lleva y la apertura ocurre a los 1,8 s (o enseguida si el JS llegó tarde)
        const css = q('.pl-sm')[0]?.getAnimations()[0]
        const elapsed = css?.currentTime ? Number(css.currentTime) / 1000 : 0
        tl.addLabel('open', Math.max(0.05, 1.8 - elapsed))
          .to(q('.pl-top'), { yPercent: -50, duration: 0.7, ease: 'expo.inOut' }, 'open')
          .to(q('.pl-bot'), { yPercent: 50, duration: 0.7, ease: 'expo.inOut' }, 'open')
        if (hero) {
          tl.call(hero.open, [], 'open')
          tl.call(hero.reveal, [], 'open+=0.35')
        }
      })
      return () => {
        cancelAnimationFrame(id)
        tl?.kill()
      }
    },
    { scope: root },
  )

  if (!mounted) return null

  return (
    <div id="pl" ref={root} aria-hidden="true">
      <div className="pl-half pl-top">
        <Stage />
        <Line />
      </div>
      <div className="pl-half pl-bot">
        <Stage />
        <Line />
      </div>
    </div>
  )
}
