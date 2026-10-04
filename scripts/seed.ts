/**
 * Carga datos iniciales en Sanity:
 *  - singleton "Configuración del sitio" con los datos reales del cliente
 *  - imágenes de /material/generadas (IA, todas marcadas "[EJEMPLO]") y algunas
 *    de /material/frames (reales, de Instagram) subidas como assets
 *  - obras de ejemplo con título "[EJEMPLO] …": 3 categorías (naves, viviendas
 *    rurales, viviendas familiares), cada una en ejecución y terminada, más
 *    2 obras con fotos reales (baño y edificio institucional)
 *
 * Es idempotente: ids fijos + createOrReplace; Sanity no duplica assets iguales.
 * Requiere SANITY_API_WRITE_TOKEN en .env.local (NUNCA en Vercel).
 *
 * Uso: npm run seed
 */
import { config } from 'dotenv'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@sanity/client'
import { contactoRespaldo } from '../content/textos'
import { mejorar } from './lib/mejorar.mjs'

config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN
if (!projectId || !token) {
  console.error('Faltan NEXT_PUBLIC_SANITY_PROJECT_ID o SANITY_API_WRITE_TOKEN en .env.local')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2025-10-01', useCdn: false })
const ROOT = path.resolve(__dirname, '..')
const FRAMES = path.join(ROOT, 'material', 'frames')
const GENERADAS = path.join(ROOT, 'material', 'generadas')

let n = 0
const key = () => `k${(++n).toString(36)}${Math.random().toString(36).slice(2, 7)}`

type ImgField = { _type: 'imagenConAlt'; _key?: string; asset: { _type: 'reference'; _ref: string }; alt: string }

const cache = new Map<string, string>()
async function subir(file: string): Promise<string | null> {
  if (cache.has(file)) return cache.get(file)!
  try {
    await stat(file)
  } catch {
    console.warn(`  · falta ${path.relative(ROOT, file)}`)
    return null
  }
  // frames de video: mejora suave antes de subir; las generadas van tal cual
  const raw = await readFile(file)
  const buf = file.startsWith(FRAMES) ? await mejorar(raw) : raw
  const asset = await client.assets.upload('image', buf, { filename: path.basename(file).replace(/\.png$/, '.jpg') })
  cache.set(file, asset._id)
  console.log(`  ↑ ${path.basename(file)}`)
  return asset._id
}

async function img(file: string, alt: string, opts: { galeria?: boolean } = {}): Promise<ImgField | null> {
  const id = await subir(file)
  if (!id) return null
  return { _type: 'imagenConAlt', ...(opts.galeria ? { _key: key() } : {}), asset: { _type: 'reference', _ref: id }, alt }
}
const frame = (name: string) => path.join(FRAMES, `${name}.png`)
const gen = (name: string) => path.join(GENERADAS, `${name}.png`)

async function galeria(items: [string, string][]) {
  const out: ImgField[] = []
  for (const [f, alt] of items) {
    const i = await img(f, alt, { galeria: true })
    if (i) out.push(i)
  }
  return out
}

function bloques(...parrafos: string[]) {
  return parrafos.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }))
}

const AVISO = 'Obra de ejemplo para mostrar cómo se ve una ficha. Reemplazala por una obra real o borrala.'

