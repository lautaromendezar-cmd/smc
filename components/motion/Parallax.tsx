'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

/** Parallax leve en los hijos [data-parallax] (la imagen es 16 % más alta que su marco). */
export default function Parallax({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-parallax]', ref.current).forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -6 },
            { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
