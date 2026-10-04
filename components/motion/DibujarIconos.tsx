'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap'

/** Dibuja el trazo de los iconos (svg de lucide) de cada hijo cuando entra en pantalla. */
export default function DibujarIconos({
  as: Comp = 'div',
  className,
  children,
}: {
  as?: 'div' | 'ul'
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const items = gsap.utils.toArray<HTMLElement>(ref.current!.children)
      items.forEach((item) => {
        const shapes = item.querySelectorAll('svg path, svg line, svg rect, svg circle, svg polyline, svg polygon')
        if (!shapes.length) return
        gsap.set(shapes, { drawSVG: '0%' })
        ScrollTrigger.create({
          trigger: item,
          start: 'top 85%',
          once: true,
          onEnter: () => gsap.to(shapes, { drawSVG: '100%', duration: 1.4, ease: 'power2.inOut', stagger: 0.12, delay: 0.15 }),
        })
      })
    },
    { scope: ref },
  )

  const Tag = Comp as React.ElementType
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
