'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import type { SanityImg } from '@/sanity/lib/types'
import { naturalAspect } from '@/sanity/lib/image'
import { fromSanity } from '@/lib/imagen'
import Imagen from '@/components/ui/Imagen'

type Foto = SanityImg & { _key: string }

/**
 * Galería en columnas + lightbox accesible (<dialog> nativo: foco atrapado y Esc).
 * Teclado: ← →. Celular: swipe horizontal.
 */
export default function Galeria({ fotos, titulo }: { fotos: Foto[]; titulo: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLElement | null>(null)
  const startX = useRef<number | null>(null)
  const [index, setIndex] = useState<number | null>(null)
  const total = fotos.length

  const abrir = (i: number, el: HTMLElement) => {
    trigger.current = el
    setIndex(i)
    dialog.current?.showModal()
  }
  const cerrar = useCallback(() => {
    dialog.current?.close()
  }, [])
  const mover = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + total) % total)), [total])

  useEffect(() => {
    const dlg = dialog.current
    if (!dlg) return
    const onClose = () => {
      setIndex(null)
      trigger.current?.focus()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') mover(1)
      if (e.key === 'ArrowLeft') mover(-1)
    }
    dlg.addEventListener('close', onClose)
    dlg.addEventListener('keydown', onKey)
    return () => {
      dlg.removeEventListener('close', onClose)
      dlg.removeEventListener('keydown', onKey)
    }
  }, [mover])

  // bloquea el scroll de la página mientras el lightbox está abierto
  const abierto = index !== null
  useEffect(() => {
    if (!abierto) return
    const html = document.documentElement
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = ''
    }
  }, [abierto])

  const actual = index !== null ? fotos[index] : null

  return (
    <>
      <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>li]:mb-6">
        {fotos.map((f, i) => (
          <li key={f._key} className="break-inside-avoid">
            <button
              type="button"
              onClick={(e) => abrir(i, e.currentTarget)}
              className="group relative block w-full overflow-hidden bg-ink-2"
              style={{ aspectRatio: String(naturalAspect(f)) }}
              aria-label={`Ampliar foto ${i + 1} de ${total}${f.alt ? `: ${f.alt}` : ''}`}
            >
              <span className="absolute inset-0 transition-[scale] duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.04]">
                <Imagen img={fromSanity(f, titulo)} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw" />
              </span>
              <span className="absolute right-3 bottom-3 grid size-9 place-items-center bg-ink/70 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Maximize2 strokeWidth={1.5} className="size-4" aria-hidden="true" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={`Galería de ${titulo}`}
        data-lenis-prevent
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-ink/95 p-0 text-white backdrop:bg-ink/90 open:flex open:flex-col"
        onClick={(e) => {
          if (e.target === e.currentTarget) cerrar()
        }}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4 md:px-8">
          <p className="eyebrow tabular text-warm-300" aria-live="polite">
            {index !== null ? `${index + 1} / ${total}` : ''}
          </p>
          <button type="button" onClick={cerrar} className="grid size-11 place-items-center text-white" aria-label="Cerrar galería" autoFocus>
            <X strokeWidth={1.5} />
          </button>
        </div>
        <div
          className="relative min-h-0 flex-1 touch-pan-y select-none"
          onPointerDown={(e) => {
            startX.current = e.clientX
          }}
          onPointerUp={(e) => {
            if (startX.current === null) return
            const dx = e.clientX - startX.current
            startX.current = null
            if (Math.abs(dx) > 50) mover(dx < 0 ? 1 : -1)
          }}
        >
          {actual && (
            <div key={actual._key} className="absolute inset-0 mx-4 md:mx-24">
              <Imagen img={fromSanity(actual, titulo)} sizes="100vw" className="object-contain" quality={85} />
            </div>
          )}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => mover(-1)}
                className="absolute top-1/2 left-2 hidden size-12 -translate-y-1/2 place-items-center border border-white/15 bg-ink/60 text-white hover:border-white/40 md:left-6 md:grid"
                aria-label="Foto anterior"
              >
                <ChevronLeft strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => mover(1)}
                className="absolute top-1/2 right-2 hidden size-12 -translate-y-1/2 place-items-center border border-white/15 bg-ink/60 text-white hover:border-white/40 md:right-6 md:grid"
                aria-label="Foto siguiente"
              >
                <ChevronRight strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>
        <div className="flex min-h-16 shrink-0 items-center justify-between gap-4 px-4 py-3 md:px-8">
          <p className="text-sm text-warm-300">{actual?.alt}</p>
          {total > 1 && (
            <div className="flex gap-2 md:hidden">
              <button type="button" onClick={() => mover(-1)} className="grid size-11 place-items-center border border-white/15" aria-label="Foto anterior">
                <ChevronLeft strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => mover(1)} className="grid size-11 place-items-center border border-white/15" aria-label="Foto siguiente">
                <ChevronRight strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
      </dialog>
    </>
  )
}
