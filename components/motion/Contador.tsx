'use client'

import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'

/** Número que cuenta desde 0 al entrar en pantalla. El HTML ya trae el valor final. */
export default function Contador({ valor, className }: { valor: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const el = ref.current!
    const obj = { n: 0 }
    el.textContent = '0'
    gsap.to(obj, {
      n: valor,
      duration: 1.8,
      ease: 'power3.out',
      snap: { n: 1 },
      onUpdate: () => {
        el.textContent = String(obj.n)
      },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    })
  }, [valor])

  return (
    <span ref={ref} className={className}>
      {valor}
    </span>
  )
}
