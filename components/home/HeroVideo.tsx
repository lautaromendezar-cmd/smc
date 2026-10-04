'use client'

import { useEffect, useRef, useState } from 'react'
import { intro } from '@/lib/intro'

type Fuente = { src: string; type: string }
export type VideoHero = { desktop: Fuente[]; movil?: Fuente[] }

/**
 * Video en loop sobre la foto del hero. La foto sigue siendo el póster y el LCP:
 * el video no se pide hasta que terminó la carga y el preloader, y entra con un
 * fundido cuando ya está reproduciendo. Sin video con reduced-motion o ahorro de datos.
 */
export default function HeroVideo({ video }: { video: VideoHero }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [fuentes, setFuentes] = useState<Fuente[] | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (conn?.saveData) return

    const movil = window.matchMedia('(max-width: 767px)').matches
    const elegir = () => setFuentes(movil && video.movil ? video.movil : video.desktop)

    let idle: number | undefined
    const arrancar = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200))
      idle = ric(elegir) as number
    }
    // después del load y del preloader: nunca compite con la foto ni con el JS inicial
    let off = () => {}
    const onLoad = () => {
      off = intro.onDone(arrancar)
    }
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })
    return () => {
      window.removeEventListener('load', onLoad)
      off()
      if (idle) (window.cancelIdleCallback ?? window.clearTimeout)(idle)
    }
  }, [video])

  useEffect(() => {
    const v = ref.current
    if (!fuentes || !v) return
    v.load()
    v.play().catch(() => {})
  }, [fuentes])

  if (!fuentes) return null
  return (
    <video
      ref={ref}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1.6s] ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setVisible(true)}
    >
      {fuentes.map((f) => (
        <source key={f.src} src={f.src} type={f.type} />
      ))}
    </video>
  )
}
