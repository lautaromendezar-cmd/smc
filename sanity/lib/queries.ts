import { defineQuery } from 'next-sanity'

const imagen = /* groq */ `{
  alt,
  crop,
  hotspot,
  "asset": asset->{ _id, url, "lqip": metadata.lqip, "width": metadata.dimensions.width, "height": metadata.dimensions.height }
}`

const obraCard = /* groq */ `
  _id,
  titulo,
  "slug": slug.current,
  estado,
  categoria,
  ubicacion,
  anio,
  descripcionCorta,
  destacada,
  "imagen": imagenPrincipal${imagen}
`

// orden: primero las que tienen número, después las más nuevas
const ordenObras = /* groq */ `order(coalesce(orden, 9999) asc, _createdAt desc)`

export const configQuery = defineQuery(`*[_type == "configuracion" && _id == "configuracion"][0]{
  telefono,
  whatsapp,
  email,
  direccion,
  instagram,
  quienesSomos,
  aniosTrayectoria,
  "heroImagen": heroImagen${imagen},
  "heroImagenMovil": heroImagenMovil${imagen},
  "ctaImagen": ctaImagen${imagen},
  "heroVideo": heroVideo.asset->url,
  "heroVideoMovil": heroVideoMovil.asset->url,
  "secuencia": {
    "estructura": secuencia.estructura${imagen},
    "ejecucion": secuencia.ejecucion${imagen},
    "terminada": secuencia.terminada${imagen}
  }
}`)

export const obrasQuery = defineQuery(`*[_type == "obra" && defined(slug.current)] | ${ordenObras} {${obraCard}}`)

export const destacadasQuery = defineQuery(
  `*[_type == "obra" && defined(slug.current) && destacada == true] | ${ordenObras} [0...6] {${obraCard}}`,
)

export const obraQuery = defineQuery(`*[_type == "obra" && slug.current == $slug][0]{
  ${obraCard},
  descripcion,
  "galeria": galeria[]{ _key, ...${imagen} }
}`)

export const slugsQuery = defineQuery(`*[_type == "obra" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`)
