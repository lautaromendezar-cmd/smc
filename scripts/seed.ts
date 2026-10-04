/**
 * Carga datos iniciales en Sanity:
 *  - singleton "Configuración del sitio" con los datos reales del cliente
 *  - imágenes de /material/frames (reales, de Instagram) y /material/generadas
 *    (IA, se marcan "[EJEMPLO]") subidas como assets
 *  - 6 obras de ejemplo (3 en ejecución, 3 terminadas) con título "[EJEMPLO] …"
 *
 * Es idempotente: ids fijos + createOrReplace; Sanity no duplica assets iguales.
 * Requiere SANITY_API_WRITE_TOKEN en .env.local (NUNCA en Vercel).
 *
 * Uso: npm run seed
 */
import { config } from 'dotenv'
import { readdir, readFile, stat } from 'node:fs/promises'
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
async function subir(file: string, opts: { noche?: boolean } = {}): Promise<string | null> {
  if (cache.has(file)) return cache.get(file)!
  try {
    await stat(file)
  } catch {
    console.warn(`  · falta ${path.relative(ROOT, file)}`)
    return null
  }
  // frames de video: mejora suave antes de subir; las generadas van tal cual
  const buf = file.startsWith(FRAMES) ? await mejorar(await readFile(file), opts) : await readFile(file)
  const asset = await client.assets.upload('image', buf, { filename: path.basename(file).replace(/\.png$/, '.jpg') })
  cache.set(file, asset._id)
  console.log(`  ↑ ${path.basename(file)}`)
  return asset._id
}

async function img(file: string, alt: string, opts: { noche?: boolean; galeria?: boolean } = {}): Promise<ImgField | null> {
  const id = await subir(file, opts)
  if (!id) return null
  return { _type: 'imagenConAlt', ...(opts.galeria ? { _key: key() } : {}), asset: { _type: 'reference', _ref: id }, alt }
}
const frame = (name: string) => path.join(FRAMES, `${name}.png`)

function bloques(...parrafos: string[]) {
  return parrafos.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }))
}

async function generadas(): Promise<string[]> {
  try {
    return (await readdir(GENERADAS))
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort()
      .map((f) => path.join(GENERADAS, f))
  } catch {
    return []
  }
}

const AVISO = 'Obra de ejemplo para mostrar cómo se ve una ficha. Reemplazala por una obra real o borrala.'

