import { Mail, MapPin, Phone } from 'lucide-react'
import { contacto as t, contactoRespaldo, whatsappMensajes } from '@/content/textos'
import type { Sitio } from '@/lib/datos'
import { telLink, waLink } from '@/lib/site'
import Reveal from '@/components/motion/Reveal'
import SectionHeader from '@/components/ui/SectionHeader'
import BotonCta from '@/components/ui/BotonCta'
import { IconoInstagram } from '@/components/ui/IconosMarca'

/** Contacto: datos, WhatsApp, Instagram y mapa (iframe sin API key, lazy). */
export default function Contacto({ sitio, comoPagina = false }: { sitio: Sitio; comoPagina?: boolean }) {
  const Titulo = comoPagina ? 'h1' : 'h2'
  const usuarioIg = sitio.instagram.replace(/\/+$/, '').split('/').pop()
  const mapa = `https://www.google.com/maps?q=${encodeURIComponent(contactoRespaldo.direccionMapa)}&output=embed`
  const filas = [
    { icono: MapPin, label: t.direccion, valor: sitio.direccion },
    { icono: Phone, label: t.telefono, valor: sitio.telefono, href: telLink(sitio.telefono) },
    ...(sitio.email ? [{ icono: Mail, label: t.email, valor: sitio.email, href: `mailto:${sitio.email}` }] : []),
  ]
  return (
    <section
      id="contacto"
      className={`relative scroll-mt-20 border-t border-white/10 bg-ink ${comoPagina ? 'pt-28 md:pt-36' : ''}`}
      aria-labelledby="contacto-titulo"
    >
      <Reveal className="container-x py-24 md:py-32">
        <SectionHeader numero={t.numero} eyebrow={t.eyebrow} />
        <div className="mt-14 grid gap-14 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Titulo id="contacto-titulo" data-split className="max-w-[14ch] text-[clamp(2.1rem,5vw,4.25rem)] leading-[1.02] text-white">
              {t.titulo}
            </Titulo>
            <dl className="mt-12 border-t border-white/10">
              {filas.map(({ icono: Icono, label, valor, href }) => (
                <div key={label} data-reveal className="flex gap-5 border-b border-white/10 py-6">
                  <Icono strokeWidth={1.25} className="mt-0.5 size-5 shrink-0 text-brick-300" aria-hidden="true" />
                  <div>
                    <dt className="eyebrow text-[0.68rem] text-warm-400">{label}</dt>
                    <dd className="mt-2 text-lg text-white">
                      {href ? (
                        <a href={href} className="underline-offset-4 hover:underline">
                          {valor}
                        </a>
                      ) : (
                        valor
                      )}
                    </dd>
                  </div>
                </div>
              ))}
              <div data-reveal className="flex gap-5 border-b border-white/10 py-6">
                <IconoInstagram className="mt-0.5 size-5 shrink-0 text-brick-300" />
                <div>
                  <dt className="eyebrow text-[0.68rem] text-warm-400">{t.instagram}</dt>
                  <dd className="mt-2 text-lg text-white">
                    <a href={sitio.instagram} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                      @{usuarioIg}
                      <span className="sr-only"> (se abre en una pestaña nueva)</span>
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
            <div data-reveal className="mt-10 flex flex-col gap-3 sm:flex-row">
              <BotonCta href={waLink(sitio.whatsapp, whatsappMensajes.general)} externo>
                {t.whatsappCta}
              </BotonCta>
              <a
                href={telLink(sitio.telefono)}
                className="inline-flex h-14 items-center justify-center gap-3 border border-white/20 px-6 text-white transition-colors hover:border-brick-300"
              >
                <Phone strokeWidth={1.5} className="size-4" aria-hidden="true" />
                {t.llamar}
              </a>
            </div>
          </div>

          <div data-reveal className="lg:col-span-6 lg:col-start-7">
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-ink-2 grid-plano sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[520px]">
              <iframe
                title={t.mapaTitulo}
                src={mapa}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full [filter:grayscale(1)_invert(0.9)_contrast(0.9)_brightness(0.95)]"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
