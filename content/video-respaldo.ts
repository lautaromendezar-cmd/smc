import type { VideoHero } from '@/components/home/HeroVideo'

/**
 * [EJEMPLO] Video del hero generado con IA (MiniMax H3) a partir de la imagen de
 * portada de ejemplo. Solo se usa mientras la portada sea la de respaldo: si el
 * cliente carga su foto o su video en el panel, manda lo del panel.
 */
export const videoRespaldo: VideoHero = {
  desktop: [{ src: '/video/hero.mp4', type: 'video/mp4' }],
  movil: [{ src: '/video/hero-movil.mp4', type: 'video/mp4' }],
}