async function main() {
  console.log(`Sanity ${projectId}/${dataset}`)

  // ---------- configuración ----------
  console.log('Configuración del sitio')
  const r = contactoRespaldo
  const configDoc = {
    _id: 'configuracion',
    _type: 'configuracion',
    telefono: r.telefono,
    whatsapp: r.whatsapp,
    direccion: r.direccion,
    instagram: r.instagram,
    quienesSomos: r.quienesSomos,
    aniosTrayectoria: r.aniosTrayectoria,
    heroImagen: await img(frame('nave-noche-aerea'), 'Nave comercial con frente vidriado iluminada de noche, vista aérea', { noche: true }),
    heroImagenMovil: await img(frame('nave-noche-galeria-iluminada'), 'Galería de la nave comercial iluminada de noche', { noche: true }),
    secuencia: {
      estructura: await img(frame('nave-estructura-metalica-frente'), 'Estructura metálica de la nave comercial en obra'),
      ejecucion: await img(frame('nave-fachada-vidriada-ejecucion'), 'Fachada vidriada de la nave durante la ejecución'),
      terminada: await img(frame('nave-noche-galeria-iluminada'), 'La nave terminada e iluminada de noche', { noche: true }),
    },
  }
  await client.createOrReplace(configDoc)

  // ---------- obras de ejemplo ----------
  const gen = await generadas()
  const genImg = async (i: number) => (gen[i] ? img(gen[i], `[EJEMPLO] Imagen generada de ejemplo ${i + 1}`) : null)
  const genGaleria = async (from: number) =>
    (await Promise.all(gen.slice(from, from + 3).map((f, j) => img(f, `[EJEMPLO] Imagen generada de ejemplo ${from + j + 1}`, { galeria: true })))).filter(Boolean)

  const galeria = async (items: [string, string, boolean?][]) =>
    (await Promise.all(items.map(([f, alt, noche]) => img(frame(f), alt, { galeria: true, noche })))).filter(Boolean)

  console.log('Obras de ejemplo')
  const obras = [
    {
      _id: 'obra-ejemplo-1',
      titulo: '[EJEMPLO] Nave comercial con frente vidriado',
      slug: 'ejemplo-nave-comercial-frente-vidriado',
      estado: 'terminada',
      categoria: 'comercial',
      orden: 1,
      descripcionCorta: 'Nave con estructura metálica, fachada vidriada de doble altura e iluminación perimetral. ' + 'Texto de ejemplo.',
      descripcion: bloques(
        AVISO,
        'Acá se cuenta la obra: qué pidió el cliente, cómo se resolvió, materiales y tiempos. Dos o tres párrafos alcanzan.',
      ),
      imagenPrincipal: await img(frame('nave-noche-galeria-iluminada'), 'Galería de la nave iluminada de noche', { noche: true }),
      galeria: await galeria([
        ['nave-noche-aerea', 'Vista aérea nocturna de la nave', true],
        ['nave-fachada-vidriada-lateral', 'Fachada vidriada lateral'],
        ['nave-vidriado-lateral-alero', 'Vidriado lateral bajo el alero'],
        ['nave-interior-terminada', 'Interior de la nave terminado, con piso de porcelanato'],
        ['nave-interior-porcelanato', 'Piso de porcelanato símil mármol'],
      ]),
    },
    {
      _id: 'obra-ejemplo-2',
      titulo: '[EJEMPLO] Nave industrial: estructura metálica',
      slug: 'ejemplo-nave-industrial-estructura-metalica',
      estado: 'ejecucion',
      categoria: 'industrial',
      orden: 2,
      descripcionCorta: 'Montaje de estructura metálica y cubierta. Así se ve una obra cargada como "En ejecución".',
      descripcion: bloques(AVISO, 'Mientras la obra avanza podés ir sumando fotos a la galería y, al terminarla, cambiar el estado a "Terminada".'),
      imagenPrincipal: await img(frame('nave-estructura-andamios'), 'Estructura metálica con andamios durante el montaje'),
      galeria: await galeria([
        ['nave-estructura-metalica-frente', 'Pórticos metálicos del frente'],
        ['nave-estructura-esquina', 'Esquina de la estructura con la cubierta colocada'],
        ['nave-interior-contrapiso', 'Interior con el contrapiso terminado'],
        ['nave-interior-porcelanato-colocacion', 'Colocación del porcelanato'],
      ]),
    },
    {
      _id: 'obra-ejemplo-3',
      titulo: '[EJEMPLO] Remodelación de baño',
      slug: 'ejemplo-remodelacion-bano',
      estado: 'terminada',
      categoria: 'remodelacion',
      orden: 3,
      descripcionCorta: 'Revestimientos de porcelanato, vanitory de madera y ventana de aluminio. Texto de ejemplo.',
      descripcion: bloques(AVISO),
      imagenPrincipal: await img(frame('bano-ducha-porcelanato'), 'Baño con revestimiento de porcelanato gris y ducha'),
      galeria: await galeria([['bano-vanitory-madera', 'Baño con vanitory de madera y revestimiento de piedra']]),
    },
    {
      _id: 'obra-ejemplo-4',
      titulo: '[EJEMPLO] Edificio institucional',
      slug: 'ejemplo-edificio-institucional',
      estado: 'terminada',
      categoria: 'obra-publica',
      orden: 4,
      descripcionCorta: 'Pasillo de espera con aberturas de aluminio y terminaciones claras. Texto de ejemplo.',
      descripcion: bloques(AVISO),
      imagenPrincipal: await img(frame('institucional-pasillo-espera'), 'Pasillo de espera de un edificio institucional'),
      galeria: [],
    },
    {
      _id: 'obra-ejemplo-5',
      titulo: '[EJEMPLO] Casa de campo de estilo colonial',
      slug: 'ejemplo-casa-de-campo-colonial',
      estado: 'ejecucion',
      categoria: 'vivienda-rural',
      orden: 5,
      descripcionCorta: 'Ejemplo de vivienda rural. Si no hay foto todavía, el sitio muestra un recuadro neutro.',
      descripcion: bloques(AVISO),
      imagenPrincipal: await genImg(0),
      galeria: await genGaleria(1),
    },
    {
      _id: 'obra-ejemplo-6',
      titulo: '[EJEMPLO] Vivienda familiar',
      slug: 'ejemplo-vivienda-familiar',
      estado: 'ejecucion',
      categoria: 'vivienda-familiar',
      orden: 6,
      descripcionCorta: 'Ejemplo de vivienda familiar en ejecución. Texto de ejemplo.',
      descripcion: bloques(AVISO),
      imagenPrincipal: await genImg(4),
      galeria: await genGaleria(5),
    },
  ]

  const tx = client.transaction()
  for (const o of obras) {
    const { slug, imagenPrincipal, ...rest } = o
    tx.createOrReplace({
      ...rest,
      _type: 'obra',
      slug: { _type: 'slug', current: slug },
      ubicacion: 'Ubicación de ejemplo',
      destacada: true,
      ...(imagenPrincipal ? { imagenPrincipal } : {}),
    })
  }
  await tx.commit()
  console.log(`Listo: configuración + ${obras.length} obras de ejemplo.`)
  if (!gen.length) console.log('Aviso: /material/generadas está vacía; las 2 viviendas quedaron sin foto (placeholder).')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
