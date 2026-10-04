import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { empresa } from '@/content/textos'
import { NOINDEX, SITE_URL } from '@/lib/site'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'], display: 'swap', variable: '--font-manrope' })
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

const descripcion =
  'Empresa familiar de arquitectura y construcción con más de 30 años en Capilla del Señor. Diseño, dirección y construcción llave en mano de viviendas, naves industriales, locales comerciales y obra pública.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${empresa.nombre} | Capilla del Señor`, template: `%s | ${empresa.nombre}` },
  description: descripcion,
  applicationName: empresa.nombre,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: empresa.nombre,
    title: empresa.nombre,
    description: descripcion,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: `Logo de ${empresa.nombre}` }],
  },
  twitter: { card: 'summary_large_image' },
  robots: NOINDEX ? { index: false, follow: false, googleBot: { index: false, follow: false } } : undefined,
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#0b0b0b',
  colorScheme: 'dark',
}

/**
 * Corre ANTES de pintar (inline en el <head>, sin type="module"):
 * - data-pl="run" solo en la primera visita de la sesión, sin reduced-motion y fuera del Studio.
 * - .hero-pending oculta el título del hero hasta que GSAP toma el control.
 * - Respaldo: a los 4,5 s se libera todo aunque el JS no haya cargado.
 */
const introScript = `(function(){var d=document.documentElement;d.classList.add('js','hero-pending');var s='run';try{if(sessionStorage.getItem('smc-intro'))s='skip'}catch(e){s='skip'}try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)s='skip'}catch(e){}if(location.pathname.indexOf('/studio')===0)s='skip';d.setAttribute('data-pl',s);setTimeout(function(){if(d.getAttribute('data-pl')==='run')d.setAttribute('data-pl','done');d.classList.remove('hero-pending')},4500)})();`

/* Estilo crítico del preloader: tiene que estar antes del primer pintado.
   La primera parte (logo, línea, brillo, letras) es CSS: arranca con el primer
   pintado sin esperar el JS. GSAP solo hace la apertura (components/motion/Preloader). */
const criticalCss = `#pl{position:fixed;inset:0;z-index:2147483647}html:not([data-pl=run]) #pl{display:none}html[data-pl=run]{overflow:hidden}#pl .pl-half{position:absolute;inset:0;background:#0b0b0b;overflow:hidden}#pl .pl-top{clip-path:inset(0 0 50% 0)}#pl .pl-bot{clip-path:inset(50% 0 0 0)}@keyframes plUp{from{transform:translateY(105%) scale(1.05)}to{transform:none}}@keyframes plLetter{from{transform:translateY(110%)}to{transform:none}}@keyframes plLine{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes plShine{from{transform:translateX(-100%)}to{transform:translateX(100vw)}}html[data-pl=run] #pl .pl-sm{animation:plUp .7s cubic-bezier(.16,1,.3,1) .1s both}html[data-pl=run] #pl .pl-c{animation:plUp .7s cubic-bezier(.16,1,.3,1) .22s both}html[data-pl=run] #pl .pl-letter{animation:plLetter .38s cubic-bezier(.33,1,.68,1) both}html[data-pl=run] #pl .pl-line{animation:plLine .6s cubic-bezier(.65,0,.35,1) .55s both}html[data-pl=run] #pl .pl-shine{animation:plShine .6s cubic-bezier(.45,0,.55,1) .95s both}html[data-pl=run] .hero-media{transform:scale(1.15)}html.hero-pending [data-hero-hide]{visibility:hidden}`

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" className={`${manrope.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
