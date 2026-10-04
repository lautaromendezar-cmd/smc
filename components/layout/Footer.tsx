import Image from 'next/image'
import Link from 'next/link'
import { empresa, nav } from '@/content/textos'
import type { Sitio } from '@/lib/datos'
import { telLink, waLink } from '@/lib/site'
import { whatsappMensajes } from '@/content/textos'
import { IconoInstagram, IconoWhatsApp } from '@/components/ui/IconosMarca'

export default function Footer({ sitio }: { sitio: Sitio }) {
  const anio = new Date().getFullYear()
  return (
    <footer className="relative border-t border-white/10 bg-ink pt-16 pb-24 md:pt-20 md:pb-12">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Image src="/brand/logo.webp" alt={empresa.nombre} width={1642} height={767} className="h-auto w-44" />
            <p className="mt-6 max-w-sm font-display text-xl leading-snug tracking-tight text-white">{empresa.lema}</p>
            <p className="mt-3 text-sm text-warm-400">Antes {empresa.nombreHistorico}.</p>
          </div>

          <nav aria-label="Pie de página" className="md:col-span-3">
            <p className="eyebrow mb-5 text-warm-400">Sitio</p>
            <ul className="space-y-3">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-warm-200 transition-colors hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="eyebrow mb-5 text-warm-400">Contacto</p>
            <address className="space-y-3 text-warm-200 not-italic">
              <p>{sitio.direccion}</p>
              <p>
                <a href={telLink(sitio.telefono)} className="transition-colors hover:text-white">
                  {sitio.telefono}
                </a>
              </p>
              {sitio.email && (
                <p>
                  <a href={`mailto:${sitio.email}`} className="transition-colors hover:text-white">
                    {sitio.email}
                  </a>
                </p>
              )}
            </address>
            <div className="mt-6 flex gap-3">
              <a
                href={waLink(sitio.whatsapp, whatsappMensajes.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-11 place-items-center border border-white/15 text-warm-200 transition-colors hover:border-brick-300 hover:text-white"
                aria-label="WhatsApp (se abre en una pestaña nueva)"
              >
                <IconoWhatsApp className="size-[18px]" />
              </a>
              <a
                href={sitio.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-11 place-items-center border border-white/15 text-warm-200 transition-colors hover:border-brick-300 hover:text-white"
                aria-label="Instagram (se abre en una pestaña nueva)"
              >
                <IconoInstagram className="size-[18px]" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-warm-400 md:flex-row md:items-center md:justify-between md:pr-20">
          <p>
            © {anio} {empresa.nombre}
          </p>
          <p>
            {empresa.profesional.rol}: {empresa.profesional.nombre} · {empresa.profesional.matriculas.join(' · ')}
          </p>
        </div>
      </div>
    </footer>
  )
}
