'use client'

import { useEffect, useState } from 'react'
import { intro } from '@/lib/intro'
import { IconoWhatsApp } from '@/components/ui/IconosMarca'

/** Botón flotante de WhatsApp. Aparece cuando termina el preloader. */
export default function WhatsAppFlotante({ href }: { href: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const off = intro.onDone(() => {
      t = setTimeout(() => setVisible(true), 600)
    })
    return () => {
      off()
      clearTimeout(t)
    }
  }, [])

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp (se abre en una pestaña nueva)"
      tabIndex={visible ? 0 : -1}
      className={`fixed right-4 bottom-4 z-40 grid size-14 place-items-center bg-brick text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-[transform,opacity,background-color] duration-500 ease-[var(--ease-expo)] hover:bg-brick-600 md:right-6 md:bottom-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <IconoWhatsApp className="size-6" />
    </a>
  )
}
