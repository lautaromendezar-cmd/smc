import Preloader from '@/components/motion/Preloader'
import LenisProvider from '@/components/motion/LenisProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppFlotante from '@/components/layout/WhatsAppFlotante'
import { whatsappMensajes } from '@/content/textos'
import { getSitio } from '@/lib/datos'
import { waLink } from '@/lib/site'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const sitio = await getSitio()
  const wa = waLink(sitio.whatsapp, whatsappMensajes.general)
  return (
    <>
      <Preloader />
      <LenisProvider />
      <Navbar whatsappHref={wa} />
      <main id="contenido">{children}</main>
      <Footer sitio={sitio} />
      <WhatsAppFlotante href={wa} />
    </>
  )
}
