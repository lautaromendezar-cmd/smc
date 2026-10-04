'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion } from '@/lib/gsap'

type RevealTag = 'div' | 'section' | 'ul' | 'ol' | 'article' | 'header' | 'footer' | 'aside'

/**
 * Reveal de bloques: los hijos marcados con [data-reveal] entran desde abajo
 * con stagger; los [data-split] (títulos) entran por líneas con máscara;
 * las [data-rule] (líneas de 1px) se dibujan de izquierda a derecha.
 * Una sola vez por elemento. Con reduced-motion no hace nada.
 */
export default function Reveal({
  as: Comp = 'div',
  children,
  className,
  id,
  start = 'top 82%',
  ...rest
}: {
  as?: RevealTag
  children: React.ReactNode
  className?: string
  id?: string
  start?: string
} & React.AriaAttributes) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const el = ref.current!
      const q = gsap.utils.selector(el)
      const splits: SplitText[] = []

      q('[data-split]').forEach((node) => {
        const s = SplitText.create(node, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              ease: 'expo.out',
              stagger: 0.08,
              scrollTrigger: { trigger: node, start, once: true },
            })
          },
        })
        splits.push(s)
      })

      const rules = q('[data-rule]')
      if (rules.length) {
        gsap.from(rules, {
          scaleX: 0,
          transformOrigin: '0 50%',
          duration: 1.2,
          ease: 'power3.inOut',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start, once: true },
        })
      }

      const items = q('[data-reveal]')
      if (items.length) {
        // estado inicial solo para lo que todavía no se ve (lo de arriba del fold no parpadea)
        const hidden = items.filter((it) => it.getBoundingClientRect().top > window.innerHeight * 0.9)
        gsap.set(hidden, { autoAlpha: 0, y: 36 })
        ScrollTrigger.batch(hidden, {
          start,
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
        })
      }

      return () => splits.forEach((s) => s.revert())
    },
    { scope: ref },
  )

  const Tag = Comp as React.ElementType
  return (
    <Tag ref={ref} className={className} id={id} {...rest}>
      {children}
    </Tag>
  )
}
