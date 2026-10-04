import { defineField, defineType } from 'sanity'

/**
 * Imagen con recorte (hotspot) y texto alternativo obligatorio.
 * Se usa en obras, hero y secuencia de obra.
 */
export const imagenConAlt = defineType({
  name: 'imagenConAlt',
  title: 'Imagen',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Descripción de la imagen',
      type: 'string',
      description:
        'Contá en pocas palabras qué se ve en la foto (por ejemplo: "Frente de la nave con vidrios, de noche"). Lo usan Google y las personas con lectores de pantalla.',
      validation: (r) => r.required().error('Escribí una descripción corta de la foto.').max(160),
    }),
  ],
})
