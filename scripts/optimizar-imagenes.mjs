/**
 * Genera los assets optimizados que SÍ van al repo (public/img y public/og.jpg)
 * a partir de /material (que no se commitea).
 *
 * - Respaldo local de hero y secuencia de obra: se usan solo si Sanity no
 *   está configurado o el campo está vacío. El contenido real vive en Sanity.
 * - Mejora suave de los frames de Instagram (ruido de compresión, nitidez,
 *   un poco de exposición en las nocturnas).
 * - WebP <= 300 KB + placeholder blur en content/imagenes-locales.json.
 *
 * Uso: node scripts/optimizar-imagenes.mjs
 */
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { mejorar } from './lib/mejorar.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FRAMES = path.join(ROOT, 'material', 'frames')
const OUT = path.join(ROOT, 'public', 'img')
const MAX_BYTES = 300 * 1024

const ASSETS = [
  { name: 'hero', src: 'nave-noche-aerea.png', noche: true, alt: 'Nave comercial con frente vidriado iluminada de noche, vista aérea' },
  { name: 'hero-movil', src: 'nave-noche-galeria-iluminada.png', noche: true, alt: 'Galería de una nave comercial iluminada de noche' },
  { name: 'etapa-estructura', src: 'nave-estructura-metalica-frente.png', alt: 'Estructura metálica de una nave comercial en obra' },
  { name: 'etapa-ejecucion', src: 'nave-fachada-vidriada-ejecucion.png', alt: 'Fachada vidriada de la nave durante la ejecución' },
  { name: 'etapa-terminada', src: 'nave-noche-galeria-iluminada.png', noche: true, alt: 'La nave terminada e iluminada de noche' },
]

async function encode(input, width) {
  for (const q of [82, 76, 70, 64, 58]) {
    const buf = await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: q, effort: 6 }).toBuffer()
    if (buf.length <= MAX_BYTES) return buf
  }
  throw new Error('no entra en 300 KB')
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const meta = {}
  for (const a of ASSETS) {
    const file = path.join(FRAMES, a.src)
    try {
      await stat(file)
    } catch {
      console.warn(`falta ${a.src}, se usa placeholder de marca`)
      continue
    }
    const improved = await mejorar(await readFile(file), { noche: a.noche })
    const buf = await encode(improved, 1600)
    await writeFile(path.join(OUT, `${a.name}.webp`), buf)
    const { width, height } = await sharp(buf).metadata()
    const blur = await sharp(buf).resize(16).webp({ quality: 40 }).toBuffer()
    meta[a.name] = {
      src: `/img/${a.name}.webp`,
      width,
      height,
      alt: a.alt,
      blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
    }
    console.log(`${a.name}.webp ${width}x${height} ${(buf.length / 1024).toFixed(0)} KB`)
  }
  await writeFile(path.join(ROOT, 'content', 'imagenes-locales.json'), JSON.stringify(meta, null, 2))

  // Open Graph: el logo sobre el negro del logo, 1200x630
  const logo = await sharp(path.join(ROOT, 'public', 'brand', 'logo.png')).resize({ width: 760 }).toBuffer()
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#0B0B0B' } })
    .composite([{ input: logo, gravity: 'center' }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(ROOT, 'public', 'og.jpg'))
  console.log('og.jpg 1200x630')

  // Ícono: "SMC" (sin subtítulo, ilegible en 32 px) sobre negro
  const sm = await sharp(path.join(ROOT, 'public', 'brand', 'pl-sm.webp')).toBuffer()
  const c = await sharp(path.join(ROOT, 'public', 'brand', 'pl-c.webp')).toBuffer()
  const smMeta = await sharp(sm).metadata()
  const cMeta = await sharp(c).metadata()
  const gap = Math.round(smMeta.height * 0.14)
  const markW = smMeta.width + gap + cMeta.width
  const mark = await sharp({ create: { width: markW, height: smMeta.height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: sm, left: 0, top: 0 }, { input: c, left: smMeta.width + gap, top: 0 }])
    .png()
    .toBuffer()
  const markSized = await sharp(mark).resize({ width: 400 }).toBuffer()
  // sharp redimensiona ANTES de componer: primero se arma el 512 y después se achica
  const icon = await sharp({ create: { width: 512, height: 512, channels: 3, background: '#0B0B0B' } })
    .composite([{ input: markSized, gravity: 'center' }])
    .png()
    .toBuffer()
  for (const [file, size] of [['app/icon.png', 512], ['app/apple-icon.png', 180]]) {
    await sharp(icon).resize(size).png().toFile(path.join(ROOT, file))
  }
  console.log('icon.png / apple-icon.png')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
