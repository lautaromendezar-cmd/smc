'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap'
import { intro } from '@/lib/intro'

/**
 * Smooth scroll con Lenis sincronizado con ScrollTrigger (un solo RAF: el de GSAP).
 * En pantallas táctiles Lenis no intercepta el scroll (syncTouch: false):
 * el celular usa su scroll nativo, que es el más fluido.
 */
export default function LenisProvider() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      syncTouch: false,
      anchors: { offset: -72 },
      autoRaf: false,
    })
    const raf = (time: number) => lenis.raf(time * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // durante el preloader el scroll queda bloqueado
    if (intro.isRunning()) lenis.stop()
    const off = intro.onDone(() => lenis.start())

    // las imágenes que cargan tarde cambian alturas: refrescar posiciones
    let t: ReturnType<typeof setTimeout>
    const onLoad = (e: Event) => {
      if ((e.target as HTMLElement)?.tagName !== 'IMG') return
      clearTimeout(t)
      t = setTimeout(() => ScrollTrigger.refresh(), 200)
    }
    document.addEventListener('load', onLoad, true)

    return () => {
      off()
      clearTimeout(t)
      document.removeEventListener('load', onLoad, true)
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  return null
}
