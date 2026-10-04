import type { Metadata } from 'next'
import Plano404 from '@/components/ui/Plano404'

export const metadata: Metadata = { title: 'Página no encontrada' }

/** URLs que no matchean ninguna ruta (fuera del layout del sitio). */
export default function NotFound() {
  return <Plano404 />
}
