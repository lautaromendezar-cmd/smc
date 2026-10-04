import type { PortableTextBlock } from 'next-sanity'
import type { Categoria, Estado } from '../schemas/opciones'

export type SanityImg = {
  alt?: string | null
  crop?: { top: number; bottom: number; left: number; right: number } | null
  hotspot?: { x: number; y: number; height: number; width: number } | null
  asset?: { _id: string; url: string; lqip?: string | null; width?: number; height?: number } | null
}

export type ObraCard = {
  _id: string
  titulo: string
  slug: string
  estado: Estado
  categoria?: Categoria
  ubicacion?: string | null
  anio?: number | null
  descripcionCorta?: string | null
  destacada?: boolean | null
  imagen?: SanityImg | null
}

export type ObraDetalle = ObraCard & {
  descripcion?: PortableTextBlock[] | null
  galeria?: (SanityImg & { _key: string })[] | null
}

export type ConfigSanity = {
  telefono?: string | null
  whatsapp?: string | null
  email?: string | null
  direccion?: string | null
  instagram?: string | null
  quienesSomos?: string | null
  aniosTrayectoria?: number | null
  heroImagen?: SanityImg | null
  heroImagenMovil?: SanityImg | null
  ctaImagen?: SanityImg | null
  heroVideo?: string | null
  heroVideoMovil?: string | null
  secuencia?: {
    estructura?: SanityImg | null
    ejecucion?: SanityImg | null
    terminada?: SanityImg | null
  } | null
}
