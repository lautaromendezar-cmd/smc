import type { SanityImg } from '@/sanity/lib/types'
import locales from '@/content/imagenes-locales.json'

/** Una imagen del sitio: viene de Sanity o es un respaldo local de /public/img. */
export type Img =
  | { kind: 'sanity'; image: SanityImg; alt: string }
  | { kind: 'local'; src: string; width: number; height: number; alt: string; blurDataURL?: string }

type LocalKey = keyof typeof locales

export function localImg(key: string): Img | null {
  const m = (locales as Record<string, (typeof locales)[LocalKey]>)[key]
  return m ? { kind: 'local', ...m } : null
}

export function fromSanity(img?: SanityImg | null, fallbackAlt = ''): Img | null {
  if (!img?.asset?._id) return null
  return { kind: 'sanity', image: img, alt: img.alt || fallbackAlt }
}
