'use client'

import Image from 'next/image'
import { sanityBaseUrl, sanityLoader } from '@/sanity/lib/image'
import type { Img } from '@/lib/imagen'
import Placeholder from './Placeholder'

type Props = {
  img: Img | null
  sizes: string
  /** proporción del contenedor (ancho/alto) para recortar con el hotspot de Sanity */
  aspect?: number
  className?: string
  preload?: boolean
  quality?: number
  placeholderLabel?: string
}

/**
 * Imagen a sangre dentro de un contenedor posicionado (fill).
 * Sanity -> loader del CDN de Sanity (AVIF/WebP, hotspot y crop).
 * Local  -> optimizador de Next. Sin imagen -> placeholder de marca.
 */
export default function Imagen({ img, sizes, aspect, className = 'object-cover', preload, quality = 75, placeholderLabel }: Props) {
  if (!img) return <Placeholder label={placeholderLabel} />

  const common = {
    fill: true,
    sizes,
    className,
    quality,
    // preload -> <link rel=preload> + carga inmediata; si no, lazy (default de next/image)
    preload,
  }

  if (img.kind === 'local') {
    return <Image {...common} alt={img.alt} src={img.src} placeholder={img.blurDataURL ? 'blur' : 'empty'} blurDataURL={img.blurDataURL} />
  }

  const lqip = img.image.asset?.lqip ?? undefined
  return (
    <Image
      {...common}
      alt={img.alt}
      loader={sanityLoader}
      src={sanityBaseUrl(img.image, aspect)}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip}
      style={
        img.image.hotspot && !aspect
          ? { objectPosition: `${img.image.hotspot.x * 100}% ${img.image.hotspot.y * 100}%` }
          : undefined
      }
    />
  )
}
