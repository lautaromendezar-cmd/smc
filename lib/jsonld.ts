import { empresa, contactoRespaldo } from '@/content/textos'
import type { Sitio } from './datos'
import { SITE_URL } from './site'

/** JSON-LD GeneralContractor (subtipo de LocalBusiness). Solo datos reales. */
export function jsonLdEmpresa(sitio: Sitio) {
  const tel = '+54 ' + sitio.telefono.replace(/^0/, '')
  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${SITE_URL}/#empresa`,
    name: empresa.nombre,
    alternateName: empresa.nombreHistorico,
    slogan: empresa.lema,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.png`,
    image: `${SITE_URL}/og.jpg`,
    telephone: tel,
    ...(sitio.email ? { email: sitio.email } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'San Martín 578',
      addressLocality: 'Capilla del Señor',
      postalCode: '2812',
      addressRegion: 'Buenos Aires',
      addressCountry: 'AR',
    },
    areaServed: 'Capilla del Señor y alrededores, provincia de Buenos Aires',
    sameAs: [sitio.instagram || contactoRespaldo.instagram],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: tel,
      contactType: 'customer service',
      availableLanguage: 'es',
    },
  }
}

/** Serializa para <script type="application/ld+json"> sin permitir cerrar la etiqueta. */
export const ldScript = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')
