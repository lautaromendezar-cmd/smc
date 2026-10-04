'use client'

import { useMemo, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { obrasPagina as t } from '@/content/textos'
import { CATEGORIAS, ESTADOS } from '@/sanity/schemas/opciones'
import type { ObraCard as ObraCardT } from '@/sanity/lib/types'
import ObraCard from './ObraCard'

const ESTADO_VALUES: string[] = ESTADOS.map((e) => e.value)
const CATEGORIA_VALUES: string[] = CATEGORIAS.map((c) => c.value)

function Chip({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={`h-10 shrink-0 border px-4 text-sm whitespace-nowrap transition-colors duration-300 ${
        activo ? 'border-bone bg-bone text-ink' : 'border-white/15 text-warm-200 hover:border-white/40 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

/**
 * Grilla de /obras con filtros por estado y tipo reflejados en la URL
 * (?estado=terminada&tipo=comercial). Se filtra en el cliente: la página
 * sigue siendo estática y el filtro es instantáneo.
 */
export function ObrasExplorer({ obras }: { obras: ObraCardT[] }) {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  const estado = ESTADO_VALUES.includes(params.get('estado') ?? '') ? params.get('estado') : null
  const tipo = CATEGORIA_VALUES.includes(params.get('tipo') ?? '') ? params.get('tipo') : null

  const setParam = (key: 'estado' | 'tipo', value: string | null) => {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    const qs = next.toString()
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }))
  }

  const filtradas = useMemo(
    () => obras.filter((o) => (!estado || o.estado === estado) && (!tipo || o.categoria === tipo)),
    [obras, estado, tipo],
  )
  // solo se ofrecen los tipos que tienen obras cargadas
  const tiposConObras = CATEGORIAS.filter((c) => obras.some((o) => o.categoria === c.value))

  return (
    <>
      <div className="flex flex-col gap-6 border-y border-white/10 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label={t.filtroEstado} className="-mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          <Chip activo={!estado} onClick={() => setParam('estado', null)}>
            {t.todas}
          </Chip>
          {ESTADOS.map((e) => (
            <Chip key={e.value} activo={estado === e.value} onClick={() => setParam('estado', e.value)}>
              {e.title}
            </Chip>
          ))}
        </div>
        {tiposConObras.length > 1 && (
          <div role="group" aria-label={t.filtroCategoria} className="-mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
            <Chip activo={!tipo} onClick={() => setParam('tipo', null)}>
              Todos los tipos
            </Chip>
            {tiposConObras.map((c) => (
              <Chip key={c.value} activo={tipo === c.value} onClick={() => setParam('tipo', c.value)}>
                {c.title}
              </Chip>
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-warm-400" aria-live="polite">
        {filtradas.length === 1 ? '1 obra' : `${filtradas.length} obras`}
      </p>

      {filtradas.length === 0 ? (
        <div className="mt-10 border border-white/10 bg-ink-2 px-6 py-16 text-center grid-plano">
          <p className="font-display text-2xl text-white">{t.sinResultados}</p>
          <button
            type="button"
            onClick={() => startTransition(() => router.replace(pathname, { scroll: false }))}
            className="mt-6 inline-flex h-11 items-center border border-white/20 px-5 text-white hover:border-brick-300"
          >
            {t.limpiar}
          </button>
        </div>
      ) : (
        <ul className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {filtradas.map((o) => (
            <li key={o._id}>
              <ObraCard obra={o} titulo="h2" />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

/** Lo que se renderiza en el servidor (y sin JS): todas las obras, sin filtros. */
export function ObrasGrillaEstatica({ obras }: { obras: ObraCardT[] }) {
  return (
    <ul className="mt-14 grid gap-x-8 gap-y-14 border-t border-white/10 pt-14 sm:grid-cols-2 lg:grid-cols-3">
      {obras.map((o) => (
        <li key={o._id}>
          <ObraCard obra={o} titulo="h2" />
        </li>
      ))}
    </ul>
  )
}
