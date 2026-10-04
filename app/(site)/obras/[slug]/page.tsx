import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PortableText } from 'next-sanity'
import { obraDetalle as t, whatsappMensajes } from '@/content/textos'
import { getObra, getSitio, getSlugs } from '@/lib/datos'
import { fromSanity } from '@/lib/imagen'
import { waLink } from '@/lib/site'
import { categoriaLabel, estadoLabel } from '@/sanity/schemas/opciones'
import { sanityBaseUrl } from '@/sanity/lib/image'
import Reveal from '@/components/motion/Reveal'
import Parallax from '@/components/motion/Parallax'
import Imagen from '@/components/ui/Imagen'
import BotonCta from '@/components/ui/BotonCta'
import Galeria from '@/components/obras/Galeria'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getSlugs()).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const obra = await getObra(slug)
  if (!obra) return { title: 'Obra no encontrada' }
  const descripcion =
    obra.descripcionCorta ||
    `${categoriaLabel(obra.categoria)}${obra.ubicacion ? ` en ${obra.ubicacion}` : ''}. ${estadoLabel(obra.estado)}.`
  const og = obra.imagen?.asset ? `${sanityBaseUrl(obra.imagen, 1200 / 630, 1200)}&auto=format` : '/og.jpg'
  return {
    title: obra.titulo,
    description: descripcion,
    alternates: { canonical: `/obras/${slug}` },
    openGraph: { title: obra.titulo, description: descripcion, images: [{ url: og, width: 1200, height: 630 }] },
  }
}

export default async function ObraPage({ params }: Props) {
  const { slug } = await params
  const [obra, sitio] = await Promise.all([getObra(slug), getSitio()])
  if (!obra) notFound()

  const fotos = [
    ...(obra.imagen?.asset ? [{ ...obra.imagen, _key: 'principal' }] : []),
    ...(obra.galeria ?? []).filter((f) => f.asset),
  ]
  const ficha = [
    { label: t.estado, valor: estadoLabel(obra.estado) },
    { label: t.categoria, valor: categoriaLabel(obra.categoria) },
    { label: t.ubicacion, valor: obra.ubicacion },
    { label: t.anio, valor: obra.anio ? String(obra.anio) : null },
  ].filter((f) => f.valor)
  const wa = waLink(sitio.whatsapp, whatsappMensajes.obra(obra.titulo))

  return (
    <article className="bg-ink">
      {/* portada */}
      <header className="relative isolate flex min-h-[86svh] items-end overflow-hidden pt-32 pb-12 md:pb-16">
        <Parallax className="absolute inset-0 -z-10">
          <div className="absolute inset-x-0 -top-[8%] -bottom-[8%]" data-parallax>
            <Imagen img={fromSanity(obra.imagen, obra.titulo)} sizes="100vw" preload />
          </div>
        </Parallax>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(11,11,11,0.7)_0%,rgba(11,11,11,0.1)_35%,rgba(11,11,11,0.9)_100%)]" aria-hidden="true" />
        <Reveal className="container-x">
          <Link href="/obras" className="eyebrow inline-flex items-center gap-2 text-warm-200 hover:text-white">
            <ArrowLeft strokeWidth={1.5} className="size-4" aria-hidden="true" /> {t.volver}
          </Link>
          <h1 data-split className="mt-6 max-w-[20ch] text-[clamp(2.4rem,7vw,6.25rem)] leading-[0.96] tracking-[-0.045em] text-white">
            {obra.titulo}
          </h1>
          <p data-reveal className="mt-6 inline-flex items-center gap-2 text-warm-200">
            <span className={`size-2 ${obra.estado === 'ejecucion' ? 'bg-brick-300' : 'bg-warm-300'}`} aria-hidden="true" />
            {[estadoLabel(obra.estado), categoriaLabel(obra.categoria), obra.ubicacion].filter(Boolean).join(' · ')}
          </p>
        </Reveal>
      </header>

      {/* ficha + texto */}
      <Reveal className="container-x grid gap-14 py-20 md:py-28 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <p className="eyebrow text-warm-400">{t.ficha}</p>
          <dl className="mt-6 border-t border-white/10">
            {ficha.map((f) => (
              <div key={f.label} data-reveal className="flex justify-between gap-6 border-b border-white/10 py-4">
                <dt className="text-warm-400">{f.label}</dt>
                <dd className="text-right text-white">{f.valor}</dd>
              </div>
            ))}
          </dl>
        </aside>
        <div className="lg:col-span-7 lg:col-start-6">
          {obra.descripcionCorta && (
            <p data-reveal className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-snug tracking-tight text-white">
              {obra.descripcionCorta}
            </p>
          )}
          {obra.descripcion && obra.descripcion.length > 0 && (
            <div
              data-reveal
              className="mt-8 max-w-[62ch] space-y-5 text-lg leading-relaxed text-warm-300 [&_h3]:mt-10 [&_h3]:text-2xl [&_h3]:text-white [&_strong]:text-white [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5"
            >
              <PortableText value={obra.descripcion} />
            </div>
          )}
        </div>
      </Reveal>

      {fotos.length > 0 && (
        <section className="container-x pb-20 md:pb-28" aria-labelledby="galeria-titulo">
          <h2 id="galeria-titulo" className="eyebrow mb-8 text-warm-400">
            {t.galeria} · {fotos.length} {fotos.length === 1 ? 'foto' : 'fotos'}
          </h2>
          <Galeria fotos={fotos} titulo={obra.titulo} />
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-white/10">
        <div className="container-x flex flex-col gap-8 py-20 md:flex-row md:items-center md:justify-between md:py-24">
          <p className="max-w-[22ch] font-display text-[clamp(1.8rem,4vw,3.25rem)] leading-tight tracking-tight text-white">{t.ctaTexto}</p>
          <BotonCta href={wa} externo>
            {t.cta}
          </BotonCta>
        </div>
      </section>
    </article>
  )
}
