import { whatsappMensajes } from '@/content/textos'
import { getDestacadas, getSitio } from '@/lib/datos'
import { jsonLdEmpresa, ldScript } from '@/lib/jsonld'
import { waLink } from '@/lib/site'
import Hero from '@/components/home/Hero'
import Nosotros from '@/components/home/Nosotros'
import Servicios from '@/components/home/Servicios'
import Proceso from '@/components/home/Proceso'
import Marquee from '@/components/home/Marquee'
import Destacadas from '@/components/home/Destacadas'
import CtaFinal from '@/components/home/CtaFinal'
import Contacto from '@/components/contacto/Contacto'

export default async function HomePage() {
  const [sitio, destacadas] = await Promise.all([getSitio(), getDestacadas()])
  const wa = waLink(sitio.whatsapp, whatsappMensajes.general)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript(jsonLdEmpresa(sitio)) }} />
      <Hero desktop={sitio.hero.desktop} movil={sitio.hero.movil} whatsappHref={wa} />
      <Nosotros texto={sitio.quienesSomos} anios={sitio.anios} />
      <Servicios />
      <Proceso secuencia={sitio.secuencia} />
      <Marquee />
      <Destacadas obras={destacadas} instagram={sitio.instagram} />
      <CtaFinal img={sitio.secuencia.terminada ?? sitio.hero.desktop} whatsappHref={wa} />
      <Contacto sitio={sitio} />
    </>
  )
}