async function main() {
  console.log(`Sanity ${projectId}/${dataset}`)

  // ---------- configuración ----------
  console.log('Configuración del sitio')
  const r = contactoRespaldo
  await client.createOrReplace({
    _id: 'configuracion',
    _type: 'configuracion',
    telefono: r.telefono,
    whatsapp: r.whatsapp,
    direccion: r.direccion,
    instagram: r.instagram,
    quienesSomos: r.quienesSomos,
    aniosTrayectoria: r.aniosTrayectoria,
    heroImagen: await img(gen('hero'), '[EJEMPLO] Nave comercial con frente vidriado iluminada en la hora azul'),
    heroImagenMovil: await img(gen('hero-movil'), '[EJEMPLO] Galería de una nave comercial iluminada de noche'),
    ctaImagen: await img(gen('cta'), '[EJEMPLO] Esquina del frente vidriado al atardecer'),
    secuencia: {
      estructura: await img(gen('etapa-estructura'), '[EJEMPLO] Estructura metálica de la nave en obra'),
      ejecucion: await img(gen('etapa-ejecucion'), '[EJEMPLO] La nave en ejecución, con parte del vidriado colocado'),
      terminada: await img(gen('etapa-terminada'), '[EJEMPLO] La nave terminada e iluminada en la hora azul'),
    },
  })

  // ---------- obras de ejemplo ----------
  console.log('Obras de ejemplo')
  const obras = [
    {
      _id: 'obra-ejemplo-1',
      titulo: '[EJEMPLO] Nave comercial con frente vidriado',
      slug: 'ejemplo-nave-comercial-frente-vidriado',
      estado: 'terminada',
      categoria: 'comercial',
      destacada: true,
      descripcionCorta: 'Showroom con estructura metálica, fachada vidriada de doble altura e iluminación perimetral.',
      descripcion: bloques(AVISO, 'Acá se cuenta la obra: qué pidió el cliente, cómo se resolvió, materiales y tiempos. Dos o tres párrafos alcanzan.'),
      imagenPrincipal: await img(gen('etapa-terminada'), '[EJEMPLO] Frente de la nave iluminado en la hora azul'),
      galeria: await galeria([
        [gen('hero'), '[EJEMPLO] Vista aérea de la nave en la hora azul'],
        [gen('hero-movil'), '[EJEMPLO] Galería de acceso iluminada'],
        [gen('cta'), '[EJEMPLO] Esquina del frente vidriado al atardecer'],
        [frame('nave-interior-terminada'), 'Interior de la nave terminado, con piso de porcelanato'],
      ]),
    },
    {
      _id: 'obra-ejemplo-2',
      titulo: '[EJEMPLO] Nave industrial en estructura metálica',
      slug: 'ejemplo-nave-industrial-estructura-metalica',
      estado: 'ejecucion',
      categoria: 'industrial',
      destacada: true,
      descripcionCorta: 'Montaje de pórticos y cerchas metálicas. Así se ve una obra cargada como "En ejecución".',
      descripcion: bloques(AVISO, 'Mientras la obra avanza podés ir sumando fotos a la galería y, al terminarla, cambiar el estado a "Terminada".'),
      imagenPrincipal: await img(gen('etapa-estructura'), '[EJEMPLO] Estructura metálica de la nave'),
      galeria: await galeria([
        [gen('etapa-ejecucion'), '[EJEMPLO] Colocación del vidriado'],
        [frame('nave-estructura-andamios'), 'Estructura metálica con andamios durante el montaje'],
        [frame('nave-estructura-esquina'), 'Esquina de la estructura con la cubierta colocada'],
      ]),
    },
    {
      _id: 'obra-ejemplo-3',
      titulo: '[EJEMPLO] Casa de campo de estilo colonial',
      slug: 'ejemplo-casa-de-campo-colonial',
      estado: 'terminada',
      categoria: 'vivienda-rural',
      destacada: true,
      descripcionCorta: 'Muros blancos, techo de tejas y galería de madera mirando al campo.',
      descripcion: bloques(AVISO),
      imagenPrincipal: await img(gen('rural-exterior'), '[EJEMPLO] Casa de campo de estilo colonial al atardecer'),
      galeria: await galeria([
        [gen('rural-galeria'), '[EJEMPLO] Galería con postes de madera y piso de ladrillo'],
        [gen('rural-living'), '[EJEMPLO] Living con vigas a la vista y hogar de ladrillo'],
      ]),
    },
    {
      _id: 'obra-ejemplo-4',
      titulo: '[EJEMPLO] Casa de campo en construcción',
      slug: 'ejemplo-casa-de-campo-en-construccion',
      estado: 'ejecucion',
      categoria: 'vivienda-rural',
      destacada: true,
      descripcionCorta: 'Muros de ladrillo levantados y estructura de techo de madera lista para las tejas.',
      descripcion: bloques(AVISO),
      imagenPrincipal: await img(gen('rural-obra'), '[EJEMPLO] Casa de campo en obra, con la estructura del techo'),
      galeria: [],
    },
    {
      _id: 'obra-ejemplo-5',
      titulo: '[EJEMPLO] Vivienda familiar en planta baja',
      slug: 'ejemplo-vivienda-familiar-planta-baja',
      estado: 'terminada',
      categoria: 'vivienda-familiar',
      destacada: true,
      descripcionCorta: 'Ladrillo visto y revoque blanco, aberturas negras y un living abierto al patio con parrilla.',
      descripcion: bloques(AVISO),
      imagenPrincipal: await img(gen('familiar-exterior'), '[EJEMPLO] Frente de la vivienda en ladrillo visto y revoque blanco'),
      galeria: await galeria([[gen('familiar-cocina'), '[EJEMPLO] Cocina integrada al living, abierta al patio']]),
    },
    {
      _id: 'obra-ejemplo-6',
      titulo: '[EJEMPLO] Vivienda de dos plantas',
      slug: 'ejemplo-vivienda-dos-plantas',
      estado: 'ejecucion',
      categoria: 'vivienda-familiar',
      destacada: true,
      descripcionCorta: 'Estructura de hormigón terminada y mampostería en curso.',
      descripcion: bloques(AVISO),
      imagenPrincipal: await img(gen('familiar-obra'), '[EJEMPLO] Vivienda de dos plantas en obra'),
      galeria: await galeria([[gen('familiar-dos-plantas-noche'), '[EJEMPLO] Cómo va a quedar la vivienda terminada']]),
    },
    {
      _id: 'obra-ejemplo-7',
      titulo: '[EJEMPLO] Remodelación de baño',
      slug: 'ejemplo-remodelacion-bano',
      estado: 'terminada',
      categoria: 'remodelacion',
      destacada: false,
      descripcionCorta: 'Revestimientos de porcelanato, vanitory de madera y ventana de aluminio.',
      descripcion: bloques(AVISO),
      imagenPrincipal: await img(frame('bano-ducha-porcelanato'), 'Baño con revestimiento de porcelanato gris y ducha'),
      galeria: await galeria([[frame('bano-vanitory-madera'), 'Baño con vanitory de madera y revestimiento de piedra']]),
    },
    {
      _id: 'obra-ejemplo-8',
      titulo: '[EJEMPLO] Edificio institucional',
      slug: 'ejemplo-edificio-institucional',
      estado: 'terminada',
      categoria: 'obra-publica',
      destacada: false,
      descripcionCorta: 'Pasillo de espera con aberturas de aluminio y terminaciones claras.',
      descripcion: bloques(AVISO),
      imagenPrincipal: await img(frame('institucional-pasillo-espera'), 'Pasillo de espera de un edificio institucional'),
      galeria: [],
    },
  ]

  const tx = client.transaction()
  obras.forEach((o, i) => {
    const { slug, imagenPrincipal, ...rest } = o
    tx.createOrReplace({
      ...rest,
      _type: 'obra',
      slug: { _type: 'slug', current: slug },
      ubicacion: 'Ubicación de ejemplo',
      orden: i + 1,
      ...(imagenPrincipal ? { imagenPrincipal } : {}),
    })
  })
  await tx.commit()
  console.log(`Listo: configuración + ${obras.length} obras de ejemplo.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
