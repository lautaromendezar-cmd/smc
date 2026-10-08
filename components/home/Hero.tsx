'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { getImageProps, type ImageProps } from 'next/image'
import { empresa, hero as t } from '@/content/textos'
import type { Img } from '@/lib/imagen'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { intro } from '@/lib/intro'
import { sanityBaseUrl, sanityLoader } from '@/sanity/lib/image'
import BotonCta from '@/components/ui/BotonCta'
import Placeholder from '@/components/ui/Placeholder'
import HeroVideo, { type VideoHero } from './HeroVideo'

function imgProps(img: Img): Omit<ImageProps, 'alt'> & { alt: string } {
  const base = { alt: img.alt, fill: true, sizes: '100vw', quality: 75, fetchPriority: 'high' as const, loading: 'eager' as const }
  if (img.kind === 'local') {
    return { ...base, src: img.src, placeholder: img.blurDataURL ? 'blur' : 'empty', blurDataURL: img.blurDataURL }
  }
  return {
    ...base,
    src: sanityBaseUrl(img.image),
    loader: sanityLoader,
    placeholder: img.image.asset?.lqip ? 'blur' : 'empty',
    blurDataURL: img.image.asset?.lqip ?? undefined,
    style: img.image.hotspot ? { objectPosition: `${img.image.hotspot.x * 100}% ${img.image.hotspot.y * 100}%` } : undefined,
  }
}

/** Foto a sangre con art direction: vertical en celular, horizontal en escritorio. */
function HeroPicture({ desktop, movil }: { desktop: Img | null; movil: Img | null }) {
  if (!desktop && !movil) return <Placeholder label="Imagen de portada pendiente" />
  const main = (desktop ?? movil)!
  const { props: mainProps } = getImageProps(imgProps(main))
  if (!movil || !desktop) {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...mainProps} className="object-cover" />
  }
  const {
    props: { srcSet: srcMovil },
  } = getImageProps(imgProps(movil))
  // next/image no hace art direction: <picture> + <source media>, así el celular
  // descarga solo la vertical
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={srcMovil} sizes="100vw" />
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img {...mainProps} className="object-cover" />
    </picture>
  )
}

export default function Hero({
  desktop,
  movil,
  video,
  whatsappHref,
}: {
  desktop: Img | null
  movil: Img | null
  video: VideoHero | null
  whatsappHref: string
}) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const q = gsap.utils.selector(el)
      const media = q('.hero-media')[0]
      const html = document.documentElement

      if (prefersReducedMotion()) {
        html.classList.remove('hero-pending')
        gsap.fromTo(q('[data-hero-hide]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 })
        return
      }

      // estado inicial controlado por GSAP; después se suelta la clase del <head>
      gsap.set(q('[data-hero-fade]'), { autoAlpha: 0, y: 24 })
      gsap.set(q('.hero-rule'), { scaleX: 0 })
      html.classList.remove('hero-pending')

      let kenBurns: gsap.core.Tween | undefined
      const startKenBurns = () => {
        kenBurns = gsap.to(media, { scale: 1.07, duration: 22, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      }

      const reveal = () => {
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .to(q('.hero-rule'), { scaleX: 1, duration: 1.1, ease: 'power3.inOut' }, 0.25)
          .to(q('[data-hero-fade]'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.35)
      }

      const open = () => {
        gsap.fromTo(media, { scale: 1.15 }, { scale: 1, duration: 1.5, ease: 'power3.out', onComplete: startKenBurns })
      }

      if (intro.isRunning()) {
        // el preloader dispara open() y reveal() dentro de su timeline
        intro.setHero({ open, reveal })
      } else {
        gsap.fromTo(media, { scale: 1.08 }, { scale: 1, duration: 1.6, ease: 'power3.out', onComplete: startKenBurns })
        gsap.delayedCall(0.1, reveal)
      }

      return () => {
        intro.setHero(null)
        kenBurns?.kill()
      }
    },
    { scope: root },
  )

  return (
    <section ref={root} id="inicio" className="relative isolate h-[100svh] min-h-[600px] overflow-hidden bg-ink" aria-label="Portada">
      <div className="hero-media absolute inset-0 -z-10 origin-center will-change-transform">
        <HeroPicture desktop={desktop} movil={movil} />
        {video && <HeroVideo video={video} />}
      </div>
      {/* overlay en degradé: legibilidad arriba (nav) y abajo (bajada/CTA) */}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(11,11,11,0.72)_0%,rgba(11,11,11,0.25)_32%,rgba(11,11,11,0.35)_58%,rgba(11,11,11,0.92)_100%)]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_45%,transparent_40%,rgba(11,11,11,0.55)_100%)]" aria-hidden="true" />

      <div className="container-x flex h-full flex-col pt-28 pb-24 md:pr-24 md:pb-10">
        {/* sin texto en el centro (pedido del cliente): manda la foto; el h1 queda para buscadores y lectores de pantalla */}
        <h1 className="sr-only">{empresa.nombre}</h1>
        <div className="flex-1" aria-hidden="true" />

        <div data-hero-hide className="hero-rule mb-6 h-px origin-left bg-white/25 md:mb-8" aria-hidden="true" />

        <div className="grid items-end gap-6 md:grid-cols-[1fr_auto] md:gap-10">
          <p data-hero-hide data-hero-fade className="max-w-[30rem] text-[0.98rem] leading-relaxed text-warm-200 md:text-lg">
            {t.bajada}
          </p>
          <div data-hero-hide data-hero-fade className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <BotonCta href={whatsappHref} externo className="w-full sm:w-auto">
              {t.ctaPrincipal}
            </BotonCta>
            <Link
              href="/obras"
              className="group relative inline-flex h-12 items-center justify-center text-[0.95rem] font-medium text-white sm:h-14"
            >
              {t.ctaSecundario}
              <span
                className="absolute inset-x-0 bottom-3 h-px origin-right scale-x-100 bg-white/50 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:origin-left group-hover:scale-x-0 sm:bottom-4"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>

    </section>
  )
}
