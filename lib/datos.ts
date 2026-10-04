import 'server-only'
import { contactoRespaldo, empresa } from '@/content/textos'
import { sanityFetch, TAGS } from '@/sanity/lib/fetch'
import { configQuery, destacadasQuery, obraQuery, obrasQuery, slugsQuery } from '@/sanity/lib/queries'
import type { ConfigSanity, ObraCard, ObraDetalle } from '@/sanity/lib/types'
import { fromSanity, localImg, type Img } from './imagen'

export type Sitio = {
  telefono: string
  whatsapp: string
  email: string
  direccion: string
  instagram: string
  quienesSomos: string
  anios: number
  hero: { desktop: Img | null; movil: Img | null }
  cta: Img | null
  secuencia: { estructura: Img | null; ejecucion: Img | null; terminada: Img | null }
}

/** Configuración del sitio: Sanity primero, campo por campo con respaldo local. */
export async function getSitio(): Promise<Sitio> {
  const c = await sanityFetch<ConfigSanity>({ query: configQuery, tags: [TAGS.config] })
  const r = contactoRespaldo
  const heroDesktop = fromSanity(c?.heroImagen, `Obra de ${empresa.nombre}`) ?? localImg('hero')
  return {
    telefono: c?.telefono || r.telefono,
    whatsapp: c?.whatsapp || r.whatsapp,
    email: c?.email || r.email,
    direccion: c?.direccion || r.direccion,
    instagram: c?.instagram || r.instagram,
    quienesSomos: c?.quienesSomos || r.quienesSomos,
    anios: c?.aniosTrayectoria || r.aniosTrayectoria,
    hero: {
      desktop: heroDesktop,
      // si hay hero en Sanity pero no versión móvil, se recorta el mismo (no se mezcla con el respaldo)
      movil: fromSanity(c?.heroImagenMovil) ?? (c?.heroImagen?.asset ? null : localImg('hero-movil')),
    },
    cta: fromSanity(c?.ctaImagen, 'Obra terminada') ?? localImg('cta'),
    secuencia: {
      estructura: fromSanity(c?.secuencia?.estructura, 'Estructura de la obra') ?? localImg('etapa-estructura'),
      ejecucion: fromSanity(c?.secuencia?.ejecucion, 'Obra en ejecución') ?? localImg('etapa-ejecucion'),
      terminada: fromSanity(c?.secuencia?.terminada, 'Obra terminada') ?? localImg('etapa-terminada'),
    },
  }
}

export async function getObras(): Promise<ObraCard[]> {
  return (await sanityFetch<ObraCard[]>({ query: obrasQuery, tags: [TAGS.obras] })) ?? []
}

/** Destacadas; si no hay ninguna marcada, las primeras 6 por orden. */
export async function getDestacadas(): Promise<ObraCard[]> {
  const d = (await sanityFetch<ObraCard[]>({ query: destacadasQuery, tags: [TAGS.obras] })) ?? []
  if (d.length) return d
  return (await getObras()).slice(0, 6)
}

export async function getObra(slug: string): Promise<ObraDetalle | null> {
  return sanityFetch<ObraDetalle>({ query: obraQuery, params: { slug }, tags: [TAGS.obras, TAGS.obra(slug)] })
}

export async function getSlugs(): Promise<{ slug: string; _updatedAt: string }[]> {
  return (await sanityFetch<{ slug: string; _updatedAt: string }[]>({ query: slugsQuery, tags: [TAGS.obras] })) ?? []
}
