import { createImageUrlBuilder } from '@sanity/image-url'
import type { ImageLoader } from 'next/image'
import { dataset, projectId } from '../env'
import type { SanityImg } from './types'

const builder = createImageUrlBuilder({ projectId: projectId || 'sin-configurar', dataset })

export const hasAsset = (img?: SanityImg | null): img is SanityImg & { asset: NonNullable<SanityImg['asset']> } =>
  Boolean(img?.asset?._id)

/**
 * URL base con recorte y punto de enfoque aplicados para una proporción dada.
 * El loader después solo cambia el ancho (y el alto en la misma proporción).
 */
export function sanityBaseUrl(img: SanityImg, aspect?: number, w = 1600) {
  let b = builder.image(img as Parameters<typeof builder.image>[0]).width(w)
  if (aspect) b = b.height(Math.round(w / aspect)).fit('crop')
  return b.url()
}

/** Loader de next/image para el CDN de Sanity: AVIF/WebP automático. */
export const sanityLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src)
  const w0 = Number(url.searchParams.get('w'))
  const h0 = Number(url.searchParams.get('h'))
  url.searchParams.set('w', String(width))
  if (w0 && h0) url.searchParams.set('h', String(Math.round((width * h0) / w0)))
  url.searchParams.set('q', String(quality ?? 75))
  url.searchParams.set('auto', 'format')
  return url.toString()
}

/** Proporción real de la imagen teniendo en cuenta el recorte del Studio. */
export function naturalAspect(img: SanityImg) {
  const w = img.asset?.width ?? 4
  const h = img.asset?.height ?? 3
  const c = img.crop
  const cw = c ? 1 - c.left - c.right : 1
  const ch = c ? 1 - c.top - c.bottom : 1
  return (w * cw) / (h * ch)
}
