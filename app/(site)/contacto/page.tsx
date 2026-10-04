import type { Metadata } from 'next'
import { getSitio } from '@/lib/datos'
import Contacto from '@/components/contacto/Contacto'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Escribinos por WhatsApp o visitanos en San Martín 578, Capilla del Señor. Teléfono 11 4940-0955.',
  alternates: { canonical: '/contacto' },
}

export default async function ContactoPage() {
  const sitio = await getSitio()
  return <Contacto sitio={sitio} comoPagina />
}
